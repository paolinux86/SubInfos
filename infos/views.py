# -*- coding: utf8 -*-
# Create your views here.
from django.shortcuts import render_to_response, get_object_or_404
from django.http import HttpResponse
from django.template import RequestContext
from django.db import connection, transaction
from django.core.exceptions import ObjectDoesNotExist
from django.core.urlresolvers import reverse
from datetime import datetime
from django.core import serializers
from infos.models import *
from libs.svndiff2html.svndiff2html.SvnDiff2Html import SvnDiff2Html

import subprocess, os, re
import json
import xml.etree.ElementTree as ET

from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied

import logging
logger = logging.getLogger(__name__)

@login_required
def main2(request):
	return render_to_response(
		'infos/index.html',
		{
		},
		context_instance = RequestContext(request),
	)

def repo_list(request):
	if not request.user.is_authenticated():
		raise PermissionDenied

	repositories = [ { "id": repo.id, "url": repo.url, "name": repo.name } for repo in Repository.objects.all() ]
	# repos_json = serializers.serialize("json", repositories)
	repos_json = json.dumps(repositories)
	return HttpResponse(repos_json, mimetype = 'application/json')

def commitDetail(request, commit_id):
	if not request.user.is_authenticated():
		raise PermissionDenied

	commit = repositories = [ { "id": c.id, "revision": c.revision, "datetime": c.datetime, "comment": c.comment, "username": str(c.username) } for c in Commit.objects.filter(id = commit_id) ]

	dthandler = __getDateHandler()
	commit_json = json.dumps(commit, default = dthandler)
	return HttpResponse(commit_json, mimetype = 'application/json')

def commits(request, repo):
	if not request.user.is_authenticated():
		raise PermissionDenied

	repository = get_object_or_404(Repository, id = repo)

	paging_start = int(request.GET.get('iDisplayStart', '0'))
	paging_limit = int(request.GET.get('iDisplayLength', '10'))
	sort_col = int(request.GET.get('iSortCol_0', '0'))
	sort_direction = request.GET.get('sSortDir_0', 'asc')
	sEcho = request.GET.get('sEcho', '0')
	search = request.GET.get("sSearch", "")

	#print paging_start
	#print paging_limit

	order_by_clause = ""
	if sort_direction == "desc":
		order_by_clause = "-"

	order_by_clause += getSortingColumnForCommits(sort_col)

	commitsFromDB = Commit.objects.filter(repo = repo)
	commit_count = commitsFromDB.count()

	if search != "":
		from django.db.models import Q
		commitsFromDB = commitsFromDB.filter(Q(revision__contains=search) | Q(username__username__contains=search) | Q(datetime__contains=search) | Q(comment__contains=search))

	commitsFromDB = commitsFromDB.order_by(order_by_clause)

	if paging_limit > 0:
		#print "limiting results from %d, %d elements" % (paging_start, paging_limit)
		paging_end = paging_start + paging_limit
		#print commitsFromDB.count()
		commitsFromDB = commitsFromDB[paging_start:paging_end]
		#print commitsFromDB.count()

	commits = []
	i = 0
	for obj in commitsFromDB:
		commits.append([])
		commits[i].append(obj.id)
		commits[i].append(obj.revision)
		commits[i].append(obj.comment)
		commits[i].append(str(obj.username))
		commits[i].append(obj.datetime)
		i += 1

	filter_count = i

	dthandler = __getDateHandler()
	commits_json = json.dumps(commits, default = dthandler)

	return HttpResponse("{ \"sEcho\": %s, \"iTotalRecords\": \"%s\", \"iTotalDisplayRecords\": \"%s\", \"aaData\": %s }" % (sEcho, commit_count, filter_count, commits_json), mimetype = 'application/json')

def getSortingColumnForCommits(sort_col):
	return {
		'0': 'revision',
		'2': 'username',
		'3': 'datetime',
	}.get(sort_col, 'revision')

def getCommitDiff(request, commit_id):
	if not request.user.is_authenticated():
		raise PermissionDenied

	commit_id = int(commit_id)
	commit = get_object_or_404(Commit, id = commit_id)

	html_output = ""
	if commit.repo.url.startswith("/"):
		files = __callCommand("svnlook changed /svn/invaders3/ -r 1")
		diff_output = __callCommand("svnlook diff -r %s \"%s\"" % (str(commit.revision), commit.repo.url))
		files_output = __callCommand("svnlook changed -r %s \"%s\"" % (str(commit.revision), commit.repo.url))
		diffHandler = SvnDiff2Html(diff_output, files_output)
		html_output += diffHandler.output_file_lists()
		html_output += diffHandler.output_formatted_diff()
	else:
		output = __callCommand("svn diff -r %s:%s --username \"%s\" --password \"%s\" \"%s\"" % (str(commit.revision - 1), str(commit.revision), commit.repo.username, commit.repo.password, commit.repo.url))

		from pygments import highlight
		from pygments.lexers import get_lexer_by_name
		from pygments.formatters import HtmlFormatter

		lexer = get_lexer_by_name("diff", stripall = True)
		html_output = highlight(output, lexer, HtmlFormatter())

	return HttpResponse(html_output, mimetype = 'text/html')

def repo_update(request, repo):
	# result = subprocess.check_output(["echo", "Hello World!"])
	repository = get_object_or_404(Repository, id = repo)

	cursor = connection.cursor()
	cursor.execute("SELECT revision FROM infos_commit WHERE repo_id = %s ORDER BY revision DESC LIMIT 1" % (repo))
	last_commit = cursor.fetchall()

	print last_commit
	if len(last_commit) > 0:
		current_revision = last_commit[0][0]
	else:
		current_revision = 0
	last_saved = current_revision

	repo_url = repository.url
	command = "svn info \"%s\" --username \"%s\" --password \"%s\"" % (repo_url, repository.username, repository.password)

	svn_info = __callCommand(command)

	revision_re = r"Revision: (\d+)"
	for s in svn_info.splitlines():
		match_result = re.match(revision_re, s)
		if match_result:
			current_revision = int(match_result.group(1))

	if current_revision <= last_saved:
		return render_to_response(
			'infos/repo/updated.html',
			{
				'result': "error"
			},
			context_instance = RequestContext(request),
		)

	for revision in range(last_saved + 1, current_revision):
		output = __callCommand("svn log --xml -r %s --username \"%s\" --password \"%s\" \"%s\"" % (str(revision), repository.username, repository.password, repo_url))
		print output
		root = ET.fromstring(output)

		logentry = root.find("logentry")
		comment = logentry.find("msg").text
		if comment == None:
			comment = ""

		timestamp = logentry.find("date").text
		timestamp = timestamp.split(".")[0]
		timestampAsDateTime = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%S")

		author = logentry.find("author").text
		try:
			username = Username.objects.get(username = author)
		except ObjectDoesNotExist:
			Username.objects.create(username = author)
			username = Username.objects.get(username = author)

		commit = Commit(revision = str(revision), datetime = timestampAsDateTime, comment = comment, repo = repository, username = username)
		commit.save()

		# output = __callCommand("svn diff -r %s:%s --username \"%s\" --password \"%s\" \"%s\"" % (str(revision - 1), str(revision), repository.username, repository.password, repo_url))
		# commit_diff = CommitDiff(commit=commit, diff=output)
		# commit_diff.save()

	result = "nothing..."

	return render_to_response(
		'infos/repo/updated.html',
		{
			'result': result
		},
		context_instance = RequestContext(request),
	)

def pygmentsCss(request):
	from pygments.formatters import HtmlFormatter
	css = HtmlFormatter().get_style_defs('.highlight')
	return HttpResponse(css, mimetype = 'text/css')

def svnDiffCss(request):
	css = SvnDiff2Html("", "").output_css()
	return HttpResponse(css, mimetype = 'text/css')

def __callCommand(command):
	oldLang = os.environ['LANG']
	os.environ['LANG'] = 'C'
	try:
		result = subprocess.check_output(command, shell = True)
	finally:
		os.environ['LANG'] = oldLang

	return result

def __getDateHandler():
	return lambda obj: obj.strftime("%d/%m/%Y %H:%M:%S") if isinstance(obj, datetime) else None

def getUserMenu(request):
	if not request.user.is_authenticated():
		raise PermissionDenied

	menu = [ ]

	if request.user.is_staff:
		fileMenu = { "name": "file", "items": [ ] }
		fileMenu["items"].append({ "name": "goToPanel", "type": "link", "url": reverse("admin:index") })
		menu.append(fileMenu)

	helpMenu = { "name": "help", "items": [ ] }
	helpMenu["items"].append({ "name": "openInfo", "type": "dialog", "dialog": "info" })
	menu.append(helpMenu)

	menu_json = json.dumps(menu)
	return HttpResponse(menu_json, mimetype = 'application/json')

# -*- coding: utf8 -*-
# Create your views here.
from django.shortcuts import render_to_response, get_object_or_404
from django.http import HttpResponse
from django.template import RequestContext
from django.db import connection, transaction
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime
from infos.models import *
from django.core import serializers

import subprocess, os, re
import json
import xml.etree.ElementTree as ET

def main(request):
	return render_to_response(
		'infos/main.html',
		{
		},
		context_instance=RequestContext(request),
	)

def main2(request):
	return render_to_response(
		'infos/index.html',
		{
		},
		context_instance=RequestContext(request),
	)

def repo_add(request):
	return render_to_response(
		'infos/repo/add.html',
		{
		},
		context_instance=RequestContext(request),
	)

def repo_list(request):
	repositories = [ { "id": repo.id, "url": repo.url, "name": repo.name } for repo in Repository.objects.all() ]
	#repos_json = serializers.serialize("json", repositories)
	repos_json = json.dumps(repositories)
	return HttpResponse(repos_json, mimetype = 'application/json')

def repo_show(request, repo):
	repository = get_object_or_404(Repository, id=repo)
	return render_to_response(
		'infos/repo/show.html',
		{
			"repository": repository
		},
		context_instance=RequestContext(request),
	)

def commitDetail(request, commit_id):
	commit = repositories = [ { "id": c.id, "revision": c.revision, "datetime": c.datetime, "comment": c.comment, "username": str(c.username) } for c in Commit.objects.filter(id=commit_id) ]

	dthandler = __getDateHandler()
	commit_json = json.dumps(commit, default = dthandler)
	return HttpResponse(commit_json, mimetype = 'application/json')

def commits(request, repo):
	repository = get_object_or_404(Repository, id=repo)

	paging_start = int(request.GET.get('iDisplayStart', '0'))
	paging_limit = int(request.GET.get('iDisplayLength', '10'))
	sort_col = int(request.GET.get('iSortCol_0', '0'))
	sort_direction = request.GET.get('sSortDir_0', 'asc')
	sEcho = request.GET.get('sEcho', '0')

	order_by_clause = ""
	if sort_direction == "desc":
		order_by_clause = "-"

	order_by_clause += getSortingColumnForCommits(sort_col)

	if paging_limit > 0:
		commitsFromDB = Commit.objects.filter(repo=repo).order_by(order_by_clause)[paging_start:paging_limit]
	else:
		commitsFromDB = Commit.objects.filter(repo=repo).order_by(order_by_clause)

	commit_count = Commit.objects.filter(repo=repo).count()

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
	commit_id = int(commit_id)
	commit = get_object_or_404(Commit, id=commit_id)
	output = __callCommand("svn diff -r %s:%s --username \"%s\" --password \"%s\" \"%s\"" % (str(commit.revision - 1), str(commit.revision), commit.repo.username, commit.repo.password, commit.repo.url))
	
	from pygments import highlight
	from pygments.lexers import get_lexer_by_name
	from pygments.formatters import HtmlFormatter

	lexer = get_lexer_by_name("diff", stripall=True)
	html_output = highlight(output, lexer, HtmlFormatter())

	return HttpResponse(html_output, mimetype = 'text/html')

def repo_update(request, repo):
	#result = subprocess.check_output(["echo", "Hello World!"])
	repository = get_object_or_404(Repository, id=repo)

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
			context_instance=RequestContext(request),
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
			username = Username.objects.get(username=author)
		except ObjectDoesNotExist:
			Username.objects.create(username=author)
			username = Username.objects.get(username=author)

		commit = Commit(revision=str(revision), datetime=timestampAsDateTime, comment=comment, repo=repository, username=username)
		commit.save()

		#output = __callCommand("svn diff -r %s:%s --username \"%s\" --password \"%s\" \"%s\"" % (str(revision - 1), str(revision), repository.username, repository.password, repo_url))
		#commit_diff = CommitDiff(commit=commit, diff=output)
		#commit_diff.save()

	result = "nothing..."

	return render_to_response(
		'infos/repo/updated.html',
		{
			'result': result
		},
		context_instance=RequestContext(request),
	)

def pygmentsCss(request):
	from pygments.formatters import HtmlFormatter
	css = HtmlFormatter().get_style_defs('.highlight')
	return HttpResponse(css, mimetype = 'text/css')

def __callCommand(command):
	oldLang = os.environ['LANG']
	os.environ['LANG'] = 'C'
	try:
		result = subprocess.check_output(command, shell=True)
	finally:
		os.environ['LANG'] = oldLang

	return result

def __getDateHandler():
	return lambda obj: obj.strftime("%d/%m/%Y %H:%M:%S") if isinstance(obj, datetime) else None

import subprocess, os

from infos.models import *
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.formatters import HtmlFormatter

from libs.svndiff2html.svndiff2html.SvnDiff2Html import SvnDiff2Html

class CommitsManager:
	@staticmethod
	def getCommitDiff(commit):
		html_output = ""
		if commit.repo.url.startswith("/"):
			print "local repo"
			#files = CommitsManager.__callCommand("svnlook changed %s -r 1" % ( commit.repo.url ))
			diff_output = CommitsManager.__callCommand("svnlook diff -r %s \"%s\"" % (str(commit.revision), commit.repo.url))
			files_output = CommitsManager.__callCommand("svnlook changed -r %s \"%s\"" % (str(commit.revision), commit.repo.url))
			diffHandler = SvnDiff2Html(diff_output, files_output)
			html_output += diffHandler.output_file_lists()
			html_output += diffHandler.output_formatted_diff()
		else:
			print "remote repo"
			output = CommitsManager.__callCommand("svn diff -r %s:%s --username \"%s\" --password \"%s\" \"%s\"" % (str(commit.revision - 1), str(commit.revision), commit.repo.username, commit.repo.password, commit.repo.url))

			lexer = get_lexer_by_name("diff", stripall = True)
			html_output = highlight(output, lexer, HtmlFormatter())

		return html_output

	@staticmethod
	def __callCommand(command):
		oldLang = os.environ['LANG']
		os.environ['LANG'] = 'C'
		try:
			result = subprocess.check_output(command, shell = True)
		finally:
			os.environ['LANG'] = oldLang

		return result

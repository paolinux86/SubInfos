from django.db import models
from django.forms import ModelForm
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _

# Create your models here.
class Committer(models.Model):
	name = models.CharField(max_length=80)
	surname = models.CharField(max_length=80)

	def __unicode__(self):
		return self.surname + ", " + self.name
	class Meta:
		verbose_name = _("Committer")
		verbose_name_plural = _("Committers")

class Username(models.Model):
	username = models.CharField(max_length=80)
	committer = models.ForeignKey("Committer", null=True)

	def __unicode__(self):
		if self.committer == None:
			return self.username
		else:
			return self.committer.surname + ", " + self.committer.name + " (" + self.username + ")"
	class Meta:
		verbose_name = _("Username")
		verbose_name_plural = _("Usernames")

class Repository(models.Model):
	name = models.CharField(max_length=80)
	url = models.CharField(max_length=200)
	username = models.CharField(max_length=80)
	password = models.CharField(max_length=20)

	def __unicode__(self):
		return self.name
	class Meta:
		verbose_name = _("Repository")
		verbose_name_plural = _("Repositories")

class Commit(models.Model):
	revision = models.IntegerField()
	datetime = models.DateTimeField()
	comment = models.TextField()
	repo = models.ForeignKey("Repository")
	username = models.ForeignKey("Username")

	def __unicode__(self):
		return str(self.revision)
	class Meta:
		verbose_name = _("Commit")
		verbose_name_plural = _("Commits")

class CommitDiff(models.Model):
	commit = models.ForeignKey("Commit")
	diff = models.TextField()

	def __unicode__(self):
		return str(self.commit)
	class Meta:
		verbose_name = _("CommitDiff")
		verbose_name_plural = _("CommitDiffs")

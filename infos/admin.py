from infos.models import *
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import ugettext, ugettext_lazy as _

class RepositoryAdmin(admin.ModelAdmin):
	list_display = ('name', 'url')
	search_fields = ['name', 'url']
	ordering = ['name']

admin.site.register(Committer)
admin.site.register(Username)
admin.site.register(Repository, RepositoryAdmin)
admin.site.register(Commit)
admin.site.register(CommitDiff)

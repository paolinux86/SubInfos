from django.conf.urls import patterns, include, url
from infos.models import Repository
from django.conf import settings

import os

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'SubInfos.views.home', name='home'),
    # url(r'^SubInfos/', include('SubInfos.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    url(r'^subinfos/(?P<path>.*)$', 'django.views.static.serve', {'document_root': os.path.join(settings.MEDIA_ROOT, "subinfos") }),
    url(r'^steal/(?P<path>.*)$', 'django.views.static.serve', {'document_root': os.path.join(settings.MEDIA_ROOT, "jmvc/steal") }),
    url(r'^jquery/(?P<path>.*)$', 'django.views.static.serve', {'document_root': os.path.join(settings.MEDIA_ROOT, "jmvc/jquery") }),
)

urlpatterns += patterns('infos.views',
	url(r'^$', 'main2'),
	#url(r'^main$', 'main2'),
	url(r'^repo/add$', 'repo_add'),
	url(r'^repo/update/(?P<repo>\d+)$', 'repo_update'),
	url(r'^repo/(?P<repo>\d+)$', 'repo_show'),
	url(r'^repo/(?P<repo>\d+)/commits$', 'commits'),
	url(r'^repo/list/$', 'repo_list'),
	url(r'^commit/(?P<commit_id>\d+)/diff', 'getCommitDiff'),
	url(r'^commit/(?P<commit_id>\d+)', 'commitDetail'),
)

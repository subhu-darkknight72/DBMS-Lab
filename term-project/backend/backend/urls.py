from django.contrib import admin
from django.urls import path
from metric import views as metric_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',metric_views.get_query,name='query'),
]

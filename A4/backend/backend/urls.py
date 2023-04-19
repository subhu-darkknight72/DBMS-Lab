from django.contrib import admin
from django.urls import path,include
from django.contrib.auth import views as auth_views
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/',auth_views.LoginView.as_view(template_name='job/login.html'),name='login'),
    path('logout/',auth_views.LogoutView.as_view(template_name='job/logout.html'),name='logout'),
    path('api/',include('api.urls')),
]

urlpatterns += [path('', TemplateView.as_view(template_name='index.html'))]
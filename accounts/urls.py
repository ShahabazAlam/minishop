from django.urls import path
from knox.views import LogoutView
from .views import RegisterAPIView, LoginAPIView, UserAPIView

urlpatterns = [
    path('register/', RegisterAPIView.as_view()),
    path('login/', LoginAPIView.as_view(), name='knox_login'),
    path('logout/', LogoutView.as_view(), name='knox_logout'),
    path("auth/user/", UserAPIView.as_view()),
]

from django.conf.urls import url

from Django_app import views

urlpatterns = [
    url('index/', views.index),
    url('token/', views.get_token),
    url('video/', views.video),
    url('room/', views.create_room_name),
    url('deleteRoom/', views.delete_room),
]

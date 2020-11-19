import random

from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant

account_sid = 'AC9e11a7598ecc8160b8ecb902a25998d6'
api_key = 'SKfd229a6925215c9941b34cef4d5bbcff'
api_secret = 'TCq9qA4YRRkSEsRwCvxf4nOMy5FlnJ52'

room_name_list = []

def index(request):
    return render(request, 'index.html')


def video(request):
    return render(request, 'video.html')


@csrf_exempt
def get_token(request):
    username = request.POST["username"]
    room_name = request.POST["room_name"]

    if room_name not in room_name_list:
        return HttpResponse("noRoom")

    token = AccessToken(account_sid, api_key, api_secret, identity=username)

    video_grant = VideoGrant(room=room_name)
    token.add_grant(video_grant)

    return HttpResponse(token.to_jwt().decode())


@csrf_exempt
def delete_room(request):
    room_name = request.POST["room_name"]
    room_name_list.remove(room_name)
    return HttpResponse("success")


def create_room_name(request):
    room_index_list = random.sample(range(1, 10), 8)

    room_index_str_list = []
    for x in room_index_list:
        room_index_str_list.append(str(x))

    room_index_str = ''.join(room_index_str_list)
    print(room_index_str)

    room_name_list.append(room_index_str)

    return HttpResponse(room_index_str)


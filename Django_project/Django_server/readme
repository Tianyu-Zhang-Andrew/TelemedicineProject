Introduction:
This is the doctor side web application of a telemedicine system, it has video conferencing function,
allows doctors giving real-time feedback and instruction to their patients to perform a simple heart
testing remotely using patients' telemedicine devices(for example bluetooth heart rate monitor). The
patient side is a mobile APP, it will collect vital parameter data transmitted through bluetooth and
send it to the doctor side application. These data and real-time image of patients will be shown in
the doctor side application so that doctors can give a real-time instructions for their patients to use
their telemedicine devices and provide diagnoses based on measured data. The system can support 1 patient
with 1 doctor, as well as 1 patient with 2 doctors meeting.

Structure:
1. The backend server is writen in Python using Django framework.
2. The frontend is written in JavaScript and Jquery, some Bootstrape component is also used.
3. The video conferencing function is provided by Twilio, which is a WebRTC technology.

How to run:
1. In Django_server folder run python manage.py runserver to start the Django server.
2. In Django_server folder run ngrok http 8000 -host-header="localhost:8000" to start the ngrok.exe
   for intranet penetration. (necessary)

How to use:
1. After running the ngrok.exe, copy the https address in the "Forwarding" field in the terminal,
   (for example https://a53e71b5c7f6.ngrok.io) then add "/video" after the address to visit the application
   (for example https://a53e71b5c7f6.ngrok.io/video)
2. Click "Create a room" button, a unique room name will be generated, copy that room name and paste it in the
   room name input field, chose a username and enter it in the username input field, click "Join call" to join room.
   (do not make room name by yourself, it will give you an alert)
3. After joining the room, your local video will have bigger size than other participants (main video screen), click other
   participant' video to change them to the main video screen. (only workable when there are 2 participants)
4. Click "Leave call" button to leave the conferencing room.

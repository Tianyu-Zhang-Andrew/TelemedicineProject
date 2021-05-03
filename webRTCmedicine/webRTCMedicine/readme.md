Instruction:
This is the patient side of a video conferencing telemedicine system, the aim is to use 
this system to allow patients and doctors to perform real-time medicinal sessions remotely using the
video conferencing function. The patient side is able to receive real-time data transmitted by patients' 
bluetooth telemedicine devices and transmit the received data to doctor side application. Doctors can 
provide real-time instructions for their patients to use the bluetooth devices correctly, and give diagnosis
based on the measured data.

This is a mobile APP using react-native, it has been tested on Android system During the meeting. 
Patients can use this APP to have video conferences with their doctors who use the doctor side web application.
This APP can scan, connect and monitor BLE telemedicine devices, and share the monitored data to the doctor side application.
The video conferences can have 1 patient and 1 doctor or 1 patient with 2 doctors.

How to use: (Assume using andriod)
1. Install the andriod studio and android simulator or connect an andriod device to the PC.
   Install react-native (helpful link: https://reactnative.dev/docs/getting-started)
2. Start the Django backend (in the Django_project folder, see readme in Django_project for more instructions)
3. Copy the ngrok internet address after the backend server is running. (see readme in Django_project for 
   instuctions of ngrok)
4. Replace the url in line 66 in App.js with ngrok address with '/token/' added to the end. 
   (for example https://74c6d240d8ae.ngrok.io/token/) 
   This step is necessary because I don't have a paid account for ngrok, therefore everytime the ngrok runs, 
   it will assign a different web address, which needed to be manully changed in the patient side APP.
5. After make sure the android simulator is running or an android device is connected, 
   run "yarn android" or "yarn react-native run-android" to start the application. 
   (the APP will be installed the first time this command is run)
6. Start the doctor side application, get a room id from the doctor side (see readme in Django_project for 
   more instuctions)
7. Input the room id and a username to join in the video conference.
8. When there are 2 participants, click on a video screen can change it to main (bigger) or smaller screen.
9. Press "leave call" button to leave the video conference.

More detail about this system can be found in the Essay in the root TelemedicineProject folder.

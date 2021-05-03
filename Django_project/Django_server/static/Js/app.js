const windowWidth = document.documentElement.clientWidth * 5/6;
const windowHeight = document.documentElement.clientHeight;

function addLocalVideo() {
    Twilio.Video.createLocalVideoTrack().then(track => {
        let video = document.getElementById('me');
        video.appendChild(track.attach());

        let local = document.getElementById('local');
        local.addEventListener('click', () => {
            changeMainscreen(local)
        });
    });
};

function setVideoSize(width, height){
    let tracksDivList = document.getElementsByClassName("smallScreen");
    for(let i = 0; i < tracksDivList.length; i++){
        tracksDivList[i].style.width = width;
        tracksDivList[i].style.height = height;
    }
}

function changeMainscreen(participantScreen){
    if(video_room.participants.size + 1 === 2){
        let mainScreen = document.getElementsByClassName('mainScreen')[0];
        mainScreen.setAttribute('class', 'smallScreen');
        participantScreen.setAttribute('class', 'mainScreen');
        adjustAllVideo();
    }
}

function adjustAllVideo(){
    let video = document.getElementsByClassName('mainScreen')[0];
    let heightStr = (windowHeight * 0.85) + "px";

    video.style.height = heightStr;
    video.style.width = (windowHeight * 0.85 * 4 / 3.1) + "px";
    
    if(video_room.participants.size + 1 == 2){
        let width = (windowWidth / 3);
        let height = width * 3/4;

        let widthStr = width + "px";
        let heightStr = height + "px";

        setVideoSize(widthStr, heightStr);

    }else{
        let heightStr = (windowHeight * 0.3) + "px";
        let widthStr = (windowHeight * 0.3 * 4 / 3) + "px";
        setVideoSize(widthStr, heightStr);
    }
}

function restoreScreenSize(){
    let local = document.getElementById('local');
    local.setAttribute('class', 'mainScreen');
    adjustAllVideo();
}

let connected = false;
const logInPage = document.getElementById("logInPage");
const createRoomButton = document.getElementById("createRoomButton");
const mainDiv = document.getElementById("mainDiv");
const header = document.getElementById("header");
const usernameInput = document.getElementById('username');
const room_nameInput = document.getElementById('room_name');
const joinButton = document.getElementById('joinButton');
const leaveButton = document.getElementById('leaveButton');
const container = document.getElementById('container');
const count = document.getElementById('count');
let video_room;
let room_name;

function joinCall(event){
    event.preventDefault();
    let username = usernameInput.value;
    room_name = room_nameInput.value;

    if (!username) {
        alert('Enter your name before connecting');
        return;
    }

    if (!room_name) {
        alert('Enter your room name before connecting');
        return;
    }

    joinButton.disabled = true;
    joinButton.innerHTML = 'Connecting...';
    connect(username, room_name).then(() => {
        logInPage.style.visibility = "hidden";
        mainDiv.style.visibility = "visible";
        header.style.visibility = "visible";
    }).catch(() => {
        joinButton.innerHTML = 'Join call';
        joinButton.disabled = false;
    });
}

function leaveCall(event){
    event.preventDefault();
    disconnect();
    
    logInPage.style.visibility = "visible";
    mainDiv.style.visibility = "hidden";
    header.style.visibility = "hidden";

    joinButton.innerHTML = 'Join call';
    joinButton.disabled = false;

    connected = false;
}

function connect(username, room_name) {
    let promise = new Promise((resolve, reject) => {

        $.ajax({
            url:"/token/",
            type:"POST",
            data: {"username":username, "room_name": room_name},

            success:function(token){
                try {
                    if(token === "noRoom"){
                        alert("Room name does not exist")
                        reject();
                    }else{
                        Twilio.Video.connect(token, {name:room_name}).then(room => {
                            video_room = room
                            console.log(username + ': Successfully joined a Room:' + room);
                            room.participants.forEach(participantConnected);
                            room.on('participantConnected', participantConnected);
                            room.on('participantDisconnected', participantDisconnected);
    
                            connected = true;

                            roomnameHeader = document.getElementById('roomnameHeader');
                            roomnameHeader.innerHTML = "Room name: " + room_name;

                            document.body.style.backgroundColor = "black";

                            updateParticipantCount();
    
                        }, error => {
                            console.error('Unable to connect to Room: ' + error.message);
                            reject();
                        });
    
                        resolve();
                    }

                }catch(err){
                    console.log(err)
                    reject();
                }
            },

            error: function(){
                reject();
            }
        });
    });

    return promise;
};

function updateParticipantCount() {
    if (!connected)
        count.innerHTML = 'Disconnected.';
    else
        count.innerHTML = (video_room.participants.size + 1) + ' participants online.';
};

function participantConnected(participant) {

    let participantDiv = document.createElement('div');
    participantDiv.setAttribute('id', participant.sid);
    participantDiv.setAttribute('class', 'smallScreen');
    participantDiv.addEventListener('click', () => {changeMainscreen(participantDiv)});

    let tracksDiv = document.createElement('div');
    tracksDiv.setAttribute('class', 'tracksDiv');
    participantDiv.appendChild(tracksDiv);

    let name = document.createElement('text');
    name.setAttribute('class', 'participantNameText');
    name.innerHTML = participant.identity;
    participantDiv.appendChild(name);

    container.appendChild(participantDiv);

    participant.tracks.forEach(publication => {
        if (publication.isSubscribed)
            trackSubscribed(tracksDiv, publication.track);
    });
    participant.on('trackSubscribed', track => trackSubscribed(tracksDiv, track));
    participant.on('trackUnsubscribed', trackUnsubscribed);

    adjustAllVideo();
    updateParticipantCount();
};

function participantDisconnected(participant) {
    document.getElementById(participant.sid).remove();

    if(document.getElementsByClassName('mainScreen').length === 0){
        restoreScreenSize();
    }else{
        adjustAllVideo();
    }
    
    updateParticipantCount();
};

function trackSubscribed(div, track) {
    if (track.kind !== 'data') {
        div.appendChild(track.attach());
    }else{
         track.on('message', dataStr => {
            let heartRateValue = document.getElementById("heartRateValue");
            heartRateValue.innerHTML = dataStr + "/min"
            console.log(dataStr)
        });
    }
}

function trackUnsubscribed(track) {
    if (track.kind !== 'data') {
        console.log(track.kind);
        track.detach().forEach(element => element.remove());
    }
};

function deleteRoom(){
    $.ajax({
        url:"/deleteRoom/",
        type:"Post",

        data: {"room_name":room_name},

        success:function(){
            console.log("Deletion successful")
        },

        error: function(error){
            alert(error.message)
        }
    });
}

function disconnect() {
    if(video_room.participants.size + 1 == 1){
        console.log("last");
        deleteRoom();
    }

    video_room.disconnect();
    while (container.lastChild.id != 'local')
        container.removeChild(container.lastChild);

    document.body.style.backgroundColor = "gray";
    connected = false;

    restoreScreenSize()
    updateParticipantCount();
};

function createRoomName(){
    $.ajax({
        url:"/room/",
        type:"GET",

        success:function(roomName){
            alert("Your room name is " + roomName + ", please use this room name to join a room")
        },

        error: function(error){
            alert(error.message)
        }
    });
}

addLocalVideo();
joinButton.addEventListener('click', joinCall);
leaveButton.addEventListener('click', leaveCall);
createRoomButton.addEventListener('click', createRoomName)
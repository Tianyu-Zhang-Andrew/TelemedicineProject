const windowWidth = document.documentElement.clientWidth * 5/6;
const windowHeight = document.documentElement.clientHeight;

function addLocalVideo() {
    Twilio.Video.createLocalVideoTrack().then(track => {
        let video = document.getElementById('me');
        let heightStr = (windowHeight * 0.8) + "px";

        video.style.height = heightStr;
        video.style.width = (windowHeight * 0.8 * 4 / 3) + "px";
        video.appendChild(track.attach());
    });
};

function setVideoSize(width, height){
    console.log(width, height)
    let tracksDivList = document.getElementsByClassName("tracksDiv");
    for(let i = 0; i < tracksDivList.length; i++){
        tracksDivList[i].style.width = width;
        tracksDivList[i].style.height = height;
    }
}

function adjustAllVideo(tracksDiv){
    if(video_room.participants.size + 1 == 1){
        let video = document.getElementById('me');
        let heightStr = (windowHeight * 0.8) + "px";

        video.style.height = heightStr;
        video.style.width = (windowHeight * 0.8 * 4 / 3) + "px";

    }else if(video_room.participants.size + 1 == 2){
        let width = (windowWidth / 2.2);
        let height = width * 3/4;

        let widthStr = width + "px";
        let heightStr = height + "px";

        setVideoSize(widthStr, heightStr);

        if(tracksDiv !== undefined){
            tracksDiv.style.width = widthStr;
            tracksDiv.style.height = heightStr;
        }

    }else{
        let height = (windowHeight / 2.5);
        let width = height * 4/3;

        let widthStr = width + "px";
        let heightStr = height + "px";

        setVideoSize(widthStr, heightStr);

        if(tracksDiv !== undefined){
            tracksDiv.style.width = widthStr;
            tracksDiv.style.height = heightStr;
        }
    }
}

let connected = false;
const usernameInput = document.getElementById('username');
const room_nameInput = document.getElementById('room_name');
const button = document.getElementById('join_leave');
const container = document.getElementById('container');
const count = document.getElementById('count');
let video_room;

function connectButtonHandler(event) {
    event.preventDefault();
    if (!connected) {
        let username = usernameInput.value;
        let room_name = room_nameInput.value;

        if (!username) {
            alert('Enter your name before connecting');
            return;
        }

        if (!room_name) {
            alert('Enter your room name before connecting');
            return;
        }

        button.disabled = true;
        button.innerHTML = 'Connecting...';
        connect(username, room_name).then(() => {
            button.innerHTML = 'Leave call';
            button.disabled = false;
        }).catch(() => {
            alert('Connection failed. Is the backend running?');
            button.innerHTML = 'Join call';
            button.disabled = false;
        });
    }
    else {
        disconnect();
        button.innerHTML = 'Join call';
        connected = false;
    }
};

function connect(username, room_name) {
    let promise = new Promise((resolve, reject) => {

        $.ajax({
            url:"/token/",
            type:"POST",
            data: {"username":username, "room_name": room_name},

            success:function(token){
                try {
                    Twilio.Video.connect(token, {name:room_name}).then(room => {
                        video_room = room
                        console.log(username + ': Successfully joined a Room:' + room);
                        room.participants.forEach(participantConnected);
                        room.on('participantConnected', participantConnected);
                        room.on('participantDisconnected', participantDisconnected);

                        connected = true;
                        updateParticipantCount();

                    }, error => {
                        console.error('Unable to connect to Room: ' + error.message);
                        reject();
                    });

                    resolve();

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
    participantDiv.setAttribute('class', 'participant');

    let tracksDiv = document.createElement('div');
    tracksDiv.setAttribute("class", "tracksDiv");
    participantDiv.appendChild(tracksDiv);

    let labelDiv = document.createElement('div');
    labelDiv.innerHTML = participant.identity;
    participantDiv.appendChild(labelDiv);

    container.appendChild(participantDiv);

    participant.tracks.forEach(publication => {
        if (publication.isSubscribed)
            trackSubscribed(tracksDiv, publication.track);
    });
    participant.on('trackSubscribed', track => trackSubscribed(tracksDiv, track));
    participant.on('trackUnsubscribed', trackUnsubscribed);

    adjustAllVideo(tracksDiv);
    updateParticipantCount();
};

function participantDisconnected(participant) {
    document.getElementById(participant.sid).remove();
    adjustAllVideo();
    updateParticipantCount();
};

function trackSubscribed(div, track) {
    if (track.kind !== 'data') {
        console.log(track.kind);
        div.appendChild(track.attach());
    }
}

function trackUnsubscribed(track) {
    if (track.kind !== 'data') {
        console.log(track.kind);
        track.detach().forEach(element => element.remove());
    }
};

function disconnect() {
    video_room.disconnect();
    while (container.lastChild.id != 'local')
        container.removeChild(container.lastChild);
    button.innerHTML = 'Join call';
    connected = false;

    let video = document.getElementById('me');
    let heightStr = (windowHeight * 0.8) + "px";

    video.style.height = heightStr;
    video.style.width = (windowHeight * 0.8 * 4 / 3) + "px";

    updateParticipantCount();
};

addLocalVideo();
button.addEventListener('click', connectButtonHandler);
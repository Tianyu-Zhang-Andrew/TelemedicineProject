import React, {Component} from 'react';
import MainContainer from "./MainContainer.js"
import LoginDiv from "./LoginDiv.js"
import styles from "./style.js"

import {
  View,
  PermissionsAndroid, 
} from 'react-native';

import {
  TwilioVideo
} from 'react-native-twilio-video-webrtc';

export async function GetAllPermissions() {
  try {
    if (Platform.OS === "android") {
      const userResponse = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      ]);
      return userResponse;
    }
  } catch (err) {
    console.log(err);
  }
  return null;
}

class App extends Component{
  state = {
    username:"",
    roomname:"",
    videoTracks: new Map(),
    connected: false,
    buttonValue: "Connect",
    participantNum: 0,
    bloodPressure: null,
    heartRate: null,
    bodyTemperature: null
  }

  componentDidMount() {
    GetAllPermissions();

    const sendData = setInterval(() => {
      if(this.state.connected){
        let publishedDate = new Date();
        publishedDate = publishedDate.getFullYear() + "/" + (publishedDate.getMonth() + 1) + 
                        "/" + publishedDate.getDate() + "/ " + publishedDate.getHours() + ":" 
                        + publishedDate.getMinutes() + ":" + publishedDate.getSeconds();

        let dataListStr = publishedDate + "," + publishedDate + "," + publishedDate;
        this.refs.twilioVideo.sendString(dataListStr)

        this.setState({
          bloodPressure: publishedDate,
          heartRate: publishedDate,
          bodyTemperature: publishedDate
        })
      }
    
    }, 1000)

  }

  setUserName = (value) => {
    this.setState({
      username: value
    });
  }

  setRoomname = (value) => {
    this.setState({
      roomname: value
    });
  }

  addParticipant = ({participant, track}) => {
    console.log("addParticipant")
    let newNum = this.state.participantNum + 1;
    
    this.setState({
      videoTracks: new Map([
          ...this.state.videoTracks,
          [track.trackSid, 
            { participantSid: participant.sid, 
              videoTrackSid: track.trackSid, 
              participantIdentity: participant.identity 
            }]
      ]),
      participantNum: newNum
    });
  }

  removeParticipant = ({participant, track}) => {
      let newNum = this.state.participantNum - 1;
      const videoTracks = this.state.videoTracks
      videoTracks.delete(track.trackSid)
      this.setState({
        videoTracks: new Map([ ...videoTracks ]),
        participantNum: newNum
      })
      console.log("after remove", this.state.videoTracks)
  }

  connectButtonHandler = () =>{
    if(!this.state.connected){
      this.setState({
        buttonValue: "Connecting..."
      })
      this.joinRoom();
    }else{
      this.leaveRoom();
    }
  }
  
  joinRoom = () => {
    if(this.state.username === "" || this.state.roomname == ""){
      alert("Please input room id and username")
    }

    console.log("Try to join room")
    let usernameValue = this.state.username;
    let roomnameValue = this.state.roomname;

    let formData = new FormData();
    formData.append("username", usernameValue);
    formData.append("room_name", roomnameValue);

    let url = 'https://74c6d240d8ae.ngrok.io/token/';

    let opts = {
      method: "POST",
      body: formData,
    }

    fetch(url, opts)
    .then((response) => response.text())
    .then((responseJson) => {
      if(responseJson === "noRoom"){
        alert("The room dose not exist");
        this.setState({buttonValue: "Connect"})
        return;
      }

      console.log("Got token")
      this.refs.twilioVideo.connect({ roomName: roomnameValue, accessToken: responseJson})
    })
    .catch((error) => {
      this.setState({buttonValue: "Connect"})
      alert(error);
    });
  }

  leaveRoom = () => {
    console.log("Try to leave room")
    this.refs.twilioVideo.disconnect()
  }

  roomDidConnect = () => {
    this.setState({connected: true})
    this.setState({buttonValue: "Connect"})
    console.log("Have connected to the room")
  }

  roomDidDisconnect = () => {
    this.setState({connected: false})
    this.setState({buttonValue: "Connect"})
    console.log("Have left the room")
  }

  roomDidFailToConnect = (error) => {
    console.log("ERROR: ", JSON.stringify(error));
    console.log("failed to connect");
    alert("Failed to connect");
    this.setState({connected: false})
    this.setState({buttonValue: "Connect"})
  }

  render(){
    return(
      <View style={styles.container}>
        {
          !this.state.connected &&
          <LoginDiv 
            setUsername={this.setUserName} 
            setRoomname={this.setRoomname} 
            connectButtonHandler={this.connectButtonHandler}
            buttonValue={this.state.buttonValue}
          />
        }

        {
          this.state.connected &&
          <MainContainer 
            videoTracks={this.state.videoTracks}
            heartRate={this.state.heartRate}
            bloodPressure={this.state.bloodPressure}
            bodyTemperature={this.state.bodyTemperature}
            connectButtonHandler={this.connectButtonHandler}
            roomname={this.state.roomname}
            participantNum={this.state.participantNum}
          />
        }

        <TwilioVideo
          ref="twilioVideo"
          onParticipantAddedVideoTrack={ this.addParticipant }
          onParticipantRemovedVideoTrack= { this.removeParticipant }
          onRoomDidConnect={ this.roomDidConnect }
          onRoomDidDisconnect={ this.roomDidDisconnect }
          onRoomDidFailToConnect= { this.roomDidFailToConnect }
        /> 
      </View>
    );
  };
}

export default App;

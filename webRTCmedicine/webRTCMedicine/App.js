import React, {Component} from 'react';
import MainContainer from "./MainContainer.js"
import LoginDiv from "./LoginDiv.js"
import styles from "./style.js"
import BluetoothDiv from './BluetoothDiv.js';
import BleModule from './BluetoothModule';
import { Button  } from 'react-native-elements';
import { Buffer } from 'buffer';

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

global.BluetoothManager = new BleModule();  

class App extends Component{
  constructor(props) {
    super(props);

    // this.monitoredData = ""
    this.state = {
      username:"",
      roomname:"",
      videoTracks: new Map(),
      connected: false,
      isConnecting: false,
      buttonValue: "Connect",
      participantNum: 0,
      monitoredData: "",
      monitoredService: "",
      monitoredServiceSelected: false,
      monitoredCharacter: "",
      monitoredCharacterSelected: false,
      bluetoothMonitoring: false,
      monitorListener: null,
      showBluetoothDiv: false,
      isScanning: false,
      scanResult: [],
      connectedDeviceName: "",
      connectedDeviceId: "",
      connectingDeviceId: "",
      bluetoothConnected: false,
      showSelectMonitoredBluetoothCharacter: false,
      showSelectMonitoredBluetoothService: false,
      url: "https://540d05cfb7cd.ngrok.io"
    }
  }

  componentDidMount() {
    GetAllPermissions();

    const sendData = setInterval(() => {
      if(this.state.connected){
        // let publishedDate = new Date();
        // publishedDate = publishedDate.getFullYear() + "/" + (publishedDate.getMonth() + 1) + 
        //                 "/" + publishedDate.getDate() + "/ " + publishedDate.getHours() + ":" 
        //                 + publishedDate.getMinutes() + ":" + publishedDate.getSeconds();

        // let dataListStr = publishedDate + "," + publishedDate + "," + publishedDate;
        // this.refs.twilioVideo.sendString(dataListStr)
        // console.log(this.state.monitoredData)
        this.refs.twilioVideo.sendString(this.state.monitoredData);

        // this.setState({
        //   bloodPressure: publishedDate,
        //   heartRate: publishedDate,
        //   bodyTemperature: publishedDate
        // })
      }
    
    }, 1000)

  }

  bluetoothScan = () => {
    this.setState({
      isScanning: true,
      scanResult: [],
      showBluetoothDiv: true
    })

    BluetoothManager.scan().then(result => {
      console.log("result: ", result);
      
      let listResult = []
      result.forEach((item, key, mapObj) => {
        listResult.push({"id": key, "name": item})
      })

      this.setState({
        isScanning: false,
        scanResult: listResult,
      })
    });
  }

  bluetoothConnect = (deviceId, deviceName) => {

    this.setState({
      isConnecting: true,
      connectingDeviceId: deviceId
    })
    
    BluetoothManager.connect(deviceId).then(() => {

      this.setState({
        bluetoothConnected: true,
        connectedDeviceId: deviceId,
        isConnecting: false,
        connectingDeviceId: "",
      })

      if(deviceName !== null){
        let alertText = "Connect successful to: " + deviceName
        alert(alertText)
        this.setState({connectedDeviceName: deviceName})

      }else{
        let alertText = "Connect successful to: " + deviceId
        alert(alertText)
      }

    }).catch(error => {
      this.setState({
        isConnecting: false,
        connectingDeviceId: ""
      })

      let alertText = "Connect fail: " + error
      alert(alertText)
    });
  }

  bluetoothDisconnect = () => {
    if(this.state.bluetoothConnected){
      if(this.state.bluetoothMonitoring){
        this.stopMonitor()
      }

      BluetoothManager.disconnect().then(() => {
        alert("Disconnect successful");
        this.setState({
          bluetoothConnected: false,
          connectedDeviceName: "",
          connectedDeviceId: "",
          showSelectMonitoredBluetoothCharacter: false,
          showSelectMonitoredBluetoothService: false,
          monitoredServiceSelected: false,
          monitoredCharacterSelected: false,
          monitoredService: "",
          monitoredCharacter: ""
        })

      }).catch(err => {
        alert(err);
      });
    }
  }

  read = () => {
    BluetoothManager.read(this.state.monitoredService, this.state.monitoredCharacter)
    .then(result => {
      let buffer = Buffer.from(result,'base64');  
      const value = BluetoothManager.byteToString(buffer);

      let charArr = value.split('')
      let IntResult = charArr[1].charCodeAt()

      console.log(charArr);
      console.log(IntResult);

    }).catch(error => {
      alert('Read fail: ' + error);
    });
  }

  selectBluetoothMonitoredService = () => {
    this.setState({
      showBluetoothDiv:true,
      showSelectMonitoredBluetoothService: true,
    })
  }

  selectBluetoothMonitoredCharacter = () => {
    this.setState({
      showBluetoothDiv:true,
      showSelectMonitoredBluetoothCharacter: true,
    })
  }

  goBackToSelectMonitoredService = () => {
    this.setState({
      showBluetoothDiv:true,
      showSelectMonitoredBluetoothService: true,
      showSelectMonitoredBluetoothCharacter: false,
      monitoredCharacterSelected: false,
      monitoredCharacter: ""
    })
  }

  reselectServiceAndCharacter = () => {
    this.setState({
      monitoredService: "",
      monitoredServiceSelected: false,
      monitoredCharacter: "",
      monitoredCharacterSelected: false,
      showSelectMonitoredBluetoothService: true,
      showSelectMonitoredBluetoothCharacter: false,
      showBluetoothDiv:true,
    })
  }

  stopMonitor = () => {
    this.state.monitorListener.remove();
    this.setState({
      monitorListener: null,
      bluetoothMonitoring: false,
      monitoredData: null
    })
  }

  monitor = () => {
    
    this.setState({
      bluetoothMonitoring: true
    })

    alert("start monitoring");
    let transactionId = 'monitor';

    let mListener = BluetoothManager.state.manager.monitorCharacteristicForDevice(this.state.connectedDeviceId,
      this.state.monitoredService,this.state.monitoredCharacter,
      (error, characteristic) => {
          if (error) {
            if(error.errorCode === 2){
              alert("Stop monitoring");
            }else{
              alert('Monitor fail: ' + error);  
            }

          }else{
            console.log('monitor success: ',characteristic.value);
            let buffer = Buffer.from(characteristic.value,'base64');  
            const value = BluetoothManager.byteToString(buffer);

            let charArr = value.split('');
            let IntResult = charArr[1].charCodeAt();
            let strResult = IntResult.toString();

            this.setState({
              monitoredData: strResult,
            })

            // this.monitoredData = strResult

            this.refs.twilioVideo.sendString(strResult)

            console.log(charArr);
            console.log(strResult);
          }

      }, transactionId
    )
    
    this.setState({
      monitorListener: mListener
    })
  }

  setMonitoredServiceSelected = (value) => {
    this.setState({
      monitoredServiceSelected: value
    })
  }

  setMonitoredCharacterSelected = (value) => {
    this.setState({
      monitoredCharacterSelected: value
    })
  }

  setMonitoredService = (value) => {
    this.setState({
      monitoredService: value
    })
  }

  setMonitoredCharacter = (value) => {
    this.setState({
      monitoredCharacter: value
    })
  }

  setShowSelectMonitoredBluetoothCharacter = (value) =>{
    this.setState({
      showSelectMonitoredBluetoothCharacter: value
    })
  }

  setShowSelectMonitoredBluetoothService = (value) =>{
    this.setState({
      showSelectMonitoredBluetoothService: value
    })
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

  setShowBluetoothDiv = (value) =>{
    this.setState({
      showBluetoothDiv: value
    })
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
  
  deleteRoom = () =>{
    let url = this.state.url + '/deleteRoom/';
    let formData = new FormData();
    formData.append("room_name", this.state.roomname);

    let opts = {
      method: "POST",
      body: formData,
    }

    fetch(url, opts)
    .then((response) => response.text())
    .catch((error) => {
      alert(error);
    });
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

    let url = this.state.url + '/token/';

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
    if(this.state.participantNum == 0){
      this.deleteRoom();
    }

    this.refs.twilioVideo.disconnect()
    this.bluetoothDisconnect();
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
            monitoredData={this.state.monitoredData}
            bluetoothConnected={this.state.bluetoothConnected}
            roomname={this.state.roomname}
            participantNum={this.state.participantNum}
            monitoredServiceSelected={this.state.monitoredServiceSelected}
            monitoredCharacterSelected={this.state.monitoredCharacterSelected}
            bluetoothMonitoring={this.state.bluetoothMonitoring}
            connectButtonHandler={this.connectButtonHandler}
            bluetoothScan={this.bluetoothScan}
            monitor={this.monitor}
            stopMonitor={this.stopMonitor}
            bluetoothDisconnect={this.bluetoothDisconnect}
            selectBluetoothMonitoredService={this.selectBluetoothMonitoredService}
            selectBluetoothMonitoredCharacter={this.selectBluetoothMonitoredCharacter}
            reselectServiceAndCharacter={this.reselectServiceAndCharacter}
          />
        }

        {
          this.state.showBluetoothDiv &&
          <BluetoothDiv
            isScanning={this.state.isScanning}
            scanningResult={this.state.scanResult}
            connected={this.state.bluetoothConnected}
            isConnecting={this.state.isConnecting}
            connectedDeviceId={this.state.connectedDeviceId}
            connectingDeviceId={this.state.connectingDeviceId}
            showSelectMonitoredBluetoothCharacter={this.state.showSelectMonitoredBluetoothCharacter}
            showSelectMonitoredBluetoothService={this.state.showSelectMonitoredBluetoothService}
            monitoredService={this.state.monitoredService}
            monitoredServiceSelected={this.state.monitoredServiceSelected}
            monitoredCharacter={this.state.monitoredCharacter}
            scan={this.bluetoothScan}
            connect={this.bluetoothConnect}
            setShowBluetoothDiv={this.setShowBluetoothDiv}
            nofityServiceUUID={BluetoothManager.nofityServiceUUID}
            nofityCharacteristicUUID={BluetoothManager.nofityCharacteristicUUID}
            setMonitoredService={this.setMonitoredService}
            setMonitoredCharacter={this.setMonitoredCharacter}
            bluetoothDisconnect={this.bluetoothDisconnect}
            setShowSelectMonitoredBluetoothCharacter={this.setShowSelectMonitoredBluetoothCharacter}
            setShowSelectMonitoredBluetoothService={this.setShowSelectMonitoredBluetoothService}
            setMonitoredServiceSelected={this.setMonitoredServiceSelected}
            setMonitoredCharacterSelected={this.setMonitoredCharacterSelected}
            selectBluetoothMonitoredCharacter={this.selectBluetoothMonitoredCharacter}
            goBackToSelectMonitoredService={this.goBackToSelectMonitoredService}
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

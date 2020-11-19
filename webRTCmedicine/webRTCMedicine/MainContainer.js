import React, { useState, useEffect } from 'react'
import styles from "./style.js"
import LocalView from "./LocalVideo.js"
import ParticipantView from "./ParticipantView.js"

import {
    View,
    Text,
    Button,
} from 'react-native';

function MainContainer(prop) {
    const [localIsMain, setLocalIsMain] = useState(true);
    const [localStyle, setLocalStyle] = useState(styles.mainDiv);
    const [participantStyle, setParticipantStyle] = useState(styles.smallerDiv);

    const changeMainScreen = ()=>{
      if(prop.participantNum + 1 <= 2){
        if(localIsMain){
          setLocalIsMain(false);
          setLocalStyle(styles.smallerDiv);
          setParticipantStyle(styles.mainDiv);
        }else{
          setLocalIsMain(true);
          setLocalStyle(styles.mainDiv);
          setParticipantStyle(styles.smallerDiv);
        }
      }
    }

    return (
        <View id="mainContainer" style={styles.mainContainer}>
            <View id="header" style={styles.header}>
              <Text id = "roomMeta" style={styles.roomMeta}>
                Room number: {prop.roomname}  There are {prop.participantNum + 1} Participant in the room
              </Text>

              <Button
                color="orangered"
                id="leaveButton"
                className="join_leave"
                title="Leave call"
                onPress={prop.connectButtonHandler}
              />
            </View>

            <View id="videoContainer" style={styles.videoContainer}>

              <View id="dataView" style={styles.dataView}>
                <View id="heartRateView" style={styles.medicalData}>
                  <Text id = "heartRateLabel" style={styles.label}>
                    Heart rate:
                  </Text>

                  <Text id="heartRateValue" style={styles.value}>
                    {prop.heartRate}
                  </Text>
                </View>

                <View id="bloodPressureView" style={styles.medicalData}>
                  <Text id = "bloodPressureLabel" style={styles.label}>
                    Blood pressure:
                  </Text>

                  <Text id="bloodPressureValue" style={styles.value}>
                    {prop.bloodPressure}
                  </Text>
                </View>

                <View id="bodyTemperatureView" style={styles.medicalData}>
                  <Text id = "bodyTemperatureLabel" style={styles.label}>
                    Body temperature:
                  </Text>

                  <Text id="bodyTemperatureValue" style={styles.value}>
                    {prop.bodyTemperature}
                  </Text>
                </View>
              </View>

              <View id="videoView" style={styles.videoView}>
                <LocalView videoStyle={localStyle} changeMainScreen={changeMainScreen}/>
                {
                  Array.from(prop.videoTracks, ([videoSid, participantInfo]) => {
                    return <ParticipantView 
                              key={videoSid} 
                              videoSid={videoSid} 
                              participantInfo={participantInfo} 
                              identity={participantInfo['participantIdentity']}
                              videoStyle={participantStyle}
                              changeMainScreen={changeMainScreen}
                            />
                  })
                } 
              </View>      
            </View>
        </View>
    )
}

export default MainContainer;
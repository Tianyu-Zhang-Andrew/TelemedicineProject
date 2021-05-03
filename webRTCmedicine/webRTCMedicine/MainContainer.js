import React, { useState, useEffect } from 'react'
import styles from "./style.js"
import LocalView from "./LocalVideo.js"
import ParticipantView from "./ParticipantView.js"
import { Button  } from 'react-native-elements';

import {
    View,
    Text,
    // Button,
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
                <View id="monitoredDataView" style={styles.medicalData}>
                  <Text id = "monitoredDataLabel" style={styles.label}>
                    Heart rate:
                  </Text>

                  <Text id="monitoredData" style={styles.value}>
                    {prop.monitoredData}/min
                  </Text>
                </View>

                <View id="bluetoothOptView" style={styles.bluetoothOptView}>
                  {
                    !prop.bluetoothConnected && 
                    <Button
                      id="scan"
                      title={"Scan for device"}
                      onPress={prop.bluetoothScan}
                    />
                  }
                  
                  {
                    prop.bluetoothConnected && 
                    <>
                    {
                      prop.monitoredServiceSelected && prop.monitoredCharacterSelected &&

                      <>
                      {
                        prop.bluetoothMonitoring &&
                        <Button
                          id="stopMonitor"
                          title={"Stop monitoring"}
                          onPress={prop.stopMonitor}
                        />
                      }

                      {
                        !prop.bluetoothMonitoring &&
                        <>
                        <Button
                          id="monitor"
                          title={"Start monitoring"}
                          onPress={prop.monitor}
                        />

                        <Button
                          id="reselectService"
                          title={"Reselect service"}
                          onPress={prop.reselectServiceAndCharacter}
                        />
                        </>
                      }
                      </>
                      
                    }
                    
                    {
                      !prop.monitoredServiceSelected && !prop.monitoredCharacterSelected && 
                      <Button
                        id="SelectService"
                        title={"Select service"}
                        onPress={prop.selectBluetoothMonitoredService}
                      />
                    }

                    {
                      prop.monitoredServiceSelected && !prop.monitoredCharacterSelected && 
                      <Button
                        id="SelectCharacter"
                        title={"Select character"}
                        onPress={prop.selectBluetoothMonitoredCharacter}
                      />
                    }

                    <Button
                      id="disconnect"
                      title={"disconnect"}
                      onPress={prop.bluetoothDisconnect}
                    />
                    </>
                  }
                  
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
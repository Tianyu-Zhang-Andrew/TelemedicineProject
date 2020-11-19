import React from 'react';
import styles from "./style.js"

import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';

import {
    TwilioVideoParticipantView,
} from 'react-native-twilio-video-webrtc';


function ParticipantView(prop) {
    return (
        <TouchableOpacity onPress={prop.changeMainScreen}>
            <View className="participantDiv" onPress={prop.changeMainScreen}>
                <TwilioVideoParticipantView
                    style={prop.videoStyle}
                    key={prop.videoSid}
                    trackIdentifier={prop.participantInfo}
                />

                <Text style={styles.participantName}>{prop.identity}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ParticipantView;
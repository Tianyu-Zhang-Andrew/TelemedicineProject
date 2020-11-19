import React, { Component } from 'react';
import styles from "./style.js"

import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';

import {
    TwilioVideoLocalView,
} from 'react-native-twilio-video-webrtc';


function LocalView(prop) {

    return(
        <TouchableOpacity onPress={prop.changeMainScreen}>
            <View id="localDiv">
                <TwilioVideoLocalView
                    enabled={true}
                    style={prop.videoStyle}
                />
                <Text style={styles.participantName}>Me</Text>
            </View>
        </TouchableOpacity>
    )
}

export default LocalView;
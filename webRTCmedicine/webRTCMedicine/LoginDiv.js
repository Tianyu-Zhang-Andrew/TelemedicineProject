import React from 'react';
import styles from "./style.js"
import { Input, Button  } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import {
    View,
    Image,
    ImageBackground
} from 'react-native';

function LoginDiv(prop) {
    return (
        <View style={styles.loginDiv}>
          <ImageBackground
            style={styles.backgroundImage}
            source={require('./image/background.jpeg')}
          >
            <View style={styles.inputDiv}>
              <Image 
                source={require('./image/Logo.jpg')}
                style={styles.Logo}
              />

              <Input
                style={{marginTop: 10}}
                onChangeText={prop.setUsername}
                placeholder="Input your username"
                leftIcon={
                  <Icon
                    name='user'
                    size={20}
                    color='gray'
                  />
                }
              />

              <Input
                onChangeText={prop.setRoomname}
                placeholder="Input the room name"
                leftIcon={
                  <MIcon
                    name='house'
                    size={20}
                    color='gray'
                  />
                }
              />

              <Button
                id="JoinButton"
                title={prop.buttonValue}
                onPress={prop.connectButtonHandler}
              />

            </View>
          </ImageBackground>

          

        </View>
    )
}

export default LoginDiv;
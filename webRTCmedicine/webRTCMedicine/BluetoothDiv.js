import React from 'react';
import styles from "./style.js"
import {Button} from 'react-native-elements';

import {
    View,
    Text,
    FlatList,
    SafeAreaView,
    TouchableHighlight
} from 'react-native';

function BluetoothDiv(prop) {

    const connectToDevice = (deviceId, deviceName) => {
        prop.connect(deviceId, deviceName);
    }

    const renderScanedItem = (renderedItem) => {
        if(renderedItem.item.name !== null){
            return <TouchableHighlight 
                        style={styles.bluetoothDiviceInfoDiv}
                        underlayColor={'gray'}
                        onPress={() => {
                            connectToDevice(renderedItem.item.id, renderedItem.item.name)
                        }}
                    >
                        <View>
                            <Text>{renderedItem.item.name}</Text>

                            {
                                (prop.connectedDeviceId === renderedItem.item.id) &&
                                <Text style={styles.connectText}>Connected</Text>
                            }
                            
                            {
                                (prop.connectingDeviceId === renderedItem.item.id) && prop.isConnecting &&
                                <Text style={styles.connectText}>Connecting...</Text>
                            }
                        </View>
                    </TouchableHighlight>

        }else{
            return <TouchableHighlight 
                        style={styles.bluetoothDiviceInfoDiv}
                        underlayColor={'gray'}
                        onPress={() => {
                            connectToDevice(renderedItem.item.id, null)
                        }}
                    >
                        <>
                            <Text>{renderedItem.item.id}</Text>

                            {
                                (prop.connectedDeviceId === renderedItem.item.id) &&
                                <Text style={styles.connectText}>Connected</Text>
                            }

                            {
                                (prop.connectingDeviceId === renderedItem.item.id) && prop.isConnecting &&
                                <Text style={styles.connectText}>Connecting...</Text>
                            }
                        </>
                    </TouchableHighlight>
        }
    }

    const renderMonitoredServiceItem = (renderedItem) => {
        return <TouchableHighlight 
                    style={styles.bluetoothDiviceInfoDiv}
                    underlayColor={'gray'}
                    onPress={() => {
                        prop.setMonitoredService(renderedItem.item);
                        prop.setMonitoredServiceSelected(true);
                        let alertMessage = "Monitoring service " + renderedItem.item;
                        alert(alertMessage);
                    }}
                >
                    <>
                    <Text>{renderedItem.item}</Text>

                    {
                        (prop.monitoredService === renderedItem.item) &&
                        <Text style={styles.connectText}>Monitoring</Text>
                    }
                    </>

                </TouchableHighlight>
    }

    const renderMonitoredCharacterItem = (renderedItem) => {
        return <TouchableHighlight 
                    style={styles.bluetoothDiviceInfoDiv}
                    underlayColor={'gray'}
                    onPress={() => {
                        prop.setMonitoredCharacter(renderedItem.item.character);
                        prop.setMonitoredCharacterSelected(true);
                        let alertMessage = "Monitoring character " + renderedItem.item.character;
                        alert(alertMessage);
                    }}
                >
                    <>
                    <Text>{renderedItem.item.character}</Text>

                    {
                        (prop.monitoredCharacter === renderedItem.item.character) &&
                        <Text style={styles.connectText}>Monitoring</Text>
                    }
                    </>

                </TouchableHighlight>
    }

    return (
        <View style={styles.bluetoothDiv}>
            {
                !prop.showSelectMonitoredBluetoothCharacter && !prop.showSelectMonitoredBluetoothService &&
                <>
                <View style={styles.bluetoothStatusDiv}>
                {
                    prop.isScanning &&
                    <Text style={styles.bluetoothStatusText}>
                        Scanning... (wait for 10 seconds)
                    </Text>
                    
                }

                {
                    !prop.isScanning &&
                    <Text style={styles.bluetoothStatusText}>
                        Scan finished
                    </Text>
                }
                </View>
            
                <SafeAreaView style={styles.bluetoothResultDiv}>
                    <FlatList 
                        style={styles.bluetoothResultflatList}
                        renderItem={renderScanedItem}
                        data={prop.scanningResult}
                        keyExtractor={item => item.id}
                    />
                </SafeAreaView>

                {
                    !prop.isScanning &&
                    <View style={styles.bluetoothDivButtonDiv}>
                        <View style={styles.bluetoothDivButton}>
                            <Button
                                id="scanAgainButton"
                                title="Scan again"
                                onPress={prop.scan}
                            />
                        </View>

                        <View style={styles.bluetoothDivButton}>
                            <Button
                                id="closeScanDivButton"
                                title="Close"
                                onPress={()=>{
                                    prop.setShowBluetoothDiv(false)
                                    prop.setShowSelectMonitoredBluetoothCharacter(false)
                                }}
                            />
                        </View>
                    </View>
                }
            </>
            }
            
            {
                prop.showSelectMonitoredBluetoothService && !prop.showSelectMonitoredBluetoothCharacter &&
                <>
                <View style={styles.bluetoothStatusDiv}>
                    <Text style={styles.bluetoothStatusText}>
                        Please select the service you want to monitor
                    </Text>
                </View>

                <SafeAreaView style={styles.bluetoothResultDiv}>
                    <FlatList 
                        style={styles.bluetoothResultflatList}
                        renderItem={renderMonitoredServiceItem}
                        data={prop.nofityServiceUUID}
                        keyExtractor={item => item}
                    />
                </SafeAreaView>   

                <View style={styles.bluetoothDivButtonDiv}>
                    <View style={styles.bluetoothDivButton}>
                        <Button
                            id="disconnect"
                            title={"disconnect"}
                            onPress={prop.bluetoothDisconnect}
                        />
                    </View>

                    {prop.monitoredServiceSelected &&
                        <View style={styles.bluetoothDivButton}>
                            <Button
                                id="SelectCharacter"
                                title={"Next"}
                                onPress={prop.selectBluetoothMonitoredCharacter}
                            />
                        </View>
                    }

                    <View style={styles.bluetoothDivButton}>
                        <Button
                            id="closeScanDivButton"
                            title="Close"
                            onPress={()=>{prop.setShowBluetoothDiv(false)}}
                        />
                    </View>
                </View>
                </>             
            }

            {
                prop.showSelectMonitoredBluetoothCharacter &&
                <>
                <View style={styles.bluetoothStatusDiv}>
                    <Text style={styles.bluetoothStatusText}>
                        Please select a character to monitor
                    </Text>
                </View>

                <SafeAreaView style={styles.bluetoothResultDiv}>
                    <FlatList 
                        style={styles.bluetoothResultflatList}
                        renderItem={renderMonitoredCharacterItem}
                        data={prop.nofityCharacteristicUUID}
                        keyExtractor={item => item.character}
                    />
                </SafeAreaView>   

                <View style={styles.bluetoothDivButtonDiv}>
                    <View style={styles.bluetoothDivButton}>
                        <Button
                            id="disconnect"
                            title={"disconnect"}
                            onPress={prop.bluetoothDisconnect}
                        />
                    </View>

                    <View style={styles.bluetoothDivButton}>
                        <Button
                            id="BackToSelectService"
                            title={"Back"}
                            onPress={prop.goBackToSelectMonitoredService}
                        />
                    </View>

                    <View style={styles.bluetoothDivButton}>
                        <Button
                            id="closeScanDivButton"
                            title="Close"
                            onPress={()=>{prop.setShowBluetoothDiv(false)}}
                        />
                    </View>
                </View>
                </>         
            }
        </View>
    )
}

export default BluetoothDiv;
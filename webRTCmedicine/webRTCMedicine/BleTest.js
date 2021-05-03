import React, {Component} from 'react';
import { BleManager } from 'react-native-ble-plx';

class BleTest extends Component{
    constructor(props) {
        super(props);
        this.state={
            scaning: false,
            manager: new BleManager(),
            deviceMap: {},
            scanTimer: null
        }
    }

    /**
     * Scan for blutooth devices, save them into this.deviceMap identofied by the device.id
     * */
    scan(){
        console.log("here")
        if(!this.state.scaning) {
            this.setState({
                scaning: true,
                deviceMap: {}
            })
            
            this.state.manager.startDeviceScan(null, null, (error, device) => {                
                if (error) {
                    console.log('startDeviceScan error:',error)
                    
                    if(error.errorCode == 102){
                        alert('Please open the Bluetooth on your device');
                    }

                    this.setState({scaning: "false"})

                }else{
                    console.log("Scan: Device id: ", device.id," Device name: ", device.name);  
                    // this.state.deviceMap.set(device.id,device);
                }              
            })

            //Stop scanning in 5 seconds
            // if(this.state.scanTimer !== null){
            //     clearTimeout(this.state.scanTimer);
            // }
            // 
            // this.setState({
            //     scanTimer: setTimeout(()=>{
            //         if(this.state.scaning){
            //             this.stopScan();   
            //             this.setState({scaning: "false"});
            //         }                
            //     },5000)
            // })

            setTimeout(()=>{
                this.stopScan();   
                this.setState({scaning: "false"});              
            },5000)

        }else {
            this.stopScan();
            this.setState({scaning: "false"})
        }
    }

    stopScan(){
        this.state.manager.stopDeviceScan();
        console.log('stopDeviceScan');
    }
}

export default BleTest;
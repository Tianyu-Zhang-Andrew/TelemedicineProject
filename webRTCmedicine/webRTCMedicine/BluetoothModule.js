import React, {Component} from 'react';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

class BleModule extends Component{
    constructor(props) {
        super(props);
        this.scaning = false;
        this.isConnecting = false;
        this.isMonitoring = false;
        this.deviceMap = new Map();
        this.peripheralId = null;
        this.monitorListener = null;
        this.readServiceUUID = [];
        this.readCharacteristicUUID = [];
        this.writeWithResponseServiceUUID = [];
        this.writeWithResponseCharacteristicUUID = [];
        this.writeWithoutResponseServiceUUID = [];
        this.writeWithoutResponseCharacteristicUUID = [];
        this.nofityServiceUUID = [];
        this.nofityCharacteristicUUID = [];

        this.state = {
            manager: new BleManager(),
        }
    }
    
    /**
     * Get a bluetooth service, characteristic related information.
     * Returns a map {service1.uuid: {uuid:***, isPrimary:***, characteristicsCount:***, characteristics:
     *                                   {
     *                                       characteristic1.uuid: {
     *                                           uuid:***, isReadable***, isWritableWithResponse:***, isWritableWithoutResponse:***,
     *                                           isNotifiable:***, isNotifying:***, value:***
     *                                       },
     *                                       characteristic2.uuid:{...}
     *                                   }
     *                               },
     *                service2.uuid: {...},
     *                ...
     *               }
     * */
    async fetchServicesAndCharacteristicsForDevice(device) {
        var servicesMap = {}
        var services = await device.services()
    
        for (let service of services) {
          var characteristicsMap = {}
          var characteristics = await service.characteristics()
          
          for (let characteristic of characteristics) {
            characteristicsMap[characteristic.uuid] = {
              uuid: characteristic.uuid,
              isReadable: characteristic.isReadable,
              isWritableWithResponse: characteristic.isWritableWithResponse,
              isWritableWithoutResponse: characteristic.isWritableWithoutResponse,
              isNotifiable: characteristic.isNotifiable,
              isNotifying: characteristic.isNotifying,
              value: characteristic.value
            }
          }
    
          servicesMap[service.uuid] = {
            uuid: service.uuid,
            isPrimary: service.isPrimary,
            characteristicsCount: characteristics.length,
            characteristics: characteristicsMap
          }
        }
        return servicesMap
    }

    initUUID(){
        this.readServiceUUID = [];
        this.readCharacteristicUUID = [];
        this.writeWithResponseServiceUUID = [];
        this.writeWithResponseCharacteristicUUID = [];
        this.writeWithoutResponseServiceUUID = [];
        this.writeWithoutResponseCharacteristicUUID = [];
        this.nofityServiceUUID = [];
        this.nofityCharacteristicUUID = [];
    }

    /**
     * Given several services of a device, get the serviceUUID and characteristicUUID of its 
     * Notify, Read, Write, WriteWithoutResponse characteristics, save them in 8 lists.
     * */
    getUUID(services){      

        this.initUUID();    

        for(let i in services){
            console.log(services[i].uuid)

            let charchteristic = services[i].characteristics;
            for(let j in charchteristic){
             
                if(charchteristic[j].isReadable){
                    this.readServiceUUID.push(services[i].uuid);
                    this.readCharacteristicUUID.push({"service": services[i].uuid, 
                                                        "character": charchteristic[j].uuid});        
                }

                if(charchteristic[j].isWritableWithResponse){
                    this.writeWithResponseServiceUUID.push(services[i].uuid);
                    this.writeWithResponseCharacteristicUUID.push({"service": services[i].uuid, 
                                                                    "character": charchteristic[j].uuid});           
                }

                if(charchteristic[j].isWritableWithoutResponse){
                    this.writeWithoutResponseServiceUUID.push(services[i].uuid);
                    this.writeWithoutResponseCharacteristicUUID.push({"service": services[i].uuid,
                                                                        "character": charchteristic[j].uuid});           
                }

                if(charchteristic[j].isNotifiable){
                    this.nofityServiceUUID.push(services[i].uuid);
                    this.nofityCharacteristicUUID.push({"service": services[i].uuid,
                                                            "character": charchteristic[j].uuid});     
                }            
            }                    
        }     
        
        console.log("readServiceUUID: ", this.readServiceUUID)
        console.log("readCharacteristicUUID: ", this.readCharacteristicUUID)
        console.log("writeWithResponseServiceUUID: ", this.writeWithResponseServiceUUID)
        console.log("writeWithResponseCharacteristicUUID: ", this.writeWithResponseCharacteristicUUID)
        console.log("writeWithoutResponseServiceUUID: ", this.writeWithoutResponseServiceUUID)
        console.log("writeWithoutResponseCharacteristicUUID: ", this.writeWithoutResponseCharacteristicUUID)
        console.log("nofityServiceUUID: ", this.nofityServiceUUID)
        console.log("nofityCharacteristicUUID: ", this.nofityCharacteristicUUID)
    }

    /**
     * Scan for blutooth devices, save them into this.deviceMap identofied by the device.id
     * */
    scan(){
        if(!this.scaning) {
            return new Promise( (resolve, reject) =>{
                this.scaning = true;
                this.scanFinished = false;
                this.deviceMap.clear();

                this.state.manager.startDeviceScan(null, null, (error, device) => {                
                    if (error) {
                        console.log('startDeviceScan error:',error)
                        
                        if(error.errorCode == 102){
                            alert('Please open the Bluetooth on your device');
                        }

                        this.scaning = false; 
                        reject(error);

                    }else{
                        console.log("Scan: Device id: ", device.id," Device name: ", device.name);  
                        this.deviceMap.set(device.id,device.name)
                    }              
                })

                //Stop scanning in 10 seconds
                setTimeout(()=>{
                    this.stopScan();   
                    this.scaning = false;    
                    resolve(this.deviceMap);
                },10000)
            });

        }else {
            return new Promise( (resolve, reject) =>{
                this.stopScan();
                this.scaning = false;
                reject();
            });
        }
    }
    
    /**
     * Stop scanning for blutooth devices
     * */
    stopScan(){
        this.state.manager.stopDeviceScan();
        console.log('stopDeviceScan');
    }

    /**
     * Connect to Bluetooth, given the device id of the device that needs to be connected.
     * Store the device id in this.state.peripheralId.
     * Calls this.fetchServicesAndCharacteristicsForDevice() and this.getUUID(), 
     * achieves the result of this.getUUID(connected device's services).
     * */
    connect(id){
        console.log('isConneting:',id);   
        this.isConnecting = true; 

        return new Promise( (resolve, reject) =>{
            this.state.manager.connectToDevice(id).then(device=>{                           
                console.log('connect success:',device.name,device.id);    
                this.peripheralId = device.id;   
                return device.discoverAllServicesAndCharacteristics();

            }).then(device=>{
                return this.fetchServicesAndCharacteristicsForDevice(device);

            }).then(services=>{
                this.isConnecting = false;
                this.getUUID(services);     
                resolve();    

            }).catch(err=>{
                this.isConnecting = false;
                console.log('connect fail: ',err);
                reject(err);                    
            })
        });
    }

    /**
     * Disconnect the bluetooth
     * */
    disconnect(){
        return new Promise( (resolve, reject) =>{
            this.state.manager.cancelDeviceConnection(this.peripheralId)
                .then(res=>{
                    console.log('Disconnect success');
                    resolve(res);
                })
                .catch(err=>{
                    reject(err);
                    console.log('disconnect fail',err);
                })     
        });
    }

    /**
     * Read data, given the serviceUUID and characteristicUUID to be read, return read value as Promise<Base64 byte> 
     * */
    read(serviceUUID, characteristicUUID){
        console.log(serviceUUID)
        console.log(characteristicUUID)
        return new Promise( (resolve, reject) =>{
            this.state.manager.readCharacteristicForDevice(this.peripheralId, serviceUUID, characteristicUUID)
                .then(characteristic=>{                    
                    console.log('monitor success: ',characteristic.value);
                    resolve(characteristic.value);
                       
                },error=>{
                    console.log('read fail: ',error.reason);
                    reject(error);
                })
        });
    }

    /**
     * Monitor data change, given the serviceUUID and characteristicUUID to be read, return monitored value as Promise<Base64 byte> 
     * */
    monitor=(serviceUUID, characteristicUUID)=>{

        console.log(serviceUUID)
        console.log(characteristicUUID)
        return new Promise( (resolve, reject) =>{
            let transactionId = 'monitor';
            
            this.monitorListener = this.state.manager.monitorCharacteristicForDevice(this.peripheralId,serviceUUID,characteristicUUID,
            (error, characteristic) => {
                if (error) {
                    this.isMonitoring = false;
                    console.log('monitor fail: ',error.reason);      
                    reject(error);

                }else{
                    this.isMonitoring = true;
                    console.log('monitor success: ',characteristic.value);
                    resolve(characteristic.value); 
                }

            }, transactionId)
        });
    }  

    /**
     * Write data with response, given data needed to be written in Base64 format, serviceUUID and characteristicUUID.
     * Return latest value of characteristic as Promise<Characteristic>.
     * */
    write(value, serviceUUID, characteristicUUID){
        let transactionId = 'write';

        return new Promise( (resolve, reject) =>{      
            this.state.manager.writeCharacteristicWithResponseForDevice(this.peripheralId,serviceUUID,characteristicUUID,value,transactionId)
                .then(characteristic=>{                    
                    console.log('write success',value);
                    resolve(characteristic);

                },error=>{
                    console.log('write fail: ',error);
                    alert('write fail: ',error.reason);
                    reject(error);
                })
        });
    }

    /**
     * Write data without sesponse, given data needed to be written in Base64 format, serviceUUID and characteristicUUID
     * The latest value of characteristic may not be stored in the retuened Promise<Characteristic>.
     * */
    writeWithoutResponse(value, serviceUUID, characteristicUUID){
        let transactionId = 'writeWithoutResponse';

        return new Promise( (resolve, reject) =>{   
            this.state.manager.writeCharacteristicWithoutResponseForDevice(this.peripheralId,serviceUUID,characteristicUUID,value,transactionId)
                .then(characteristic=>{
                    console.log('writeWithoutResponse success',value);
                    resolve(characteristic);

                },error=>{
                    console.log('writeWithoutResponse fail: ',error);
                    alert('writeWithoutResponse fail: ',error.reason);
                    reject(error);
                })
        });
    }

    /**
     * Destroy BleManager
     * */
    destroy(){
        this.state.manager.destroy();
        this.monitorListener && this.monitorListener.remove();
    }

    /**
     * Change byte to String
     * */
    byteToString(arr) {  
        if(typeof arr === 'string') {  
            return arr;  
        }  
        var str = '',  
            _arr = arr;  
        for(var i = 0; i < _arr.length; i++) {  
            var one = _arr[i].toString(2),  
                v = one.match(/^1+?(?=0)/);  
            if(v && one.length == 8) {  
                var bytesLength = v[0].length;  
                var store = _arr[i].toString(2).slice(7 - bytesLength);  
                for(var st = 1; st < bytesLength; st++) {  
                    store += _arr[st + i].toString(2).slice(2);  
                }  
                str += String.fromCharCode(parseInt(store, 2));  
                i += bytesLength - 1;  
            } else {  
                str += String.fromCharCode(_arr[i]);  
            }  
        }  
        return str;  
    }  
}

export default BleModule;
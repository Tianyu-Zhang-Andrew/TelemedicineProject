import {
    StyleSheet,
} from 'react-native';
  

const styles = StyleSheet.create({
    container:{
      textAlign:"center",
      backgroundColor:"black",
      height: "100%",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },

    mainDiv:{
      width: 360,
      height: 270,
      backgroundColor: "white",
      borderStyle: "solid",
      borderColor: "black",
      borderWidth: 1,
      margin: 10
    },

    smallerDiv:{
      width: 160,
      height: 120,
      backgroundColor: "white",
      borderStyle: "solid",
      borderColor: "black",
      borderWidth: 1,
      margin: 5
    },

    participantDiv:{
      width: 240,
      height: 180,
      backgroundColor: "white",
      borderStyle: "solid",
      borderColor: "black",
      borderWidth: 1,
    },

    participant:{
      marginBottom: 5,
      marginRight: 5,
      textAlign: "center"
    },

    Logo:{
      width:100,
      height:60,
    },
    
    backgroundImage:{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },

    loginDiv:{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height:"100%"
    },

    inputDiv:{
      left: "2%",
      top: "10%",
      height: "70%",
      width:"40%",
      backgroundColor: "#f3f3f3",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent:"center",
      borderRadius: 20
    },
    
    header: {
      flex: 1,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      paddingRight: 20
    },

    roomMeta:{
      color: "white",
      fontWeight: "bold",
      marginRight: 10
    },

    mainContainer:{
      width: "95%",
      height: "100%",
      display: "flex",
      flexDirection: "column"
    },  

    videoContainer:{
      flex:6,
      flexDirection:"row",
      flexWrap: 'wrap',
      display: "flex",
      flexDirection: "row",
    },
    
    dataView:{
      flex: 1,
      height: "90%",
      backgroundColor: "black",
      borderColor: "white",
      borderWidth: 3,
      borderRadius: 5,
      display: "flex",
      flexDirection: "column"
    },

    bluetoothOptView:{
      flex: 3,
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
    },

    label:{
      flex: 1,
      fontWeight: "bold",
      color: "#f3f3f3",
      fontSize:20
    },

    value:{
      flex: 2,
      fontWeight: "bold",
      color: "#f3f3f3",
      fontSize:25
    },

    medicalData:{
      flex:3,
      borderColor: "white",
      borderWidth: 1,
      borderRadius: 5,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },

    videoView:{
      flex: 4,
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
      alignItems:"flex-start",
      justifyContent: "center"
    },
  
    participantName:{
      textAlign: "center",
      color: "white",
      fontWeight: "bold"
    },

    bluetoothButtonDiv:{
      display: "flex",
      flexDirection: "row"
    },

    bluetoothDiv:{
      position: "absolute",
      top:"10%",
      height: "80%",
      width: "80%",
      backgroundColor: "#f3f3f3",
      borderRadius: 20,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },

    bluetoothStatusDiv:{
      flex: 1,
      borderBottomColor: "gray",
      borderBottomWidth: 2,
      width: "90%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },

    bluetoothStatusText:{
      fontSize: 25,
      fontWeight: "bold"
    },

    bluetoothResultDiv:{
      flex: 5,
      width: "100%",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
    },

    bluetoothResultflatList: {
      width: "80%",
    },

    bluetoothDivButtonDiv:{
      flex: 1,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderTopWidth: 2,
      borderTopColor: "gray",
      width: "90%"
    },

    bluetoothDivButton:{
      margin: 10,
    },

    bluetoothDiviceInfoDiv: {
      width: "100%",
      borderBottomColor: "gray",
      borderBottomWidth: 1,
      margin: 5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 50,
    },

    connectText: {
      color: "blue",
      textAlign: "center"
    }
  });

  export default styles;
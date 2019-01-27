import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView from 'react-native-maps';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Maps',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <MapView
          showsUserLocation
          style={styles.map}
          showsUserLocation = {false}
          followUserLocation = {false}
          zoomEnabled = {true}
          initialRegion={{
            latitude: 45.5035,
            longitude: -73.5685,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >   
         <MapView.Marker 
         coordinate={{
          latitude: 45.5035,
          longitude: -73.5685
         }}>
         
         <View styles={styles.radius}>
           <View styles={styles.marker}/>
         </View>
         </MapView.Marker>
         </MapView>
        
      
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  map: {
    height: 400,
    margin:5
 },
 marker:{
  height:20,
  width:20,
  borderWidth:3,
  borderColor:'white',
  borderRadius:20/2,
  overflow:'hidden',
  backgroundColor:'#007A55'
 },
 radius:{
  height:50,
  width:50,
  borderRadius:50/2,
  overflow:'hidden',
  backgroundColor: 'rgba(0,112,255,0.1)',
  borderWidth:1,
  borderColor:'rgba(0,112,255,0.1)',
  alignItems:'center',
  justifyContent:'center'

 }
});

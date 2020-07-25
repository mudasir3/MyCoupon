import React, { Component } from 'react';
import { StyleSheet, Text, View,Image ,TextInput,Switch,TouchableOpacity,Platform,Alert} from 'react-native';

// import * as Location from "expo-location";
// import * as Permissions from "expo-permissions";

export default class LoginMerchantScreen extends Component {

  constructor(props) {
    super(props)
  }

state ={
  number : '',
  LocationSwitchState :false,
  location: undefined,

}

changeText(newText) {
  this.setState({number : newText});
  }

  // onLocationSwitchValueChange = () => {
  //   this.setState({
  //       LocationSwitchState: !this.state.LocationSwitchState
  //   });
  // };

  // askLocation = async() => {
  //   let { status } = await Permissions.askAsync(Permissions.LOCATION);
  //   if (status !== 'granted') {
  //       this.setState({
  //           errorMessage: 'Permission to access location was denied',
  //       });
  //       return
  //   }
    
  //   try { 
  //       let location = await Location.getCurrentPositionAsync(); 
  //       let address = await Location.reverseGeocodeAsync({ latitude : location.coords.latitude,
  //                                                       longitude: location.coords.longitude})

  //       //console.log("locationn " +JSON.stringify(location)   + "  address " + JSON.stringify(address))

  //       this.props.navigation.navigate('Home')
  //     }catch(err){
  //       console.error("  error " +err)
  //   }

  // }
render()
    {
    return (
      <View style={styles.container}>
  
    {/* <View  style={styles.innerContainer}>
    <Image style={{width :320 ,height:100}} 
         source={require('../../../assets/koopa.png')} />
    </View>

      <View style={styles.innerContainer}>   
            <TextInput
                style={styles.ViewContainer}
                placeholder="Enter Name "
                //keyboardType={"numeric"} 
                maxLength={4}            
                value={this.state.number}
                onChangeText={phone => { this.changeText(phone)}} />

            <TouchableOpacity 
                style ={{flexDirection:'row',marginLeft:30,marginTop:30}}
                onPress={this.askLocation} 
            >
               <Text style={{fontSize :20}}>Enable Location </Text>
            </TouchableOpacity>
      </View>

      <View style={styles.innerContainer}>   
       
      </View> */}

      </View>
    );
  }
}
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    innerContainer :{
      flex:1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop:10
    } ,
     ViewContainer :{
     // backgroundColor: '#aaaaaa',
      width :250,
      padding:15,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius:10,
      borderWidth:1,
      borderColor :'#000000'
      }
  });
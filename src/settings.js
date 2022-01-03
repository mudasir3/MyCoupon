import React, { Component } from 'react';
import { StyleSheet, View,Image,TouchableOpacity,Text,Switch} from 'react-native';

export default class SettingsScreen extends Component {

  constructor(props) {
    super(props)
  }

  state ={
    BiometricSwitchState: false,
    FaceRecognitionSwitchState: false,
    NotificationSwitchState: false,
  }

  onNotiSwitchValueChange = () => {
    this.setState({
        NotificationSwitchState: !this.state.NotificationSwitchState
    });
  };
  onSwitchValueChange = () => {
    this.setState({
        BiometricSwitchState: !this.state.BiometricSwitchState
    });
  };

  onFaceRecognitionSwitchValueChange = () => {
    this.setState({
        FaceRecognitionSwitchState: !this.state.FaceRecognitionSwitchState
    });
  };

render()
    {
    return (
      <View style={styles.container}> 
        <View >
            <View style ={{flexDirection:'row',marginLeft:30}}>
                <Text style={{fontSize :20}}>Enable Biometric</Text>
                <Switch


                    style={{marginLeft:97}}
                    value={this.state.BiometricSwitchState}
                    onValueChange={this.onSwitchValueChange}
                    trackColor={{ true: "#a78c52", false: "#cacaca" }}
                    thumbColor={"#DDDDDD"}
                    />
            </View>

            <View style ={{flexDirection:'row',marginLeft:30,marginTop:10}}>
                <Text style={{fontSize :20}}>Enable Face Recognition</Text>
                <Switch
                    style={{marginLeft:30}}
                    value={this.state.FaceRecognitionSwitchState}
                    onValueChange={this.onFaceRecognitionSwitchValueChange}
                    trackColor={{ true: "#a78c52", false: "#cacaca" }}
                    thumbColor={"#DDDDDD"}
                    />
            </View>

            <View style ={{flexDirection:'row',marginLeft:30,marginTop:10}}>
                <Text style={{fontSize :20}}>Enable Push Notifications</Text>
                <Switch
                    style={{marginLeft:22}}
                    value={this.state.NotificationSwitchState}
                    onValueChange={this.onNotiSwitchValueChange}
                    trackColor={{ true: "#a78c52", false: "#cacaca" }}
                    thumbColor={"#DDDDDD"}
                    />
            </View>
        </View>

        <View style={styles.ViewContainer}>   
          <TouchableOpacity
            style={{borderColor: '#aaaaaa',padding:15,alignItems: 'center',justifyContent: 'center'}}
            onPress={() => this.props.navigation.navigate('LoginMerchant')}
            >
            <Text style={{fontSize :26,fontWeight:'bold',color:'blue'}}>Switch to Merchant Account</Text>          
          </TouchableOpacity>
        </View>                   
      </View>
    );
  }
}
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
      marginTop:30
    },
    innerContainer :{
        flex:1,
        alignItems: 'center',
      } ,
       ViewContainer :{
        padding:15,
        flex:2,
        alignItems: 'center',
        justifyContent: 'center',
        }
  });
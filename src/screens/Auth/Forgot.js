import React, { Component } from 'react';
import { StyleSheet, Text, View,TouchableOpacity ,TextInput,Image, Keyboard,Platform, ActivityIndicator,KeyboardAvoidingView} from 'react-native';

import VirtualKeyboard from 'react-native-virtual-keyboard';
import { Icon, Row} from "native-base";
import SearchableDropdown from 'react-native-searchable-dropdown';
import countries from "./Countries";
import Spinner from 'react-native-loading-spinner-overlay';
import RNPicker from "rn-modal-picker";

import {registerUser} from "../API/ApiActions";
import LinearGradient from 'react-native-linear-gradient';
import {get} from "../LocalStorage";



export default class RegisterNumberScreen extends Component {
    
    constructor(props) {
        super(props)
        state = {
          userid:''
        }
    }




    componentDidMount()
    {
      this.getuserid()
    }
  
    getuserid = async() =>
    {
      let user =await get("USER_ID")
  
      console.log("user " + user);
  
      this.setState({
        userid : user
      })
      this._ForgotPin();
    }

    _ForgotPin = async () => {
      fetch('https://koopa.sr7.tech/api/forgot/password', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.state.userid,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("OTP: " + JSON.stringify(responseJson.data[0].user.id))
            try {
              // alert(responseJson.message);
              this.props.navigation.navigate('OTP', { userid: this.state.userid ,forgot:"true" ,forgotid :responseJson.data[0].user.id })
            } catch (error) {
              alert(responseJson.message);
            }
  
        })
        .catch((error) => {
          alert("Last catch: "+ error)
          // this.setState({
          //   isloading: false,
          // });
          // alert('There is a problem in your network connection');
        });
  
  }

    
    render()
    {
        return (
        <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}>
            <Text style={{fontSize:15, color: 'white'}}>Sending New OTP....</Text>
          </LinearGradient>       
        );
    }

}

const styles = StyleSheet.create({
  container: {
    marginTop:50,
    // backgroundColor: '#fff',
    flex:1,
    //alignItems: 'center',
    //justifyContent: 'flex-start',
  },
  innerContainer :{
    alignItems: 'center',
    justifyContent: 'center',
  } ,
  bottomContainer :{
    alignItems: 'flex-end',
    //justifyContent: 'center',
    //flexDirection:'row',
    
  } ,
  linearGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
});



const Styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  },


  searchBarContainerStyle: {
    marginBottom: 10,
    flexDirection: "row",
    height: 40,
    shadowOpacity: 1.0,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1
    },
    backgroundColor: "rgba(255,255,255,1)",
    shadowColor: "#d3d3d3",
    borderRadius: 10,
    elevation: 3,
    marginLeft: 10,
    marginRight: 10
  },

  selectLabelTextStyle: {
    color: "white",
    textAlign: 'center',
    marginVertical: 15,
    width: 50,
    flexDirection: "row"
  },
  placeHolderTextStyle: {
    color: "white",
    textAlign: 'center',
    marginVertical: 15,
    width: 50,
    flexDirection: "row"
  },
  dropDownImageStyle: {
    width: 15,
    height: 15,
    alignSelf: "center"
  },
  listTextViewStyle: {
    color: "black",
    marginVertical: 10,
    flex: 0.9,
    marginLeft: 20,
    marginHorizontal: 10,
    textAlign: "left",

  },
  pickerStyle: {
    marginLeft: 10,
    elevation:0,
    paddingRight: 15,
    marginRight: 0,
    marginBottom: 0,
    // shadowOpacity: 1.0,
    // shadowOffset: {
    //   width: 1,
    //   height: 1
    // },
    width: 70,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#a5a5a4',
    // shadowRadius: 10,
    // backgroundColor: "rgba(255,255,255,1)",
    // shadowColor: "#d3d3d3",
    flexDirection: "row"
  }
});
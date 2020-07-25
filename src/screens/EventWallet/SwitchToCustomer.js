import React, { Component } from 'react';
import { StyleSheet, View,Image,TouchableOpacity,Text, ActivityIndicator,TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {LoginMerchant} from "../API/ApiActions";
import { NavigationEvents } from 'react-navigation';

import {set,get} from "../LocalStorage";

import { ConfirmDialog } from 'react-native-simple-dialogs';


export default class SwitchToCustomerScreen extends Component {

  constructor(props) {
    super(props);
  }

  state={
    user_id :'',
    longitude :'',
    latitude :'',
    user_id: '',
    loading:true,
    nameDialog:false,
    name:''
  }

  componentDidMount(){
    this.getuserid()
    
  }

  getuserid = async() =>
  {
    let user =await get("USER_ID")

    console.log("user " + user);

    this.setState({
      user_id : user
    })

    this.SwitchCustomer()

  }


  SwitchCustomer=()=>{

   // this.setState({ loading: true});

    set(1,"first_login")
    this.props.navigation.navigate('HomeScreen')

  }

render()
    {
      if (this.state.loading) {
        return (
          <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{color:'white',marginBottom:10}}>Switching To Customer</Text>
                <ActivityIndicator size="large" color ="#ffffff" />
            </View>
          </LinearGradient>
        );
      }


    return (
      <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}>
             <NavigationEvents
                onDidFocus={payload => this._requestLocation()}
            />

      </LinearGradient>     
    );
  }
}
  
  const styles = StyleSheet.create({

  linearGradient: {
    flex: 1,
    justifyContent:'space-between',
    alignItems: 'center',
    flexDirection: 'column'
  },

      qrContainer :{
        alignItems: 'center',
      },

  });
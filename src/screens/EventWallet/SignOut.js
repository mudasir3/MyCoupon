import React, { Component } from 'react';
import { StyleSheet, View,Image,TouchableOpacity,Text, ActivityIndicator,TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {set,get} from "../LocalStorage";
import {signOut} from "../API/ApiActions";


export default class SignoutScreen extends Component {

  constructor(props) {
    super(props);
  }

  state={
    loading:true,
  }

  componentDidMount(){
    
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.getuserid()
      
    });
  }


  getuserid = async() =>
  {
    let user =await get("USER_ID")

    console.log("user " + user);
    this.logout(user)

  }

  logout =(user) => {

     set("first","first_login")
     set(0,"USER_ID")
     set(null,"merchant_name")
     set(0,"event_id")
     set(0,"NEWEWcreatorid")
     set(0,"NEWEWeventid")
     set('',"NEWEWname")
     set(0,"Merchant_id")
    

    var user_id = user
    const params = {user_id};

    console.log("params signout" +JSON.stringify( params) + " user " + user)

    signOut(params)
     .then(res => {
       this.setState({ loading: false }); 
      console.log("res " + JSON.stringify(res.data))

      this.setState({loading: false}) 
      this.props.navigation.navigate('Register')

     })
     .catch(e => { 
       this.setState({ loading: false })
       console.log("error", e);
     });

    // setTimeout(()=>{
    //     this.setState({loading: false}) 
    //     this.props.navigation.navigate('Register')
    //    },200);

  }
  
render()
    {
      if (this.state.loading) {
        return (
          <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{color:'white',marginBottom:8}}>Signing Out</Text>
                <ActivityIndicator size="large" color ="#ffffff" />
            </View>
          </LinearGradient>
        );
      }
 
    return (
      <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}>
            
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
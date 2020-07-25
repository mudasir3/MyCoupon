import React, { Component } from 'react';
import { StyleSheet, View,Image,TouchableOpacity,Text, StatusBar, Platform,
  ActivityIndicator,Linking,Alert,Share,AppState} from 'react-native';
import { Icon  } from "native-base"; 
import CustomHeader from '../../CustomHeader';
import LinearGradient from 'react-native-linear-gradient';

//import QRCode from 'react-native-qrcode';
import { QRCode } from 'react-native-custom-qr-codes-expo';

import * as Font from 'expo-font';
import { DrawerActions } from 'react-navigation-drawer';

import {UserDetail,checkDevice,signOut} from "../API/ApiActions";
import {get} from "../LocalStorage";
import {set} from "../LocalStorage";

import { NavigationEvents } from 'react-navigation';

import Spinner from 'react-native-loading-spinner-overlay';
import NavigationService from '../NavigationService';


import { withNavigation } from 'react-navigation';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { StackActions, NavigationActions } from 'react-navigation';

import DeviceInfo from 'react-native-device-info';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


var _this;
var interval;
var paysomeone= 0
var go =0
var pay =1
var loginmerchant =0;
var Home=0;

var refreshdetails=1
class HomeScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      EWFLAG : false,
      EWname:'',
      EWbalance :0,
      EWid : 0,
      userid : '',
      defaultText:'Please give me some tokens',
      loading: false,
      //loadingsp: true,

      refresh:0,
      //go:0,
      paysomeone:0,
      initialRender:true
    };
  }



  componentDidMount() {
    _this =this;

    interval= setInterval(()=>{
        this.refreshUserDetails()    
    },5000) 
    
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      refreshdetails=1



      this.setState({
        loading:true
      })

      
      loginmerchant =0
      Home=1

      setInterval(() => {
        this.setState({
         // initialRender:false,
         // loading:false,         
        })
         pay=0
         set(0, 'faceCheck')

      }, 2000);

      this.getuserid()

     console.log("drawerrrrrrr " )

     AppState.addEventListener('change', newState => {
      console.log('new state', newState + "   gooo "  + go + " paysomone " +  this.state.paysomeone);

      if(go==0 && newState =='active')
      {
        if(this.state.paysomeone ===1 && newState =='active')
        {   

          this.setState({
            paysomeone:0
          })
        }
        else
        {
          this.setState({
            paysomeone:1
          })
        }
      }
      else
      {
        if(newState=='active')
        {
          setInterval(()=>{
           // go=0,
            pay=0
          },3000)          
        }
        this.setState({
          paysomeone:1
        })
      }

      if(this.state.paysomeone == 0 && go ==0 && newState =='active'){
        if(pay==0 && loginmerchant==0 && newState=='active' &&Home==1)
        {
           NavigationService.navigate('AuthLoading')
          console.log("iffffffffff" + this.state.paysomeone +"  go  "+go)
        }        
      }     
      else
      {
       
        console.log("elsee " + this.state.paysomeone)
      }

    });


      
   
      //this.setState({  loading: true});

      
        
    });
  }

  checkdevice=(user)=>{
    var user_id =user
    var device_id = DeviceInfo.getUniqueId();
    const params = {user_id,device_id} ;

    checkDevice(params)
     .then(res => {
      //alert(res.)
    //  console.log("checkDevice ressss " + JSON.stringify(res))

      if(res.data.data == 2)
      {
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
   
     //  console.log("params signout" +JSON.stringify(params) + " user " + user)
   
       signOut(params)
        .then(res => {
        // console.log("res " + JSON.stringify(res.data))
         //this.setState({loading: false}) 
         alert(res.data.message)

         this.props.navigation.navigate('Register')
   
        })
        .catch(e => { 
         // console.log("error", e);
          this.getUserdetails(user)

        });
   
      }
      else
      {
        this.getUserdetails(user)
      }
         
     })
     .catch(e => { 
       this.getUserdetails(user)
       console.log("error", e);
     });
     
  }


    getuserid = async() =>
    {
      this.setState({  loading: true });
      var user =await get("USER_ID")

     // console.log("user " + user);

      this.setState({
        userid : user
      })

      
      this.checkdevice(user)
    }

//   static navigationOptions = ({ navigation }) => 
//   ({
//     headerLeft: (
//         <View style={{ paddingLeft: 16 }}>
//           <Icon
//             name="md-menu"
//             size={30}
//             style={{ color: "#000000" }}
//             onPress={() => navigation.toggleDrawer()}
//           />
//         </View>
//       ),
//       headerRight: (
//         <View style={{ paddingRight: 10 }}>
//           <Icon
//             name="md-settings"
//             size={30}
//             style={{ color: "#000000" }}
//             //onPress={() => navigation.toggleDrawer()}
//           />
//         </View>
//       )
// })

//static navigationOptions = { header: null };

toggledrawer(){

  if(loginmerchant==1)
  {
    loginmerchant =0
  }
  else
  {
      // setInterval(()=>{
      //   loginmerchant =1
      // },5000)  
      loginmerchant =1

  }
  

  this.props.navigation.toggleDrawer()

 // console.log("toggle drawer")

}

refreshUserDetails =() =>
{
  

  
 var id =this.state.userid
 UserDetail(id)
   .then(res => {
    //console.log("user detaillss res " + JSON.stringify(res))

    if((res.data.data.eventWalletCustomer == null))
    {
      this.setState({
        EWname: '',
        EWbalance :'',
      })
    }
    else
    {
      this.setState({
        EWname: res.data.data.eventWalletDetails.name,
        EWbalance :res.data.data.eventWalletCustomer.balance,
      })
    }

   })
   .catch(e => { 
     console.log("error", e);
   });
 

}

getUserdetails=(userid)=>{

  this.setState({
    EWFLAG : false,
    EWname:'',
    EWbalance :0,
    EWid : 0,
    initialRender:true
  })

  var id =this.state.userid

  const params = userid ;

  UserDetail(id)
   .then(res => {
    //console.log("user detaillss res " + JSON.stringify(res))


    if((res.data.data.eventWalletCustomer == null))
    {
      this.setState({
        EWFLAG: false,
        //loading: false,
        initialRender:true,
        EWname: '',
        EWbalance :'',
        EWid : '',
      })

      setTimeout(function(){
        _this.setState({
          initialRender:false,
          loading: false,})
      }, 4000);

     // set(res.data.data.user_details.merchant_id,"Merchant_id")
     // set(this.state.EWid,"event_id")
    }
    else
    {
      this.setState({
        EWFLAG: true,
        EWname: res.data.data.eventWalletDetails.name,
        EWbalance :res.data.data.eventWalletCustomer.balance,
        EWid : res.data.data.eventWalletCustomer.event_wallet_id,
        
        initialRender:true,

      })

      setTimeout(function(){
        _this.setState({
          initialRender:false,
          loading: false,})
      }, 4000);
    

      set(res.data.data.user_details.merchant_id,"Merchant_id")
      set(res.data.data.eventWalletCustomer.event_wallet_id,"event_id")

    }
    // if(res.data.message === "Success")
    // {
    //   this.props.navigation.navigate('HomeScreen' )
    // }
    //  else{
    //   alert("PIN incorrect")
    //  } 

       
   })
   .catch(e => { 
    this.setState({ 
      loading: false,
      initialRender:false,
    })

     console.log("error", e);
    // alert("PIN incorrect")
   });

   
}



ShareMessage(){
     go=1
    this.setState({
     paysomeone:1,
   },()=> {
            console.log("request payment ")
      Share.share({
        message: "https://koopa.page.link/coupon",
      })
      .then((responseJson) => {
        setInterval(()=>{
           go=0          
         },5000) 
        console.log("responseJson " +JSON.stringify(responseJson) )
  
   })
   .catch((error) => {

    })

   })

};

onSwipe(gestureName, gestureState) {
  // const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
  // console.log("swipeeeee" + gestureName + " gestureState " + JSON.stringify(gestureState) + "  SWIPE_DOWN " + SWIPE_DOWN )

  // _this.getuserid()

}

onSwipeLeft(gestureName, gestureState)
{
  console.log("swipeeeee" + gestureName + " gestureState " + JSON.stringify(gestureState)  )

  _this.props.navigation.toggleDrawer()
}

onSwipeDown(gestureName, gestureState) {
  const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
  //console.log("swipeeeee" + gestureName + " gestureState " + JSON.stringify(gestureState) + "  SWIPE_DOWN " + SWIPE_DOWN )

  _this.getuserid()

}

navigate =async()=> {

  set(1 , 'pay').then(res=>{

  pay=1

  //set("scan","screen")
    this.props.navigation.navigate('ScanQr',
    {"userid":this.state.userid,"userType":"customer","balance":this.state.EWbalance})
  
  }).catch(e=>{

  });
    
}


componentWillUnmount() {
  this.focusListener.remove();
  AppState.removeEventListener('change', console.log("event removed"));
}


RemoveListener(){
 // console.log("Will Blurr")
  //AppState.removeEventListener('change', console.log("event removed from will blur"));
}

stoprefresh=()=>{

  go=0;
  Home=0;
  refreshdetails=0;

  console.log("willl blurrrrrrrrrr")
  clearInterval(interval)

  this.setState({
    //refresh:0
   // loading:false,
  })
}

render()
    {

      const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
      };

      //console.log("initial renderrrr  " + this.state.loading)
    return (

      <GestureRecognizer
      onSwipe={this.onSwipe}
      onSwipeUp={this.onSwipeUp}
      onSwipeDown={this.onSwipeDown}
      onSwipeLeft={this.onSwipeLeft}
      onSwipeRight={this.onSwipeLeft}
        config={config}
        style={{flex:1,justifyContent:'flex-start',alignItems:'center'}}
        >
       <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}>

        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.loading}
          //Text with the Spinner
          // textContent={'Loading...'}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
     <NavigationEvents
      onDidFocus={payload => this.getUserdetails()}
      onWillBlur={payload => this.stoprefresh() }
    />

    

<TouchableOpacity 
        style={{alignSelf:"flex-end",
        marginTop: Platform.OS === 'ios' ? '10%' : StatusBar.currentHeight,
        marginRight: 15
       }}
        onPress={()=> 
          this.toggledrawer()
          
        }
          // onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}
           >
              <Image
              source={require('../../../assets/settings.png')}
            />
        </TouchableOpacity>


       
       {this.state.EWFLAG == false?
       <View>
         {this.state.initialRender?
         null
        :
        <View style={styles.linearGradient}>
            {/* {
              this.state.initialRender?
              null: */}
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
               <Text style={{fontSize :30, fontWeight: 'bold', color: 'white'}}>No Event Joined</Text>

               <TouchableOpacity
            style={{
              backgroundColor: '#FFFFFF',
              width :wp('55%'),
              padding:5,
              marginTop:5,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius:7,
              borderColor: 'white',
              borderWidth: 2
              }}
            onPress={() => this.props.navigation.navigate('AllEvents')}
            >
            <Text style={{fontSize :22, fontWeight: 'bold',color:"#098EE3"}}>Join Event Now</Text>

          </TouchableOpacity>

            </View>
          </View>
          }
       </View>
       :
       <View style={styles.linearGradient}>
        

        <Text style={{ 
          fontSize :30, 
          color: 'white',
          fontFamily: 'PoppinsMedium'
        }}>{this.state.EWname}</Text>

           <View
            style={{
              backgroundColor: '#fff',
              width :140,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius:13,
              borderColor: '#B3B3B3',
              borderWidth: 2
              }}
           // onPress={() => this.props.navigation.navigate('ScanQr',{"userid":this.state.userid,"userType":"customer"})}
            >
            <Text style={{
              fontSize :20, paddingTop:5,
              fontFamily:'PoppinsMedium', 
              alignItems: 'center', textAlign:'center',
              color: '#810B0B'}}>${this.state.EWbalance}</Text>

          </View>
         

        <View style={{
           flexDirection:'column', 
           justifyContent:'center', 
           margin: 8,
           alignItems: 'center'}}> 
         <Text style={{
          fontSize :16, 
          color: '#ADB0B3',
          fontFamily: 'PoppinsMedium'
          }}>To get paid show the QR code below</Text>
          <Text style={{
            fontFamily: 'PoppinsMedium', 
            color: 'white',
            fontSize :16,
            }}>OR</Text>

        <View style={{alignItems:'center',flexDirection:'row', marginTop: -5}}>
          
          <TouchableOpacity 
            onPress={()=> this.ShareMessage()}
            >
            <Text style={{
              fontFamily: 'PoppinsMedium', 
              color: 'white',
              fontSize :16
              }}> Request Payment</Text>
          </TouchableOpacity>
        </View>
        </View>
          
          <View style={{
            backgroundColor: 'white', 
            borderColor:'#B3B3B3',
            borderWidth:3,
            borderRadius:20
            }}>
          <View style={{
            backgroundColor: 'white', 
            borderColor:'white',
            borderWidth:3,
            borderRadius:20
            }}>
              <QRCode 
              size = {hp('35%')}
              content={this.state.EWid+ " " + this.state.userid + " "+ "customer"}
              color='black'
              />
           </View>
           </View>

            <TouchableOpacity
            style={{
              marginBottom: 30,
              backgroundColor: '#079422',
              padding:5,
              width: '30%',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius:7,
              borderColor: 'white',
              borderWidth: 1.5,
              marginTop:10
              }}
            onPress={() => this.navigate()}
            >
            <Text style={{fontSize :20, fontWeight: 'bold', color: 'white',paddingBottom:3,paddingTop:3}}>Pay</Text>

          </TouchableOpacity>
          </View>
       }
       
                  </LinearGradient>     

            </GestureRecognizer>
    );
  }
}
  
  const styles = StyleSheet.create({

  linearGradient: {
    justifyContent:'flex-start',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    flexDirection: 'column'
  },

    qrContainer :{
      alignItems: 'center',
    },

  });




    export default withNavigation(HomeScreen);
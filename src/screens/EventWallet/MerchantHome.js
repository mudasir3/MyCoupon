import React, { Component } from 'react';
import { StyleSheet, 
  View,Image,TouchableOpacity,
  Text, ActivityIndicator,Linking,Alert,Share, StatusBar, Platform,Dimensions,AppState} from 'react-native';
import { Icon  } from "native-base"; 
import CustomHeader from '../../CustomHeader';
import LinearGradient from 'react-native-linear-gradient';

//import QRCode from 'react-native-qrcode';
import { QRCode } from 'react-native-custom-qr-codes-expo';
//import QRCode from 'react-native-qrcode-generator';

import {MerchantDetails,MerchantJoinRequests,checkDevice,signOut} from "../API/ApiActions";
import {get,set} from "../LocalStorage";
import { NavigationEvents } from 'react-navigation';
import NavigationService from '../NavigationService';

import { withNavigation } from 'react-navigation';

import Spinner from 'react-native-loading-spinner-overlay';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import IconBadge from 'react-native-icon-badge';
import DeviceInfo from 'react-native-device-info';


import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
 
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";


var _this;
var interval;
var paysomeone= 0
var go =0
var pay =1
var Home =0

var refreshdetails=1

 class MerchantHome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      EWFLAG : false,
      EWname:'',
      EWbalance :0,
      EWid : 0,
      userid : 0,
      merchantid:0,
      defaultText:'Please give me some tokens',
      creatorid:0,

      EWCreatedBy:'',
      requestcount :[],
      count:0,
      creatorname:'',
      refresh:1,
      paysomeone:0,
      initialRender:true

    };

  }

  componentDidMount() {

    _this =this;

    this.getuserid()


    interval = setInterval(()=>{
      this.refreshDetails()
    },5000)

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
     // pay=0 
      Home =1
      refreshdetails=1
      setInterval(() => {
         pay=0,
       //  initialRender = false,

         set(0, 'faceCheck')
      }, 2000);

 

      this.getuserid()

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
              go=0,
              pay=0
            },3000)          
          }
          this.setState({
            paysomeone:1
          })
        }
  
        if(this.state.paysomeone== 0 && go ==0 && newState =='active'){
          if(pay==0 && newState=='active' && Home==1)
          {
             NavigationService.navigate('AuthLoading')
            console.log("iffffffffff" + this.state.paysomeone)
          }        
        }     
        else
        {    
          console.log("elsee " + this.state.paysomeone)
        }
  
      });

       // console.log("this.state.refresh intervalll " + this.state.refresh)

        

    });



    

  }

  componentWillUnmount() {
    this.focusListener.remove();
  AppState.removeEventListener('change', console.log("event removed"));

  }

  getuserid = async() =>
  {
   // console.log("get userid")

    this.setState({ loading: true })
    let user =await get("Merchant_id")

    let userrrr =await get("USER_ID")


   // console.log("user " + user);

    this.setState({
      merchantid : user
    })

    this.checkdevice(userrrr,user)


  }

  checkdevice=(user,merchant)=>{
    var user_id =user
    var device_id = DeviceInfo.getUniqueId();
    const params = {user_id,device_id} ;

    checkDevice(params)
     .then(res => {
      //alert(res.)
     // console.log("ressss " + JSON.stringify(res))

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
   
      // console.log("params signout" +JSON.stringify(params) + " user " + user)
   
       signOut(params)
        .then(res => {
       //  console.log("res " + JSON.stringify(res.data))
         //this.setState({loading: false}) 
         alert(res.data.message)

         this.props.navigation.navigate('Register')
        })
        .catch(e => { 
        //  console.log("error", e);
          //this.getRequestCount(merchant)
          this.getUserdetails(merchant)
        });
      }
      else
      {
        //this.getRequestCount(merchant)
        this.getUserdetails(merchant)
      }
        
     })
     .catch(e => { 
     //  console.log("error", e);
      // this.getRequestCount(merchant)
       this.getUserdetails(merchant)
     });
     
  }

  getRequestCount =(user,eweventid)=>{

    //console.log("user " + user)
  
    
    var id = JSON.parse(user) 
    var event_wallet_id =eweventid
  
    set(eweventid, "NEWEWeventid")
    const params = {id,event_wallet_id};
  
   // console.log("params " + JSON.stringify(params) )
  
    MerchantJoinRequests(params)
    .then(res => {
     //console.log("all requestssss " + res.data.data )
  
     let array = res.data.data
     //    this.arrayholder = res.data.data;
     this.setState({
         requestcount: array
     })   
    })
    .catch(e => { 
     // console.log("error retreiving request count", e);
    });
  }

static navigationOptions = { header: null };

toggledrawer(){
  //console.log("toggle drawer")
 
}

refreshDetails=()=>{

 
  var id = this.state.merchantid

  //console.log("this.state.refresh" + id)

  MerchantDetails(id)
   .then(res => {
    // this.setState({ loading: false })

   // console.log("merchant detaillss res " + JSON.stringify(res))

    if((res.data.data.eventWalletmerchant == null))
    {
      this.setState({
        EWFLAG: false,
        //initialRender:false,
       // loading:false,
        EWname: '',
        creatorid :'',
        EWbalance :'',
        EWid : '',
        creatorname :'',
      })
      //console.log("refreshhhh ifffff")

    }
    else
    {

     // console.log("refreshhhh elseeee")

      this.setState({
        //EWFLAG: true,
        //EWname: res.data.data.eventWalletDetails.name,
        //creatorid :res.data.data.eventWalletDetails.creator_id,
        EWbalance :res.data.data.eventWalletmerchant.balance,
        //EWid : res.data.data.eventWalletmerchant.event_wallet_id,
        //loading:false,

        //creatorname :res.data.data.user_details.merchant_name,
        //initialRender:false,

      })

      this.getRequestCount(id,this.state.EWid)

    }
   })
   .catch(e => { 
    // console.log("error", e);
   });

  
}

stoprefresh=()=>{

  Home =0
  refreshdetails=0
//  console.log("stop  refreshh" + interval)
 // clearInterval(interval)
  this.setState({
    //refresh:0,
    loading:false
  })
}

getUserdetails=(user)=>{

  this.setState({
    EWFLAG : false,
    EWname:'',
    EWbalance :0,
    EWid : 0,
    EWCreatedBy:'',
    requestcount :[],
    initialRender:true
  })

  var id = this.state.merchantid

  const params = id;

  MerchantDetails(user)
   .then(res => {
    // this.setState({ loading: false })
   // console.log("merchant detaillss res " + JSON.stringify(res))

    if((res.data.data.eventWalletmerchant == null))
    {
      this.setState({
        EWFLAG: false,
       // loading:false,
        initialRender:true,

        EWname: '',
        creatorid :'',
        EWbalance :'',
        EWid : '',
        creatorname :'',
      })

      setTimeout(function(){
        _this.setState({
          initialRender:false,
          loading: false,})
      }, 4000);
    }
    else
    {

      this.getRequestCount(user,res.data.data.eventWalletmerchant.event_wallet_id)

      this.setState({
        EWFLAG: true,
        initialRender:true,

        EWname: res.data.data.eventWalletDetails.name,
        creatorid :res.data.data.eventWalletDetails.creator_id,

        EWbalance :res.data.data.eventWalletmerchant.balance,
        EWid : res.data.data.eventWalletmerchant.event_wallet_id,
        //loading:false,

        creatorname :res.data.data.user_details.merchant_name,

      })

      setTimeout(function(){
        _this.setState({
          initialRender:false,
          loading: false,})
      }, 4000);


      set(res.data.data.eventWalletmerchant.event_wallet_id,"event_id")

    }
   })
   .catch(e => { 
    this.setState({ loading: false })
    // console.log("error", e);
   });

}

ShareMessage = () => {

  go=1
  this.setState({
   paysomeone:1,
 },()=> {
          //console.log("request payment ")
    Share.share({
      message: "https://koopa.page.link/coupon",
    })
    .then((responseJson) => {
    //  console.log("responseJson " +JSON.stringify(responseJson) )

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

onSwipeDown(gestureName, gestureState) {
  const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
 // console.log("swipeeeee" + gestureName + " gestureState " + JSON.stringify(gestureState) + "  SWIPE_DOWN " + SWIPE_DOWN )

  _this.getuserid()

}

navigate =async()=> {

  set(1 , 'pay').then(res=>{

  pay=1
  this.props.navigation.navigate('ScanQr',{"userid":this.state.merchantid,"userType":"creator","balance":this.state.EWbalance})
   
}).catch(e=>{

});

}

navigateMerchantCashout =async()=>{
  set(1 , 'pay').then(res=>{

  pay=1
  this.props.navigation.navigate('ScanQr',{"userid":this.state.merchantid,"userType":"merchant","cashout":true,"balance":this.state.EWbalance})

}).catch(e=>{

});

}

navigateMerchant =async()=>{
  set(1 , 'pay').then(res=>{

  pay=1
  this.props.navigation.navigate('ScanQr',{"userid":this.state.merchantid,"userType":"merchant","balance":this.state.EWbalance})

}).catch(e=>{

});

}
render()
    {
      const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
      };

      let array = this.state.requestcount;
     array = array.length;


    return (
      <GestureRecognizer
      onSwipe={this.onSwipe}
      onSwipeUp={this.onSwipeUp}
      onSwipeDown={this.onSwipeDown}
      onSwipeLeft={this.onSwipeLeft}
      onSwipeRight={this.onSwipeRight}
        config={config}
        style={{flex:1}}
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
            onDidFocus={payload => this.getUserdetails()
            }            
            onWillBlur={payload => this.stoprefresh()}


          />

        {/* <CustomHeader /> */}

        <TouchableOpacity 
        style={{alignSelf:"flex-end",
        marginTop: Platform.OS === 'ios' ? '10%' : StatusBar.currentHeight,
        marginRight: 15
       }}
        onPress={()=> this.props.navigation.toggleDrawer()}
          // onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}
           >
              <Image
              source={require('../../../assets/settings.png')}
            />
        </TouchableOpacity>


   {this.state.EWFLAG==false?
   <View>
     {this.state.initialRender?
     null:
     <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
               <Text style={{fontSize :30, fontWeight: 'bold', color: 'white'}}>No Event Joined</Text>

               <TouchableOpacity
            style={{
              backgroundColor: '#FFFFFF',
              width : wp('55%'),
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
            
     }
   </View>
   :
    <View>
       {this.state.creatorid == this.state.merchantid ?
        <View style ={styles.linearGradient}>

  
<View style={{ flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <Text style={{ 
          fontSize :RFValue(25), 
          width: Dimensions.get('window').width,
          textAlign: 'center',
          alignSelf: 'center',
          color: 'white',
          fontFamily: 'PoppinsMedium'
        }}>{this.state.EWname}</Text>
          <Text style={{ 
          marginTop:-9,
          fontSize :RFValue(15), 
          width: Dimensions.get('window').width,
          textAlign: 'center',
          alignSelf: 'center',
          color: 'white',
          fontFamily: 'PoppinsMedium'
          }}>Created by: {this.state.creatorname}</Text>

            <View
            style={{
              backgroundColor: '#fff',
              width :140,
              padding:2,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius:13,
              borderColor: '#B3B3B3',
              borderWidth: 2
              }}
            //onPress={() => this.props.navigation.navigate('ScanQr')}
            >
            <Text style={{
              width: '100%',
              textAlign: 'center',
              alignSelf: 'center',
              fontSize :RFValue(15), paddingTop:5,
              fontFamily:'PoppinsMedium', 
              color: '#810B0B'}}>$ {this.state.EWbalance}</Text>

          </View> 

          </View>


          {/* <Image style={{width :320 ,height:100,marginTop:30}} 
          source={require('../../../assets/koopa.png')} />   */}

         <View style={{
           flexDirection:'column', 
           justifyContent:'center', 
           margin: 8,
           alignItems: 'center'}}> 
         <Text style={{
          fontSize :RFValue(16), 
          color: '#ADB0B3',
          fontFamily: 'PoppinsMedium'
          }}>To get paid show the QR code below</Text>
          <Text style={{
            fontFamily: 'PoppinsMedium', 
            color: 'white',
            fontSize :16,
            }}>OR</Text>

        <View style={{alignItems:'center',flexDirection:'row', marginTop: 0}}>
          
          <TouchableOpacity 
            onPress={()=> this.ShareMessage()}
            >
            <Text style={{
              fontFamily: 'PoppinsMedium', 
              color: 'white',
              fontSize :RFValue(16)
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
          size = {hp('25%')} 
          content={this.state.EWid+ " " +this.state.merchantid + " "+ "creator"}
          color='black'
           />
           </View>
          </View>

            <TouchableOpacity
            style={{
              marginBottom: 30,
              backgroundColor: 'white',
              width :160,
              height: 50,
              padding:0,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius:10,
              borderColor: 'gray',
              borderWidth: 2,
              marginTop:10
              }}
          onPress={() =>
            this.navigate()}
          // onPress={() => this.props.navigation.navigate('PendingRequests')}
            >
            <Text style={{fontSize :RFValue(15), fontWeight: 'bold', color: '#0B8FDB'}}>Pay Someone</Text>

          </TouchableOpacity>
        
        <TouchableOpacity          
            onPress={() => this.props.navigation.navigate('PendingRequests',{ewid:this.state.EWid,merchantid:this.state.merchantid})}
            style={{position:'absolute',alignSelf:'flex-end',bottom:hp('8%'),margin:15}}>

            <IconBadge
              MainElement={
                <Image
                  style={{ alignSelf:'flex-end', justifyContent:'center', alignItems:'center', marginRight:8}}
                  source={require('../../../assets/bell.png')} 
                />
              }
              BadgeElement={ 
              <Text style={{color:'#FFFFFF'}}>{array}</Text>
              }
              IconBadgeStyle={
                {width:20,
                height:20,
                marginTop:-6,
                backgroundColor: '#ff0000'}
              }
              Hidden={array==0 || array == undefined}

            />

        </TouchableOpacity>

</View>
:
<View style={styles.linearGradient}>
          
          <View style={{ flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
          <Text style={{ 
            fontSize :RFValue(25), 
            width: Dimensions.get('window').width,
            color: 'white',
            textAlign: 'center',
            alignSelf: 'center',
            fontFamily: 'PoppinsMedium'
            }}>{this.state.EWname}</Text>
   
              <View
              style={{
                backgroundColor: '#fff',
                width :140,
                padding:2,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius:13,
                borderColor: '#B3B3B3',
                borderWidth: 2
                }}
              >
              <Text style={{
                              width: '100%',
                              textAlign: 'center',
                              alignSelf: 'center',
                              fontSize :RFValue(15), paddingTop:5,
                              fontFamily:'PoppinsMedium', 
                color: '#810B0B'}}>${this.state.EWbalance}</Text>
  
            </View> 
  
            </View>
  
  
            {/* <Image style={{width :320 ,height:100,marginTop:30}} 
            source={require('../../../assets/koopa.png')} />   */}
  
  <View style={{
             flexDirection:'column', 
             justifyContent:'center', 
             margin: 8,
             alignItems: 'center'}}> 
           <Text style={{
            fontSize :RFValue(16), 
            color: '#ADB0B3',
            fontFamily: 'PoppinsMedium'
            }}>To get paid show the QR code below</Text>
            <Text style={{
              fontFamily: 'PoppinsMedium', 
              color: 'white',
              fontSize :16,
              }}>OR</Text>
  
          <View style={{alignItems:'center',flexDirection:'row', marginTop: 0}}>
            
            <TouchableOpacity 
              onPress={()=> this.ShareMessage()}
              >
              <Text style={{
                fontFamily: 'PoppinsMedium', 
                color: 'white',
                fontSize :RFValue(15)
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
                size = {hp('25%')}
                content={this.state.EWid+ " " + this.state.merchantid + " "+ "merchant"}
                color='black'
                />
             </View>
             </View>
  
  
              <View style={{flexDirection: 'column', marginBottom: 10}}>
              
              <TouchableOpacity
              style={{
                marginBottom: 5,
                backgroundColor: 'white',
                width :160,
                height: hp('7%'),
                padding:0,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius:10,
                borderColor: 'gray',
                borderWidth: 2,
                marginTop:10
                }}
                onPress={() =>
                  this.navigateMerchantCashout()
                  }
               // onPress={() => this.props.navigation.navigate('NewEventWallet',{"merchantid":this.state.merchantid} )}
                >
              <Text style={{fontSize :RFValue(15), fontWeight: 'bold', color: '#0B8FDB'}}>Cash Out</Text>
  
            </TouchableOpacity>
  
            <TouchableOpacity
              style={{
                marginBottom: 5,
                backgroundColor: 'white',
                width :160,
                height: hp('7%'),
                padding:0,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius:10,
                borderColor: 'gray',
                borderWidth: 2
                }}
              onPress={() => 
                this.navigateMerchant()
                }
              >
              <Text style={{fontSize :RFValue(15), fontWeight: 'bold', color: '#0B8FDB'}}>Pay Someone</Text>
  
            </TouchableOpacity>
  
            <TouchableOpacity
              style={{
                backgroundColor: 'white',
                width :160,
                height: hp('7%'),
                padding:0,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius:10,
                borderColor: 'gray',
                borderWidth: 2
                }}
                //onPress={() => this.props.navigation.navigate('NewEW',{"merchantid":this.state.merchantid} )}   
                onPress ={()=> this.props.navigation.navigate('MerchantAllEW')}
                         >
              <Text style={{fontSize :RFValue(15), fontWeight: 'bold', color: '#0B8FDB'}}>New EW</Text>
  
            </TouchableOpacity>
  
            </View>
          
            {/* <View style={{ alignSelf:'flex-end', justifyContent:'center', alignItems:'center', marginRight:30}}>
            <Image style={{ position:'absolute', bottom:20 }} 
            source={require('../../../assets/bell.png')} />
            </View> */}
            </View>
            
            
            }
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

  export default withNavigation(MerchantHome);
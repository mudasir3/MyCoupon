import React, { Component } from 'react';
import { StyleSheet, View,Image, StatusBar, Platform,
  TouchableOpacity,Text, ActivityIndicator,Linking,Alert,Share, Dimensions} from 'react-native';
import { Icon  } from "native-base"; 
import CustomHeader from '../../CustomHeader';
import LinearGradient from 'react-native-linear-gradient';

//import QRCode from 'react-native-qrcode';
import { QRCode } from 'react-native-custom-qr-codes-expo';
//import QRCode from 'react-native-qrcode-generator';
import {MerchantDetails,MerchantJoinRequests,checkDevice,signOut} from "../API/ApiActions";
import {get,set} from "../LocalStorage";

import Spinner from 'react-native-loading-spinner-overlay';
import IconBadge from 'react-native-icon-badge';

import { withNavigation } from 'react-navigation';
import {NavigationActions} from 'react-navigation';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import DeviceInfo from 'react-native-device-info';

var _this;

class CreatorHome extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false,
      EWFLAG : true,
      EWname:'',
      EWbalance :0,
      EWid : 0,
      userid : 0,
      EWCreatedBy:'',
      requestcount :[],
      count:0,
      creatorname:'',
      loading: true,
      defaultText:'Please give me some tokens'
    };
  }

static navigationOptions = { header: null };

toggledrawer(){
  console.log("toggle drawer")
}

componentDidMount() {
   
  _this =this;


  const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
       this.getuserid()
    });


    
}

componentWillUnmount() {
  this.focusListener.remove();
}


getRequestCount =(user,eweventid)=>{

  console.log("user " + user)

  
  var id = JSON.parse(user) 
  var event_wallet_id =eweventid

  const params = {id,event_wallet_id};

  console.log("params " + JSON.stringify(params) )

  MerchantJoinRequests(params)
  .then(res => {
   console.log("all requestssss " + JSON.stringify(res) )

   let array = res.data.data
   //    this.arrayholder = res.data.data;
   this.setState({
       requestcount: array
   })   
  })
  .catch(e => { 
    console.log("error retreiving request count", e);
  });
}



getuserid = async() =>
{
  let ewcreatorid =await get("NEWEWcreatorid")
  let ewname =await get("NEWEWname")
  let eweventid =await get("NEWEWeventid")
  let user =await get("Merchant_id")

  let useriddd =await get("USER_ID")

  console.log("ewcreatorid " + ewcreatorid + " ewname " + ewname + " eweventid " + eweventid );

  this.setState({
    userid : ewcreatorid,
    EWCreatedBy:ewcreatorid,
    EWname:ewname,
    EWid : eweventid
  })
  this.getRequestCount(ewcreatorid,eweventid)
  this.getUserdetails(ewcreatorid)
  this.checkdevice(useriddd)

}
checkdevice=(user)=>{
  var user_id =user
  var device_id = DeviceInfo.getUniqueId();
  const params = {user_id,device_id} ;

  checkDevice(params)
   .then(res => {
    //alert(res.)
    console.log("ressss " + JSON.stringify(res))

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
 
     console.log("params signout" +JSON.stringify(params) + " user " + user)
 
     signOut(params)
      .then(res => {
       console.log("res " + JSON.stringify(res.data))
       this.setState({loading: false}) 
       alert(res.data.message)

       this.props.navigation.navigate('Register')
      })
      .catch(e => { 
        console.log("error", e);
      });
    }
      
   })
   .catch(e => { 
     console.log("error", e);
   });
   
}


getUserdetails=(user)=>{

  this.setState({ loading: true })

  var id = this.state.merchantid

  //const params = id;

  MerchantDetails(JSON.parse(user))
   .then(res => {
      this.setState({ loading: false })
    console.log("creator detaillss res " + JSON.stringify(res))

    if(res.data.data.eventWalletmerchant!=null)
    {
      this.setState({
        EWbalance :res.data.data.eventWalletmerchant.balance,
        creatorname :res.data.data.user_details.merchant_name,
        EWFLAG: true,

       })
    }
    else
    {
      this.setState({
        EWFLAG: false,
       })
    }


   })
   .catch(e => { 
     this.setState({ loading: false,
      EWFLAG: false,
    })
     console.log("error retrieving ew", e);
   });

}

ShareMessage = () => {

  console.log("request payment ")
  Share.share({
    message: "https://play.google.com/store/apps/details?id=com.coupon",
  })
    .then(result => console.log("then "+result))
    .catch(errorMsg => console.log("catch " + errorMsg));
};

onSwipe(gestureName, gestureState) {
  // const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
  // console.log("swipeeeee" + gestureName + " gestureState " + JSON.stringify(gestureState) + "  SWIPE_DOWN " + SWIPE_DOWN )

  // _this.getuserid()

}

onSwipeDown(gestureName, gestureState) {
  const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
  console.log("swipeeeee" + gestureName + " gestureState " + JSON.stringify(gestureState) + "  SWIPE_DOWN " + SWIPE_DOWN )

  _this.getuserid()

}

navigateToScreen = (route) => {
  console.log("naviagate ")
  const navigateAction = NavigationActions.navigate({
    routeName: route
  });
  this.props.navigation.dispatch(navigateAction);
}

render()
    {
      const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
      };


      let array = this.state.requestcount;
     array = array.length;

      console.log("count "+array)

    return (
      <GestureRecognizer
      onSwipe={this.onSwipe}
      onSwipeUp={this.onSwipeUp}
      onSwipeDown={this.onSwipeDown}
      onSwipeLeft={this.onSwipeLeft}
      onSwipeRight={this.onSwipeRight}
      config={config}
      style={{flex:1,justifyContent:'flex-start',alignItems:'center'}}
      >

      <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}>
        <Spinner
          visible={this.state.loading}
        />
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

        {/* <TouchableOpacity
         onPress={() => this.toggledrawer()}>

         <Image
          style={{width :50 ,height:50,marginTop:30}} 
          source={require('../../../assets/koopa.png')} />
          </TouchableOpacity> */}

{this.state.EWFLAG?
<View style ={styles.linearGradient}>

  
<View style={{ flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <Text style={{ 
          fontSize :30, 
          width: Dimensions.get('window').width,
          textAlign: 'center',
          alignSelf: 'center',
          color: 'white',
          fontFamily: 'PoppinsMedium'
        }}>{this.state.EWname}</Text>
          <Text style={{ 
          marginTop:-9,
          fontSize :24, 
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
              fontSize :25, 
              fontFamily:'PoppinsMedium', 
              color: '#810B0B'}}>$ {this.state.EWbalance}</Text>

          </View> 

          </View>


          {/* <Image style={{width :320 ,height:100,marginTop:30}} 
          source={require('../../../assets/koopa.png')} />   */}

         <View style={{
           flexDirection:'column', 
           justifyContent:'center', 
           width: Dimensions.get('window').width,
           margin: 10,
           alignItems: 'center'}}> 
         <Text style={{
          fontSize :18, 
          width: '100%',
          textAlign: 'center',
          alignSelf: 'center',
          color: '#ADB0B3',
          fontFamily: 'PoppinsMedium'
          }}>To Get Paid, Show The QR Code</Text>

        <View style={{alignItems:'center',flexDirection:'row', marginTop: -10,
         justifyContent: 'center', alignSelf: 'center', width:Dimensions.get('window').width}}>
          <Text style={{
            fontFamily: 'PoppinsMedium', 
            color: 'white',
            textAlign: 'right',
            fontSize :20,
            marginTop:2,
            width: '35%',
            }}>Below Or,</Text>
          <TouchableOpacity
                        style={{
                          width: '65%',
                        }}
                        onPress={()=> this.ShareMessage()}
                        >
            <Text style={{
              fontFamily: 'PoppinsMedium', 
              color: 'white',
              fontSize :20,
              textAlign:'left',
              textDecorationLine: 'underline',
              }}> Request to be paid</Text>
          </TouchableOpacity>
        </View>
        </View>
          
          <View style={{
            backgroundColor: 'white', 
            borderColor:'#B3B3B3',
            borderWidth:5,
            borderRadius:20
            }}>
          <QRCode
          size = {180} 
          content={this.state.EWid+ " " +JSON.parse(this.state.userid) + " "+ "creator"}
          color='black'
           />
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
          onPress={() => this.props.navigation.navigate('ScanQr',{"userid":this.state.merchantid,"userType":"creator"})}
          // onPress={() => this.props.navigation.navigate('PendingRequests')}
            >
            <Text style={{fontSize :15, fontWeight: 'bold', color: '#0B8FDB'}}>Pay Someone</Text>

          </TouchableOpacity>
        
        <TouchableOpacity          
            onPress={() => this.props.navigation.navigate('PendingRequests')}
            style={{position:'absolute',alignSelf:'flex-end',bottom:10,margin:10}}>

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
     <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                {/* <Text style={{fontSize :30, fontWeight: 'bold', color: 'white'}}> No Event </Text> */}

               <TouchableOpacity
            style={{
              backgroundColor: '#FFFFFF',
              padding:5,
              marginTop:5,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius:7,
              borderColor: 'white',
              borderWidth: 2
              }}
            //onPress={() => this.props.navigation.navigate('MerchantAllEW')}
            onPress={()=> this.navigateToScreen('Login')}
            >
            <Text style={{fontSize :20, fontWeight: 'bold',color:"#098EE3"}}>Back to merchant</Text>

          </TouchableOpacity>

             </View>
          }
         

          {/* <TouchableOpacity
            onPress={() => this.props.navigation.navigate('PendingRequests')}
            style={{ alignSelf:'flex-end', justifyContent:'center', alignItems:'center', marginRight:30}}>
              <Image style={{marginBottom:10}}
              source={require('../../../assets/bell.png')} />
          </TouchableOpacity> */}

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



    export default withNavigation(CreatorHome);

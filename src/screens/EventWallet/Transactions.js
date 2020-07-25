import React, { Component } from 'react';
import { StyleSheet, View,Image,TouchableOpacity,Platform, StatusBar,
  Text, ActivityIndicator, FlatList,SectionList,AppState} from 'react-native';
import { Icon  } from "native-base"; 
import CustomHeader from '../../CustomHeader';
import LinearGradient from 'react-native-linear-gradient';

//import QRCode from 'react-native-qrcode';
import { QRCode } from 'react-native-custom-qr-codes-expo';

import  { GetTransaction,exportdata,checkDevice,signOut } from "../API/ApiActions";
import {get,set} from "../LocalStorage";
import { withNavigation } from 'react-navigation';
import NavigationService from '../NavigationService';
import { NavigationEvents } from 'react-navigation';

import * as Font from 'expo-font';

import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import Spinner from 'react-native-loading-spinner-overlay';

import * as Sharing from 'expo-sharing';
import DeviceInfo from 'react-native-device-info';

var transaction =0;


class Transaction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
    };
  }

  state= {
    USERID:'',
    isMerchant: false,
    event_id: '',
    data:[],
    datasend:[],
    datareceived:[],
    loading: false,


  }

  componentWillUnmount() {
    AppState.removeEventListener('change', newState => {
      console.log('component unmountt', newState );
    });
  }

    componentDidMount() {

      const { navigation } = this.props;
      this.focusListener = navigation.addListener('didFocus', () => {

        transaction=0;

        AppState.addEventListener('change', newState => {
          console.log('new state transaction', newState + "  transaction  " +  transaction);

          if(transaction==0)
          {  
            transaction=1;
       
            NavigationService.navigate('AuthLoading')
          }
        })

        Font.loadAsync({
          'PoppinsMedium': require('../../fonts/Poppins-Medium.ttf'),
        });
        this.setState({ fontLoaded: true });
        this.getuserid()
      });


  }

    getuserid = async() =>
    {
      let eventId =await get("event_id")
      let isMerchant =await get("is_merchant")
      let USERID = await get("USER_ID")

     // // console.logle.log("eventid "  + eventId + "  isMerchant " + isMerchant + "  USERID " + USERID)
      if(isMerchant == true)
      {

        let merchantId = await get("Merchant_id")

        //// console.logle.log("isMerchant truee " + "  merchantId " + merchantId )

        this.setState({
          isMerchant: isMerchant,
          event_id : eventId,
          USERID: merchantId,
        })
      }
      else
      {

        this.setState({
          isMerchant: isMerchant,
          event_id : eventId,
          USERID: USERID,
        })


      }

      this.checkdevice(USERID)


    }

    checkdevice=(user)=>{
      var user_id =user
      var device_id = DeviceInfo.getUniqueId();
      const params = {user_id,device_id} ;
  
      checkDevice(params)
       .then(res => {
        //alert(res.)
        //// console.logle.log("ressss " + JSON.stringify(res))
  
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
     
        // // console.logle.log("params signout" +JSON.stringify(params) + " user " + user)
     
         signOut(params)
          .then(res => {
           // console.logle.log("res " + JSON.stringify(res.data))
           //this.setState({loading: false}) 
           alert(res.data.message)
  
           this.props.navigation.navigate('Register')
          })
          .catch(e => { 
            // console.logle.log("error", e);
            this.getData();

          });
        }
        else
        {
          this.getData();

        }
          
       })
       .catch(e => { 
         // console.logle.log("error", e);
         this.getData();

       });
       
    }

    exportdata =()=>
    {
      transaction =1;

      console.log( "  this.state.datasend  " + this.state.datasend + "  this.state.datareceived " +  this.state.datareceived)
      if(this.state.datasend =='' && this.state.datareceived =='')
      {
        // console.logle.log(" datasend " + this.state.datasend + "  datareceived " + this.state.datareceived)
        alert("Transaction history is empty")
        transaction =0;

      }
      else if(this.state.datasend ==undefined && this.state.datareceived ==undefined)
      {
        // console.logle.log(" datasend " + this.state.datasend + "  datareceived " + this.state.datareceived)
        alert("Transaction history is empty")
        transaction =0;

      }
      else{
      
        this.setState({loading: true})

        // console.logle.log("exportdataaa " + " userid " + this.state.USERID + " ewid " +this.state.EWid) 
        var id = this.state.USERID
        var event_wallet_id = this.state.event_id
      
        const params = {id,event_wallet_id};
    
        exportdata(params)
        .then(res => {
          this.setState({ loading: false })
         // console.logle.log("merchant detaillss res"+JSON.stringify(res.data.split(/\s(.+)/)[1]))
         
         if(Platform.OS === 'ios'){
            this.share(res.data)
         }else{
          this.downloadFile(res.data)
         }
         
        })
        .catch(e => { 
          transaction =0;

          this.setState({ loading: false })
          // console.logle.log("error", e);
        });
  
        
      }
     
    }


    share(uri){ 
      // console.logle.log("URI:"+uri)
      FileSystem.downloadAsync(
      uri,
      FileSystem.documentDirectory  + 'Transaction.pdf'
    )
      .then(({ uri }) => { 
          // console.logle.log('Finished downloading to ', uri);
  
          Sharing.shareAsync(uri); 
          transaction =0;

      })
      .catch(error => {
        transaction =0;

        // console.logle.error(error); 
      });
  }

    downloadFile(uri){
      this.setState({loading: true})
      //const uri = "https://coupon.sr7.tech/storage/5e4cea346f0542318.pdf"
      //const uri = this.state.document
      //var str = this.state.filename;
      //var res = str.split('.')[1];
      let fileUri = FileSystem.documentDirectory + "Transaction.pdf";
      FileSystem.downloadAsync(uri, fileUri)
      .then(({ uri }) => {
          this.saveFile(uri);
        })
        .catch(error => {
          transaction =0;

          this.setState({loading: false})

          // console.logle.error(error);
        })
   }
  saveFile = async (fileUri) => {
    this.setState({loading: false})
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status === "granted") {
          const asset = await MediaLibrary.createAssetAsync(fileUri)
          await MediaLibrary.createAlbumAsync("Download", asset, false)
          alert(" Transaction File Has been downloaded in your device")
          transaction =0;
        }
      else
        {
          transaction =0;
        }
  }

   getData =async ()=> {
    
    let eventId =await get("event_id")
        this.setState({
          loading:true
        })
      var event_wallet_id = eventId
    var is_merchant = 0
    var id  = this.state.USERID
    
    const params = {event_wallet_id, is_merchant, id};

    // console.logle.log("getdataaaaa "+ JSON.stringify(params) )
    
    GetTransaction(params)
     .then(res => {
       // console.logle.log(JSON.stringify(res))
       
       if(res.data.data != null && res.data.data != undefined)
       {

        // console.logle.log(" ifff")

      this.setState({
        datasend: res.data.data.transaction_send,
        datareceived: res.data.data.transaction_received,
        loading:false

      }) 
       }
       else
       {
        // console.logle.log(" elseeee")
        this.setState({
          datasend: [],
          datareceived: [],
          loading:false
  
        }) 
       }
  
     })
     .catch(e => { 
      this.setState({
        loading:false
      })
       // console.logle.log("error", e);
     });

 }



static navigationOptions = { header: null };

toggledrawer(){
  // console.logle.log("toggle drawer")
 
}

stoprefresh=()=>{
  console.log("willl blurrrrrrrrrr")
  transaction=1;

  AppState.removeEventListener('change', newState => {
    console.log('component unmountt', newState );
  });
}


createEW = (postInfo, index) =>{
    // console.logle.log("this.state.data " + JSON.stringify(postInfo) )

    //let eventId = postInfo.id 'rgba(52, 52, 52, 0.3)'
    let amount = postInfo.tokens
    let balance = postInfo.totalbalance

    let merchant =postInfo.receiver_id
    let date = postInfo.created_at
    date=date.split(" ")

     return(

          <View style={{ 
             backgroundColor: 'rgba(52, 52, 52, 0.3)', flexDirection:'row', 
              width:'100%',
              alignSelf:'center',

             justifyContent:'center', alignItems:'center'}}>

             
           <Text style={{
              marginTop: 5,
              width: '27%',
              fontSize :12,
              textAlign: 'center',
              fontFamily:'PoppinsMedium', 
              color: 'white'}}>{date[0]}</Text>

              <Text style={{
              marginTop: 5,
              width: '40%',
              textAlign: 'left',
              fontSize :13,
              fontFamily:'PoppinsMedium', 
               color: 'white'}}>{postInfo.name!=undefined ? postInfo.name : merchant}</Text>

              <Text style={{
              marginTop: 5,  
              fontSize :13,
              width: '15%',
              textAlign: 'left',
              fontFamily:'PoppinsMedium', 
              color: 'white'}}>{amount}</Text>

              <Text style={{
              marginTop: 5,  
              fontSize :13,
              width: '15%',
              textAlign: 'left',
              fontFamily:'PoppinsMedium', 
              color: 'white'}}>{balance}</Text>

           </View> 


    )
  }




render()
    {
    //   if (!this.state.fontLoaded) {
    //   return (
    //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    //       <ActivityIndicator />
    //     </View>
    //   );
    // }
    return (
      <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}>
        {/* <CustomHeader /> */}

        <Spinner
          visible={this.state.loading}
          />

     <NavigationEvents
      onWillBlur={payload => this.stoprefresh() }
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
      
     

        <Text style={{ 
          fontSize :30, 
          color: 'white',
          fontFamily: 'PoppinsMedium'
          }}>Transaction History</Text>

           


          <View style={{ 
            height:'70%',
            flexDirection:'column',
           }}>
           <TouchableOpacity
            style={{alignSelf:'flex-end', marginRight: 10,marginBottom:8}}
            onPress={() => this.exportdata()}
            >
            <Text style={{
              fontSize :15,
              textDecorationLine: 'underline',
              marginRight: 15,
              fontFamily:'PoppinsMedium', 
              color: 'white'}}>Export Data</Text>

          </TouchableOpacity>

          <View style={{ 
             backgroundColor: 'rgba(8, 66, 99, 0.9)', flexDirection:'row', alignSelf:'center',  marginLeft:5,
             marginRight:5, width:'100%',
             paddingVertical:5,
             justifyContent:'center', alignItems:'center'}}>
           <Text style={{
              fontSize :12,
              width : "30%",
              textAlign:'center',
              paddinfLeft:10,
              fontFamily:'PoppinsMedium', 
              color: 'white'}}>        Date</Text>
              <Text style={{
              fontSize :12,
              width : "43%",
              textAlign:'left',
              fontFamily:'PoppinsMedium', 
              color: 'white'}}>             Name      </Text>
              <Text style={{
              fontSize :12,
              width : "20%",
              fontFamily:'PoppinsMedium', 
              textAlign:'center',
              color: 'white'}}>Amount</Text>
              <Text style={{
              width : "20%",
              fontSize :12,
              fontFamily:'PoppinsMedium', 
              textAlign:'left',
              color: 'white'}}>Balance</Text>
           </View>

           <FlatList
                 data ={
                   this.state.datasend != undefined && this.state.datareceived != undefined
                   ?
                   this.state.datasend.concat(this.state.datareceived)
                  :
                  this.state.datareceived
                  }
                //data={this.state.datareceived}
                renderItem={({ item, index }) => this.createEW(item, index)}
                keyExtractor={(item) => item.id}
            />

          </View>

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

  export default withNavigation(Transaction);

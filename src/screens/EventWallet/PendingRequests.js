import React, { Component } from 'react';
import { StyleSheet, View, Platform, StatusBar,
  Image,TouchableOpacity,Text, ActivityIndicator, FlatList} from 'react-native';
import { Icon  } from "native-base"; 
import CustomHeader from '../../CustomHeader';
import LinearGradient from 'react-native-linear-gradient';

//import QRCode from 'react-native-qrcode';
import { QRCode } from 'react-native-custom-qr-codes-expo';

import  { MerchantJoinRequests ,AcceptRequest,checkDevice,signOut} from "../API/ApiActions";
import {get,set} from "../LocalStorage";
import Spinner from 'react-native-loading-spinner-overlay';

import { withNavigation } from 'react-navigation';

import DeviceInfo from 'react-native-device-info';

 class PendingRequests extends Component {

  constructor(props) {
    super(props);
  }

  state= {
    USERID:'',
    isMerchant: false,
    event_id: '',
    data:[],
    loading: false,
  }

  componentDidMount() {
   
    const { navigation } = this.props;
      this.focusListener = navigation.addListener('didFocus', () => {
        
        //var ew = this.props.navigation.getParam('ewid','00')
        //var merchant = this.props.navigation.getParam('merchantid','00')

        this.setState({
          event_id :this.props.navigation.getParam('ewid','00'),
          USERID:this.props.navigation.getParam('merchantid','00'),
          loading: false,
        })

       
       // this.getAllJoinRequests(this.props.navigation.getParam('ewid','00'),this.props.navigation.getParam('merchantid','00'))
        //this.getAllJoinRequests()
      });
      console.log("ewwww " ,this.props.navigation.getParam('merchantid','00'))
      this.getuserid()
      
      
  }
  

   getuserid = async() =>
   {
     let merchant =await get("Merchant_id")
     let eweventid =await get("NEWEWeventid")
     let user =await get("USER_ID")

     console.log("user " + eweventid);
 
     this.setState({
       'test' : 'user'
     })
 
     this.checkdevice(user,merchant,eweventid)

   }
   
   checkdevice=(user,merchant,eweventid)=>{
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
         //this.setState({loading: false}) 
         alert(res.data.message)

         this.props.navigation.navigate('Register')
        })
        .catch(e => { 
          console.log("error", e);
          this.getAllJoinRequests(merchant,eweventid)

        });
      }
      else
      {
        this.getAllJoinRequests(merchant,eweventid)

      }
        
     })
     .catch(e => { 
       console.log("error", e);
       this.getAllJoinRequests(merchant,eweventid)

     });
     
  }

  getAllJoinRequests=(user,eweventid)=> {

    //var requests =[]

    this.setState({ loading: true });

    var id = user
    var event_wallet_id =eweventid

    //var id =this.state.USERID
    //var event_wallet_id =this.state.event_id

    const params = {id,event_wallet_id};

    console.log("params " + JSON.stringify(params) )

    MerchantJoinRequests(params)
     .then(res => {
      console.log("all requestssss " + JSON.stringify(res.data) )

         this.arrayholder = res.data.data;

         //requests = res.data.data

      this.setState({
          data: res.data.data,
          loading:false
      })  
      //this.removeloader()

      
     })
     .catch(e => { 
      this.setState({ loading: false });

       console.log("error", e);
     });

 }

 removeloader =()=>{
      this.setState({
        //loading:false
    })  
 }


 AcceptDeclineRequest =(event_wallet_id,merchant_id,creator_id,AcceptReject)=>{

  this.setState({ loading: true });

  var merchant_id = merchant_id
  var event_wallet_id = event_wallet_id
  var creator_id = creator_id

  var params;

  if(AcceptReject == 'Decline')
  {
    params = {merchant_id,event_wallet_id,creator_id,delete:1};
    console.log("decline " +JSON.stringify(params)  )
  }
  else
  {
    params = {merchant_id,event_wallet_id,creator_id};
    console.log("accept " + JSON.stringify(params)  )
  }

  console.log("accept Reject params " + JSON.stringify(params)  )

  AcceptRequest(params)
      .then(res => {
      console.log("all requestssss " + JSON.stringify(res.data.data) )

      // this.setState({
      // loading: false,
      //   data:[]
      // });

      this.getuserid()
      })
      .catch(e => { 
        this.setState({ loading: false });

        console.log("error", e);
      });
 }


static navigationOptions = { header: null };

toggledrawer(){
  console.log("toggle drawer")
 
}

createEW = (postInfo, index) =>{

    let merchant_id = postInfo.merchant_id
    let event_wallet_id = postInfo.event_wallet_id
    let creator_id = postInfo.creator_id
    let merchant_name = postInfo.merchant_name

     return(
      <View >
          <View style={{ 
             backgroundColor: 'rgba(52, 52, 52, 0.3)', flexDirection:'row', 
             paddingBottom:5,paddingTop:5,
              width:'108%',
            }}>

         <View style={{width:"50%"}}>

          <Text style={{
              marginTop: 5,
              fontSize :15,
              marginStart:10,
              fontFamily:'PoppinsMedium', 
              color: 'white'}}>{merchant_name}</Text>
         </View>


         <TouchableOpacity 
            onPress={()=> this.AcceptDeclineRequest(event_wallet_id,merchant_id,creator_id,"Accept")}
            style={{width:"20%",justifyContent:'center',alignItems:'center'}}>
            <Text
                style={{fontSize:15,color:"#ffffff",marginStart:5, borderRadius:5,backgroundColor:"#024C7B",paddingLeft:10,paddingRight:10}}>
                Accept
            </Text>                       
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={()=> this.AcceptDeclineRequest(event_wallet_id,merchant_id,creator_id,"Decline")}
            style={{width:"20%",justifyContent:'center',alignItems:'center'}}>
               <Text
                style={{fontSize:15,color:"#000000",marginStart:5, borderRadius:5,backgroundColor:"#00AEF0",paddingLeft:10,paddingRight:10}}>
                Reject
            </Text>                       
          </TouchableOpacity>
           

           </View> 
        
        </View>  
    )
  }


render()
    {

    return (
      
      <LinearGradient colors={['#0D0D0D', '#0D0D0D']} style={styles.linearGradient}>
        <Spinner
          visible={this.state.loading}
        />

        <TouchableOpacity 
        style={{alignSelf:"flex-start",
        marginTop: Platform.OS === 'ios' ? '10%' : StatusBar.currentHeight
        ,marginLeft:5}}
        onPress={()=>this.props.navigation.goBack(null)}
          // onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}
           >
              <Image
              style={{ marginRight: 10,width:30,height:30 }}
              source={require('../../../assets/close.png')}
            />
        </TouchableOpacity>
      
     

        <Text style={{ 
          fontSize :30, 
          color: 'white',
          fontFamily: 'PoppinsMedium'
          }}>Pending Requests</Text>

           
          <View style={{ 
            width:'100%',
            height:'70%',
            flexDirection:'column',
            borderWidth:1,
            borderBottomColor:"#ffffff"
           }}>
       

           <FlatList
                data={this.state.data}
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

  export default withNavigation(PendingRequests);

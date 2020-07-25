import React, { Component } from 'react';
import { StyleSheet, View,Image,TouchableOpacity,
  StatusBar, Platform,
  TextInput,Text,FlatList,AsyncStorage,Keyboard} from 'react-native';
import { Icon  } from "native-base"; 
import CustomHeader from '../../CustomHeader';
import {  Tab,Tabs } from 'native-base';
//import QRCode from 'react-native-qrcode';
import { QRCode } from 'react-native-custom-qr-codes-expo';
import { Button } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

import {getAllEWMerchant,JoinEWMerchant,MerchantDetails,checkDevice,signOut,MerchantAllJoinedEW,RequestToJoin,UseEWMerchant,getEWDetails} from "../API/ApiActions";
import {get,set} from "../LocalStorage";
import { withNavigation } from 'react-navigation';

import Spinner from 'react-native-loading-spinner-overlay';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { ConfirmDialog } from 'react-native-simple-dialogs';

var _this;
import DeviceInfo from 'react-native-device-info';

import { NavigationEvents } from 'react-navigation';

var creator;
//var temp =0
class AllEventWalletsScreen extends Component {

  constructor(props) {
    super(props)
    this.arrayholder = [];
    this.creatorname;

    _this =this;
  }

static navigationOptions = { header: null };

state= {
    EWToggle : "live",
    data:[],
    userid : 0,
    value:'',
    merchantid:'',
    creatorName:'',
    EWFLAG : false,
    EWname:'',
    EWbalance :0,
    EWid : 0,
    AllEW:[],
    loading: false,
    flatlistloading:false,
    flatlistarchivedloading:false,
    Archiveddata:[],
    newArray :[],
    //EWJoined:false
    keyboardheight:0,
    tempEW:0,
    nameDialog:false,


}

_keyboardDidShow(e) {

  _this.setState({
    keyboardheight:e.endCoordinates.height
  })
  console.log("keyboard height " + e.endCoordinates.height)

 // _this.visible(false)
}

_keyboardDidHide(e) {

_this.setState({
  keyboardheight:e.endCoordinates.height
})
console.log("keyboard height " + e.endCoordinates.height)

// _this.visible(true)
}

componentDidMount() {

  _this =this;

     // if (Platform.OS === "android") {
      this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this._keyboardDidShow );
      this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
   // }


   setInterval(()=>{
    this.refreshlist()
  },10000)

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
        this.getuserid()
      //  if(this.props.navigation.getParam('status') == 1)
      //  {
      //    this.props.navigation.goBack(null)
      //  }
    });
  }


  componentWillUnmount = () => {
    this.focusListener.remove();

    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }


getuserid = async() =>
{
  let user =await get("USER_ID")
  let merchantId = await get("Merchant_id")

  console.log("user " + user);

  this.setState({
    userid : user,
    merchantid:merchantId
  })



  this.checkdevice(user,merchantId)


}

getUserdetails=(merchantId)=>{
    //this.setState({ loading: true })
    var id = this.state.merchantid 
    const params = id;
    MerchantDetails(merchantId)
     .then(res => {
      console.log("merchant detaillss res " + JSON.stringify(res))
      //this.setState({ loading: false })
      if((res.data.data.eventWalletmerchant == null))
      {
        this.setState({
          EWFLAG: false
        })
      }
      else
      {
        this.setState({
          EWFLAG: true,
          EWname: res.data.data.eventWalletDetails.name,
          EWbalance :res.data.data.eventWalletmerchant.balance,
          EWid : res.data.data.eventWalletmerchant.event_wallet_id
        })
      }
     })
     .catch(e => { 
       //this.setState({ loading: false })
       console.log("error getting user details", e);
     });
  }

  refreshdetails=()=>{
    this.setState({ flatlistloading: true })
    var id = this.state.merchantid 
    const params = id;
    MerchantDetails(id)
     .then(res => {
      console.log("merchant detaillss res " + JSON.stringify(res))
      if((res.data.data.eventWalletmerchant == null))
      {
        this.setState({
          EWFLAG: false,
          flatlistloading: false
        })
      }
      else
      {
        this.setState({
          EWFLAG: true,
          EWname: res.data.data.eventWalletDetails.name,
          EWbalance :res.data.data.eventWalletmerchant.balance,
          EWid : res.data.data.eventWalletmerchant.event_wallet_id,
          flatlistloading: false

        })
      }
     })
     .catch(e => { 
       this.setState({   flatlistloading: false
       })
       console.log("error getting user details", e);
     });
  }

  // getAllJoinedEvents=(merchantId)=>{
  //   //this.setState({ loading: true })
  //   MerchantAllJoinedEW(merchantId)
  //    .then(res => {
  //    // this.setState({ loading: false })
  //     console.log("merchant events res " + JSON.stringify(res.data.data))
  
  //     this.setState({
  //         AllEW: res.data.data
  //     })
  //    })
  //    .catch(e => {
  //    //  this.setState({ loading: false }) 
  //      console.log("error", e);
  //    });
  // }

  checkdevice=(user,merchantId)=>{
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
           this.getUserdetails(merchantId)
           this.getData(merchantId)
           this.getArchived(merchantId)
        });
      }
      else
      {
        this.getUserdetails(merchantId)
        this.getData(merchantId)
        this.getArchived(merchantId)
      }
        
     })
     .catch(e => { 
       console.log("error", e);
       this.getUserdetails(merchantId)
       this.getData(merchantId)
       this.getArchived(merchantId)
     });
     
  }

 getData =(merchantid)=> {
     this.setState({ loading: true })
    //console.log("getdataaaaa " + merchantid)

    let newArray = [];
    let Merchantevents = [];
    let SimpleEvents = [];

    getAllEWMerchant(merchantid)
     .then(res => {
        console.log("dataaaaa " +JSON.stringify(res) )
         this.arrayholder = res.data.data;

     this.arrayholder.forEach(element => {
       if(element.merchant_archive_status == 1 )
       {
         
       }
       else
       {
         newArray.push(element);
        
       }

     })
        
          newArray.forEach(element1 => {
      if(element1.creator_id == this.state.merchantid )
      {
        Merchantevents.push(element1)
      }
      else
      {
      
       SimpleEvents.push(element1)
      }
    })
     newArray = Merchantevents.concat(SimpleEvents)

        this.setState({
          data: newArray,
          loading: false
            //data: res.data.data
        }) 

     })
     .catch(e => { 
         this.setState({ loading: false })
       console.log("error retrieving data", e);
     });




   }

   refreshlist =()=> {

   let newArray = [];
   let Merchantevents = [];
   let SimpleEvents = [];

   getAllEWMerchant(this.state.merchantid)
    .then(res => {
      // console.log("dataaaaa " +JSON.stringify(res) )
        this.arrayholder = res.data.data;

    this.arrayholder.forEach(element => {
      if(element.merchant_archive_status == 1 )
      {
        
      }
      else
      {
        newArray.push(element);
       
      }

    })
       
         newArray.forEach(element1 => {
     if(element1.creator_id == this.state.merchantid )
     {
       Merchantevents.push(element1)
     }
     else
     {
     
      SimpleEvents.push(element1)
     }
   })
    newArray = Merchantevents.concat(SimpleEvents)

       this.setState({
         data: newArray,
           //data: res.data.data
       }) 
    })
    .catch(e => { 
      console.log("error retrieving data", e);
    });
  }

toggledrawer(){
  console.log("toggle drawer")
}

useEW = (eventId) => {
    this.setState({ loading: true })
    var merchant_id = this.state.merchantid
    var event_wallet_id = eventId
    //var creator_id = creatorid

    const params = {merchant_id,event_wallet_id};

    console.log("params " +JSON.stringify( params))

    UseEWMerchant(params)
     .then(res => {
     this.setState({ loading: false }); 
      console.log("res " + JSON.stringify(res.data))

      
     // this.props.navigation.navigate('MerchantHome')
      if(res.data.status === "success")
      {
        alert(res.data.message)
        this.props.navigation.navigate('MerchantHome')
      }
       else{
      }   

     })
     .catch(e => { 
       this.setState({ loading: false })
       console.log("error", e);
     });
}

joinEvent = (eventId,creatorid) => {
    this.setState({ loading: true })
    var merchant_id = this.state.merchantid
    var event_wallet_id = eventId
    var creator_id = creatorid

    const params = {merchant_id,event_wallet_id,creator_id};

    console.log("join event paramsss " +JSON.stringify( params))

    JoinEWMerchant(params)
     .then(res => {
      this.setState({ loading: false }); 
      console.log("res " + JSON.stringify(res.data))

      if(res.data.status === "success")
      {
        alert(res.data.message)
        this.getuserid()
        //this.props.navigation.navigate('MerchantHome')
      }
      else{
        if(res.data!= undefined)
        {
         alert(res.data)
         console.log("elseeee " + JSON.stringify(res.data))
        }

     }  
     })
     .catch(e => { 
       this.setState({ loading: false })
       console.log("error", e);
     });
}

openCreatorHome =(eventId,ewCreator,eventName)=>{
  set(ewCreator,"NEWEWcreatorid")
  set(eventName,"NEWEWname")
  set(eventId,"NEWEWeventid")

  set(2,"first_login")
  this.props.navigation.navigate('Creator')
}

_UnarchivEvent = async (evId,userid) => {
  this.setState({ loading: true })
  console.log("api called: ")
  const merchantid = await AsyncStorage.getItem('Merchant_id');
  const url = `https://koopa.sr7.tech/api/eventwalletmerchant/unarchive_event_wallet`;
  let eventId = evId;

  console.log("params  userID " + merchantid + " eventId " + eventId);

  fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      merchant_id: merchantid,
      event_wallet_id: eventId,
      //unarchive: 1
    }),
  })
    .then(res => res.json())
    .then(res => {
      this.setState({ loading: false })
      console.log("response unarchiveee  " +JSON.stringify(res) )

      if(res.message == undefined)
      {
        alert(res.error.message)
        this.props.navigation.goBack(null)
      }
      else
      {
        alert(res.message)
        this.props.navigation.goBack(null)
      }

    })
    .catch(error => {

      console.log("error unarchiveee  " +JSON.stringify(error) )

      this.setState({ loading: false })
      this.setState({ error });
    });
};

_archivEvent = async (evId) => {
  this.setState({ loading: true })
  const userID = await AsyncStorage.getItem('USER_ID');
  const url = `https://koopa.sr7.tech/api/eventwalletmerchant/archive_delete`;
  let eventId = evId;

  console.log(eventId);
  console.log(userID);
  fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      merchant_id: this.state.merchantid,
      event_wallet_id: eventId,
      archive : 1,
    }),
  })
    .then(res => res.json())
    .then(res => {
      this.setState({ loading: false })
      alert(res.message);
      this.props.navigation.goBack(null)
    //  this.props.navigation.navigate('TennantOverview');
    })
    .catch(error => {
      this.setState({ loading: false })
      this.setState({ error });
    });
};

getArchived = async (merchantId) => {
  this.setState({ loading: true })
  const id = merchantId
  const url = `https://koopa.sr7.tech/api/eventwalletmerchant/get_all_archived_events/`;
  
  console.log("get archiveddd " + url + id)
  fetch(url+id, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
        'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(res => {
      this.setState({
        Archiveddata: res.data,
        loading: false
      });
      console.log("archivedddddddddddddddddddd " + JSON.stringify(res.data))

      this.getEWDetails()
    })
    .catch(error => {
      this.setState({ loading: false })
      //alert(error)
    });
};

delete = async () => {
  this.setState({ loading: true,nameDialog:false })

  const url = `https://koopa.sr7.tech/api/eventwalletmerchant/archive_delete`;
  let eventId = this.state.tempEW;

  fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      merchant_id: this.state.merchantid,
      event_wallet_id: eventId,
      delete: 1,
    }),
  })
    .then(res => res.json())
    .then(res => {
      this.setState({ loading: false })

      alert(res.message);
      this.props.navigation.goBack(null)
    //  this.props.navigation.navigate('TennantOverview');
    })
    .catch(error => {
      this.setState({ loading: false })
      this.setState({ error });
    });
};


deleteEvent = (evId) => {
  this.setState({ tempEW:evId, nameDialog:true
  })

};

getEWDetails =()=> {
  
  var tempArray=[]
  var newArray =[]
  this.state.Archiveddata.map((item)=>{

   getEWDetails(item.event_wallet_id)
    .then(res => {
       console.log("res archivedddd ew details  " +JSON.stringify(res.data.data.Event_wallet_merchant[0].merchant_name) )

      tempArray = { ...item, merchant_name: res.data.data.Event_wallet_merchant[0].merchant_name}
      newArray.push(tempArray)
    })
    .catch(e => { 
     console.log("error", e);
    });
  })

  this.setState({
    Archiveddata:newArray
  })
}


RenderArchived = (postInfo, index) =>{
  console.log("renderarchived " +JSON.stringify(postInfo) )
  
  let eventId = postInfo.event_wallet_id
  let eventName = postInfo.event_name
  let ewCreator =postInfo.creator_id
  let ewStatus = postInfo.ew_status
  let archivestatus = postInfo.archive_status
  let balance = postInfo.balance
  let request =postInfo.request
  let merchant_status =postInfo.merchant_status
  let creator_name =postInfo.merchant_name

  var EWrequest;
  var EWJoined ;
  var EWbalance;

       if(postInfo.joined != undefined)
      {
          EWJoined = true
          EWbalance = balance
      }
      else
      {
         EWJoined = false
         EWbalance=0
      }
 
      if(request != undefined)
      {
        EWrequest= request
      }

  return(
      <View >
    <TouchableOpacity 
             onPress={()=> this.props.navigation.navigate('MerchantEWDetail',{"EWid":eventId,"creator_name":creator_name,"ewCreator":ewCreator,"EWJoined":EWJoined,"ewStatus":ewStatus,"EWbalance":EWbalance,"archivestatus":archivestatus,"EWrequest":EWrequest, "merchant_status":merchant_status,"unarchive":true})}
             //style={{flexDirection:'row',margin:10,height:70}}
             style={JSON.parse(this.state.merchantid)==ewCreator ? {flexDirection:'row',margin:10,height:80,borderWidth:1,borderColor:'red'} : {flexDirection:'row',margin:10,height:80}}
             >
            <View style={{flexDirection:'row',width:"100%",backgroundColor:"#054d77", justifyContent:"center",alignItems:"center"}}> 
            <View style={{marginStart:5,width:"30%"}}>
                    {/* <Text
                        style={{fontSize:16,color:"#ffffff"}}>
                        Event Name
                    </Text>  */}
                    <Text
                        style={{fontSize:14,color:"#ffffff"}}>
                        {eventName}
                    </Text>
                </View>

                <View style={{marginStart:5,width:"40%"}}>
                    <Text
                        style={{fontSize:16,color:"#ffffff"}}>
                        Creator
                    </Text> 

                    <Text
                        style={{fontSize:16,color:"#ffffff"}}>
                        {creator_name}
                    </Text>
                </View>

                <View >                         
                  <TouchableOpacity 
                  onPress={()=> this._UnarchivEvent(eventId,this.state.merchantid)}
                  style={{marginStart:10,marginBottom:5,backgroundColor:"#054d77"}}
                  >
                      <Text
                        style={{fontSize:13,color:"red",
                        backgroundColor:"#eeeeee",borderRadius:5,padding:5}}>
                          Unarchive
                      </Text>                       
                  </TouchableOpacity> 
                </View>              
                    
            </View>
        
        </TouchableOpacity>  
        </View>

    )
}

createEW = (postInfo, index) =>{
//  console.log("this.state.data Are You sure " + JSON.stringify(postInfo)  )

    let eventId = postInfo.id
    //console.log("ew idd "+ eventId )

    let eventName = postInfo.name
    let ewCreator =postInfo.creator_id
    let ewStatus = postInfo.ew_status
    let archivestatus = postInfo.archive_status
    let balance = postInfo.balance
    let request =postInfo.request
    let merchant_status =postInfo.merchant_status
    let creator_name =postInfo.merchant_name
    let requestcount=postInfo.count;

    var EWrequest;
    var EWJoined ;
    var EWbalance;

         if(postInfo.joined != undefined)
        {
            EWJoined = true
            EWbalance = balance
        }
        else
        {
           EWJoined = false
           EWbalance=0
        }
   
        if(request != undefined)
        {
          EWrequest= request
        }


    return(
        <View >
      <TouchableOpacity 
             onPress={()=> this.props.navigation.navigate('MerchantEWDetail',{"EWid":eventId,"creator_name":creator_name,"ewCreator":ewCreator,"EWJoined":EWJoined,"ewStatus":ewStatus,"EWbalance":EWbalance,"archivestatus":archivestatus,"EWrequest":EWrequest, "merchant_status":merchant_status})}
             //style={{flexDirection:'row',margin:10,height:70}}
             style={JSON.parse(this.state.merchantid)==ewCreator ? {margin:10,height:80,borderWidth:1,borderColor:'red',backgroundColor:"#054d77"} : {flexDirection:'row',margin:10,height:80,backgroundColor:"#054d77"}}

             >
              {this.state.merchantid==ewCreator ?
              <View style={{marginStart:5,width:15,height:15,borderRadius:30,backgroundColor:'red',
                  margin:3,alignContent:'center',justifyContent:'center',alignItems:'center'}}>

                      <Text
                          style={{fontSize:10,color:"#ffffff",textAlign:'center'}}>
                          {requestcount}
                      </Text>

                  </View>
              :
              null
              }

              <View style={{flexDirection:'row',width:"100%",backgroundColor:"#054d77", justifyContent:"center",alignItems:"center"}}> 
              <View style={{marginStart:5,width:"30%"}}>
                      {/* <Text
                          style={{fontSize:16,color:"#ffffff"}}>
                          Event Name
                      </Text>  */}
                      <Text
                          style={{fontSize:14,color:"#ffffff"}}>
                          {eventName}
                      </Text>

                      
                     {balance!=undefined? 
                      <Text

                          style={{fontSize:12,color:"#ffffff",marginTop:3}}>
                        ${balance}
                          
                      </Text>
                      :
                      null
                      }


                  </View>
  
                  <View style={{marginStart:5,width:"40%"}}>
                      <Text
                          style={{fontSize:16,color:"#ffffff"}}>
                          Creator
                      </Text> 
  
                      <Text
                          style={{fontSize:16,color:"#ffffff"}}>
                          {creator_name}
                      </Text>
                  </View>
  

                  <View > 
                  {EWrequest =="Pending" ?
                   <View>
                        <Text
                            style={{fontSize:13,color:"red",borderRadius:5,paddingLeft:5}}>
                            Pending
                        </Text>  
                     </View>
                     :
                     <View>
                          {!EWJoined && JSON.parse(this.state.merchantid)!=ewCreator ?                           
                              <TouchableOpacity 
                              onPress={()=> this.joinEvent(eventId,ewCreator)}
                              style={{backgroundColor:"#054d77"}}>
                                  <Text
                                    style={{fontSize:13,marginStart:10,color:"red",borderRadius:5,backgroundColor:"#eeeeee",paddingHorizontal:10,paddingVertical:5}}>
                                      Add
                                  </Text>                       
                              </TouchableOpacity>
                          :
                          <View>
                             {/* {EWJoined && EWrequest=="Accepted" ?
                             <View>
                                <TouchableOpacity 
                                  onPress={()=> this.useEW(eventId)}
                                  >
                                  <Text
                                      style={{fontSize:13,width:"80%",color:"#ffffff",borderRadius:5,paddingLeft:10}}>
                                      Use
                                  </Text>                       
                                </TouchableOpacity>
                               </View>
                               :
                               <View> */}
                               {
                                  EWrequest =="Accepted" && merchant_status==10  && archivestatus!=1?
                                 <View>

                                <TouchableOpacity
                                  style={{padding:10}}  
                                  onPress={()=> this.useEW(eventId)}
                                  >
                                  <Text
                                      style={{fontSize:13,color:"#ffffff",borderRadius:5}}>
                                      Use
                                  </Text>                       
                                </TouchableOpacity>
                                   </View>
                                   :
                                   <View>
                                                         
                                   { EWJoined && merchant_status==1 && EWbalance != 0 ?
                                <View> 
                                  {/* <TouchableOpacity 
                                      onPress={()=> this.props.navigation.goBack(null)}
                                      style={{backgroundColor:"#054d77"}}>
                                      <Text
                                          style={{fontSize:13,marginStart:10,width:"50%",color:"red",borderRadius:5,backgroundColor:"#eeeeee",paddingLeft:10}}>
                                          Use
                                      </Text>                       
                                  </TouchableOpacity> */}
  
                                  <TouchableOpacity 
                                      style={{padding:10}}  
                                      onPress={()=> 
                                        this._archivEvent(eventId)
                                    }
                                      >
                                      <Text
                                           style={{fontSize:13,color:"#ffffff",borderRadius:5}}>
                                          Archive
                                      </Text>                       
                                  </TouchableOpacity>
                                </View> 
                                :   
                                <View>
                                  { EWJoined &&EWbalance == 0 && merchant_status==1?
                                      <View>
                                        <TouchableOpacity 
                                          style={{padding:10}}  
                                           onPress={()=> 
                                          this.deleteEvent(eventId)
                                          }>
                                          <Text
                                              style={{fontSize:13,color:"#ffffff",borderRadius:5}}>
                                              Delete
                                          </Text>                       
                                        </TouchableOpacity>
                                      </View>
                                      :
                                      <View>
                                       {
                                         EWJoined && EWbalance != 0 && merchant_status==0?
                                         <View>
                                            <TouchableOpacity
                                                style={{marginBottom:5,justifyContent:'center',alignItems:'center'}}  
                                                onPress={()=> this.useEW(eventId)}
                                                >
                                                <Text
                                                    style={{fontSize:13,color:"#ffffff",borderRadius:5,padding:5}}>
                                                    Use
                                                </Text>                       
                                              </TouchableOpacity>

                                            <TouchableOpacity 
                                              style={{marginStart:10,marginBottom:5,backgroundColor:"#054d77"}}
                                              onPress={()=> 
                                                // this.props.navigation.goBack(null)
                                                this._archivEvent(eventId)
                                               }>
                                              <Text
                                                  style={{fontSize:13,color:"red",
                                                  backgroundColor:"#eeeeee",borderRadius:5,padding:5}}>
                                                  Archive
                                              </Text>                       
                                          </TouchableOpacity>

                                          </View>
                                           :
                                          <View>
                                            {
                                              EWJoined && EWbalance == 0 && merchant_status!=1?
                                              <View>
                                                  <TouchableOpacity 
                                                      style={{marginBottom:5,justifyContent:'center',alignItems:'center'}}
                                                      onPress={()=> this.useEW(eventId)}
                                                      >
                                                      <Text
                                                        style={{fontSize:13,color:"#ffffff",borderRadius:5,padding:5}}>
                                                          Use
                                                      </Text>                       
                                                    </TouchableOpacity>

                                                  <TouchableOpacity
                                                    style={{marginStart:10,marginBottom:5,backgroundColor:"#054d77"}} 
                                                    onPress={()=> 
                                                      // this.props.navigation.goBack(null)
                                                      this.deleteEvent(eventId)
                                                    }>
                                                    <Text
                                                         style={{fontSize:13,color:"red",
                                                         backgroundColor:"#eeeeee",borderRadius:5,padding:5}}>
                                                        Delete
                                                    </Text>                       
                                                </TouchableOpacity>
                                              </View>
                                              :
                                              <View>
                                                {
                                                  archivestatus==1?
                                                    <View>
                                                       <TouchableOpacity 
                                                          style={{marginStart:10,marginBottom:5,backgroundColor:"#054d77"}}
                                                          onPress={()=> 
                                                            this._UnarchivEvent(eventId,this.state.merchantid)
                                                            //this.archive(eventId)
                                                          }>
                                                          <Text
                                                            style={{fontSize:13,color:"red",
                                                            backgroundColor:"#eeeeee",borderRadius:5,padding:5}}>
                                                              Unarchive
                                                          </Text>                       
                                                      </TouchableOpacity>

                                                    </View>
                                                    :
                                                    <View>
                                                    </View>
                                                }
                                                
                                              </View>
                                            }
                                          </View>
                                       }
                                      </View>
                                  }
                                  </View>
                             }
                               {/* </View>
                          }  */}
                                     </View>
                               }

      
  
                          </View>
                          }

                       </View>
                      }
                  </View>
                      




              </View>
          
          </TouchableOpacity>  

        </View>
      )
  }

    
  toggleswitch =() =>{
      if(this.state.EWToggle == "live")
      {
          this.setState({
              EWToggle: "archive"
          })
      }
      else
      {
        this.setState({
            EWToggle: "live"
        })
      }
  }


    searchFilterFunction = text => {
    this.setState({
      value: text,
    });

    const newData = this.arrayholder.filter(item => {
      const name = `${item.name}`;
      const itemData = `${name.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
    });
  };


  onSwipe(gestureName, gestureState) {
    // const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    // console.log("swipeeeee" + gestureName + " gestureState " + JSON.stringify(gestureState) + "  SWIPE_DOWN " + SWIPE_DOWN )
  
    // _this.getuserid()
  
  }
  
  onSwipeDown(gestureName, gestureState) {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    console.log("swipeeeee" + gestureName + " gestureState " + JSON.stringify(gestureState) + "  SWIPE_DOWN " + SWIPE_DOWN )
  
    //_this.getuserid()
  _this.refreshdetails()
  }

  onSwipeDownArchived =()=>{
    console.log("swipeeeee" )
  }


  closeModal=()=>{
    this.setState({nameDialog: false})
  }

  stoprefresh=()=>{
    this.setState({EWToggle : "live"})
  }

render()
    {
     // console.log("dataaaaaaaaaaa" + JSON.stringify(this.state.data)  )


      const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
      };

      console.log("toggle " + this.state.EWToggle)
    return (
      <GestureRecognizer
      //onSwipe={this.onSwipe}
      //onSwipeUp={this.onSwipeUp}
      //onSwipeDown={this.onSwipeDown}
      //onSwipeLeft={this.onSwipeLeft}
      //onSwipeRight={this.onSwipeRight}
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
      onWillBlur={payload => this.stoprefresh() }
    />

        {/* <CustomHeader /> */}

            <ConfirmDialog
                title="Are you sure you want to delete this EW?"
                visible={this.state.nameDialog}
                onTouchOutside={() =>
                  this.closeModal()
                   //alert("Outside!")
                  }
                positiveButton={{
                    title: "OK",
                    onPress : ()=> this.delete()
                    //onPress: () => this.state.name!=''? this.changeName(): alert("Please enter your name")
                }}
                negativeButton={{
                  title: "Cancel",
                  onPress: () =>  this.closeModal()

                }}
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
        
        <View style={styles.container}> 

            <View style={{flexDirection:'row',margin:10,height:40}}>
                <View style={{width:"60%",backgroundColor:"#054d77", justifyContent:"center"}}> 
                    <TextInput 
                        onChangeText={text => this.searchFilterFunction(text)}
                        autoCorrect={false}
                        value={this.state.value}
                        style={{fontSize:13,marginStart:5,color:"#ffffff"}}
                        placeholder = "Search Events..."
                        placeholderTextColor ="#cccccc">
                    </TextInput>
                </View>

                <TouchableOpacity 
                    style={{marginStart:5,width:"40%",backgroundColor:"#054d77", justifyContent:"center",alignItems:"center"}}>
                        <Text
                            style={{fontSize:14,marginStart:5,color:"#ffffff"}}>
                            Search
                        </Text> 
                </TouchableOpacity>
            </View>
         

            {this.state.EWToggle=="live"?
                <View style={{flexDirection:'row',margin:10,height:30}}>
                <TouchableOpacity 
                            onPress ={()=> this.toggleswitch()}
                            style={{marginStart:5,width:"50%",backgroundColor:"#054d77", justifyContent:"center",alignItems:"center"}}>
                                <Text
                                    style={{fontSize:16,marginStart:5,color:"#ffffff"}}>
                                    Archive
                                </Text> 
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            onPress ={()=> this.toggleswitch()}
                            style={{width:"50%",backgroundColor:"#0c95cc",marginRight:5, justifyContent:"center",alignItems:"center"}}>
                                <Text
                                    style={{fontSize:16,marginStart:5,color:"#ffffff"}}>
                                    Live
                                </Text> 
                        </TouchableOpacity> 
                    </View>  
                    :

                    <View style={{flexDirection:'row',margin:10,height:30}}>
                    <TouchableOpacity 
                        onPress ={()=> this.toggleswitch()}
                        style={{marginStart:5,width:"50%",backgroundColor:"#0c95cc", justifyContent:"center",alignItems:"center"}}>
                            <Text
                                style={{fontSize:16,marginStart:5,color:"#ffffff"}}>
                                Archive
                            </Text> 
                        </TouchableOpacity>
                    
                    <TouchableOpacity
                        onPress ={()=> this.toggleswitch()}
                        style={{width:"50%",backgroundColor:"#054d77",marginRight:5, justifyContent:"center",alignItems:"center"}}>
                            <Text
                                style={{fontSize:16,marginStart:5,color:"#ffffff"}}>
                                Live
                            </Text> 
                        </TouchableOpacity>   
                    </View>    
            }


         {this.state.EWToggle=="live"?
            <FlatList
                //removeClippedSubviews={false}
                data={this.state.data}
                onRefresh={()=> this.onSwipeDown()}
                refreshing={this.state.flatlistloading}
                renderItem={({ item, index }) => 
                // {
                //     if(this.state.AllEW != undefined ){
                       this.createEW(item, index)

            }
                keyExtractor={(item) => item.id}
                />
                :

                <FlatList
                //removeClippedSubviews={false}
                data={this.state.Archiveddata}
                onRefresh={()=> this.onSwipeDownArchived()}
                refreshing={this.state.flatlistarchivedloading}
                renderItem={({ item, index }) =>
                        this.RenderArchived(item, index)
                }
                keyExtractor={(item) => item.id}
                />


          }

        <TouchableOpacity 
        style={{alignSelf:"flex-end",position:'absolute',bottom:10}}
        onPress={() => this.props.navigation.navigate('NewEW',{"merchantid":this.state.merchantid} )}
           >
              <Image
              style={{ marginRight: 10 }}
              source={require('../../../assets/Plus.png')}
            />
        </TouchableOpacity>
        
        </View>

        </LinearGradient>

      </GestureRecognizer>
     
      
    );
  }
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      //backgroundColor: '#ffffff',
      alignItems: 'center',
      //justifyContent: 'flex-start',
      marginTop:30,
    },
    linearGradient: {
      justifyContent:'space-between',
      alignItems: 'center',
      flex: 1,
      width: '100%',
      flexDirection: 'column'
    },
    innerContainer :{
        alignItems: 'center',
        //justifyContent: 'center',
      } ,
      qrContainer :{
        alignItems: 'center',
      },
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

  export default withNavigation(AllEventWalletsScreen);

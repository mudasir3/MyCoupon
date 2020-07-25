import React, { Component } from 'react';
import { StyleSheet, View,Image,TouchableOpacity, StatusBar, Platform,
  TextInput,Text,FlatList,AsyncStorage, Dimensions} from 'react-native';
import { Icon  } from "native-base"; 
import CustomHeader from '../../CustomHeader';
import {  Tab,Tabs } from 'native-base';
//import QRCode from 'react-native-qrcode';
import { QRCode } from 'react-native-custom-qr-codes-expo';
import { Button } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {getAllEWMerchant,JoinEWMerchant,MerchantDetails,checkDevice,signOut,MerchantAllJoinedEW,RequestToJoin,UseEWMerchant,getEWDetails,DeleteMerchant,AcceptRequest} from "../API/ApiActions";
import {get,set} from "../LocalStorage";
import Spinner from 'react-native-loading-spinner-overlay';

import { withNavigation } from 'react-navigation';
import { NavigationEvents } from 'react-navigation';
import { StackActions, NavigationActions } from 'react-navigation';
import { ConfirmDialog } from 'react-native-simple-dialogs';

import DeviceInfo from 'react-native-device-info';
import Logo from '../../../assets/backbtn.svg';

let chk = false

class MerchantEWDetailScreen extends Component {

  constructor(props) {
    super(props)
    this.arrayholder = [];
  }

static navigationOptions = { header: null };

state= {
    data:[],
    otherRequests:[],
    PendingRequests:[],
    EWname:'',
    EWStatus : '',
    EWContactNumber:'',
    EWcreatorId :'',
    EWJoined:'',
    ewStatus:'',
    EWbalance:'',
    archivestatus:'',
    EWrequest:'',
    EWid: '',
    merchantid:'',
    EWMerchantStatus :'',
    ewCreator:'',
    EWUnarchive:false,
    loading: false,
    EWcreator_name :'',
    tempEW:0,
    nameDialog:false,
    acceptRejectDialog:false,
    removeMerchantDialog:false,
    merchant_id:''

}

componentDidMount() {
   
  setInterval(()=>{
    this.refresh()
  },10000)

    const { navigation } = this.props;
      this.focusListener = navigation.addListener('didFocus', () => {

      //   if (!chk){
      //     console.log("ifff")
  
      //   chk = true // Change value when rendering screen
      // } else {
      //     console.log("elseee ")
  
      //   //The popToTop action takes you back to the first screen in the stack, dismissing all the others.
      //   this.props.navigation.dispatch(StackActions.popToTop()); 
      //   chk = false //Initialization
      // }


        this.getmerchantid()
        let eventId = this.props.navigation.getParam('EWid','00')
        let joined = this.props.navigation.getParam('EWJoined','00')
        let status = this.props.navigation.getParam('ewStatus','00')
        let balance = this.props.navigation.getParam('EWbalance','00')
        let archived = this.props.navigation.getParam('archivestatus','00')
        let request = this.props.navigation.getParam('EWrequest','00')
        let merchantstatus = this.props.navigation.getParam('merchant_status','00')
        let creator = this.props.navigation.getParam('ewCreator','00')
        let unarchive = this.props.navigation.getParam('unarchive',false)
        let creatorname = this.props.navigation.getParam('creator_name',false)

        console.log("unarchive " + this.props.navigation.getParam('archivestatus','00'))
        //console.log("eventId " + eventId +  " joined " +joined + " status " +status +" balance " + balance + " archived "+archived + " request "+ request + " merchantstatus " + merchantstatus)
    
        this.setState({
            EWJoined:joined,
            ewStatus:status,
            EWbalance:balance,
            archivestatus:archived,
            EWrequest:request,
            EWid : eventId,
            EWMerchantStatus : merchantstatus,
            ewCreator : creator,
            EWUnarchive :unarchive,
            EWcreator_name :creatorname

        })
    
    
        });

  }

  
  componentWillUnmount() {
    this.focusListener.remove();
  }

  getmerchantid = async() =>
{
  let merchantId = await get("Merchant_id")
  let user =await get("USER_ID")

  console.log("user " + merchantId);

  this.setState({
    merchantid:merchantId
  })

  this.checkdevice(user,merchantId)

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
       //this.setState({loading: false}) 
       alert(res.data.message)

       this.props.navigation.navigate('Register')
      })
      .catch(e => { 
        console.log("error", e);
        this.getEWDetails()  

      });
    }
    else
    {
      this.getEWDetails()  

    }
      
   })
   .catch(e => { 
     console.log("error", e);
     this.getEWDetails()  

   });
   
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
        //this.props.navigation.navigate('MerchantHome')
      }
       else{
      }   
     })
     .catch(e => { 
       this.setState({ loading: false })
       console.log("error", e);
     });
}
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
  
  
  delete= async () => {
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

  closeModal=()=>{
    this.setState({nameDialog: false})
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
      }),
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ loading: false })
        //alert(res.data.message)
        console.log("response " + res)
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

       // this.props.navigation.goBack(null)
      })
      .catch(error => {
        this.setState({ loading: false })
        this.setState({ error });
      });
  };

toggledrawer(){
  console.log("toggle drawer")

}

getEWDetails =()=> {
  this.setState({
    loading:true
  })
  var pending =[]
  var other =[]

    getEWDetails(this.state.EWid)
     .then(res => {
        console.log("res get ew details  " +JSON.stringify(res.data) )

        var status;
        if(this.state.archivestatus ==1)
        {
          status ="Archived"
        }
        else if(res.data.data.event_data[0].status ==1)
        {
          status ="Live"
        }
        else
        {
          status =""
        }

        // if(res.data.data.event_data[0].status ==1)
        // {
        //   status ="Live"
        // }
        // else{
        //   status ="Archive"
        // }
        
        this.arrayholder = res.data.data.pending_request
        other = res.data.data.Event_wallet_merchant

        this.arrayholder.forEach(val => {
          //var element = val.merchant_name+"pending"
          //console.log("elementttt " +element)
          pending.push(val)

        })
        
      this.setState({
          data: res.data.data.Event_wallet_merchant,
          PendingRequests:res.data.data.pending_request,
          EWname:res.data.data.event_data[0].event_name,
          EWStatus : status,
          EWContactNumber:res.data.data.event_data[0].contact_number,
          EWcreatorId :res.data.data.event_data[0].creator_id,
          loading:false
      })   
     })
     .catch(e => { 
       this.setState({
         loading:false
       })
       console.log("error", e);
     });
 }

 refresh =()=> {
 
  var pending =[]
  var other =[]

    getEWDetails(this.state.EWid)
     .then(res => {
        console.log("res get ew details  " +JSON.stringify(res.data) )

        var status;
        if(this.state.archivestatus ==1)
        {
          status ="Archived"
        }
        else if(res.data.data.event_data[0].status ==1)
        {
          status ="Live"
        }
        else
        {
          status =""
        } 
        this.arrayholder = res.data.data.pending_request
        other = res.data.data.Event_wallet_merchant

        this.arrayholder.forEach(val => {
          pending.push(val)

        })
        
      this.setState({
          data: res.data.data.Event_wallet_merchant,
          PendingRequests:res.data.data.pending_request,
          EWname:res.data.data.event_data[0].event_name,
          EWStatus : status,
          EWContactNumber:res.data.data.event_data[0].contact_number,
          EWcreatorId :res.data.data.event_data[0].creator_id,
      })   
     })
     .catch(e => { 
       console.log("error", e);
     });
 }


 createPendingEW = (postInfo, index) =>{
  //console.log("this.state.data " +JSON.stringify(postInfo) )

  let merchant = postInfo.merchant_name
  let merchantid = postInfo.merchant_id

  //let eventName = postInfo.name
  //let ewCreator =postInfo.creator_id

   return(
   
          <TouchableOpacity 
          style={{flexDirection:'row', justifyContent:"center",alignItems:"center",alignSelf:'stretch', marginTop:10}}
          onPress={()=>this.openacceptrejectDialog(merchantid)}
          > 
              {this.state.EWcreator_name ==postInfo.merchant_name?
               null
                  :
                      <Text
                          style={{fontSize:12,color:"red",justifyContent:"center",
                          width:Dimensions.get('window').width/3.5,textAlign:'left',alignSelf:'center'}}>
                         {merchant}
                      </Text> 

                      }            
      
          </TouchableOpacity>
  
    
  )
}

createEW = (postInfo, index) =>{
    //console.log("this.state.data " +JSON.stringify(postInfo) )

    let merchant = postInfo.merchant_name
    let merchantid = postInfo.merchant_id


    //let eventName = postInfo.name
    //let ewCreator =postInfo.creator_id

     return(
     
            <TouchableOpacity 
            style={{flexDirection:'row', justifyContent:"center",alignItems:"center",alignSelf:'stretch', marginTop:5}}
            onPress={()=>this.openremoveMerchantModal(merchantid)}
            > 
                
                {this.state.EWcreator_name ==postInfo.merchant_name?
                 null
                    :
                        <Text
                            style={{fontSize:12,color:"#ffffff",justifyContent:"center",
                            width:Dimensions.get('window').width/3.5,textAlign:'left',alignSelf:'center'}}>
                           {merchant}
                        </Text> 

                        }
               
        
            </TouchableOpacity>
    
      
    )
  }

  resetstack =()=>{
    // console.log("reset stack")
    //     const resetAction = StackActions.reset({
    //   index: 0,
    //   actions: [NavigationActions.navigate({ routeName: 'MerchantAllEW' })],
    // });
    // this.props.navigation.dispatch(resetAction);
}

openremoveMerchantModal=(merchantid)=>{
 if(this.state.ewCreator == this.state.merchantid)
 {

  
  this.setState({
    removeMerchantDialog:true,
    merchant_id:merchantid

  })
  }
}

openacceptrejectDialog=(merchantid)=>{
 if(this.state.ewCreator == this.state.merchantid)
 {

  this.setState({
    acceptRejectDialog:true,
    merchant_id:merchantid
  })
 }
}

removeMerchant=(event_wallet_id,merchantid)=>{
  
  this.setState({
    removeMerchantDialog:false,
    loading:true
  })

  var event_wallet_id = event_wallet_id
  var merchant_id = merchantid 

  var params;
  params = {merchant_id,event_wallet_id};

  console.log("DeleteMerchant params " + JSON.stringify(params)  )

  DeleteMerchant(params)
      .then(res => {
      console.log("merchant delete responseeee  " + JSON.stringify(res) )

      this.setState({ loading: false });


      alert(res.data.message)
        if(res.data.message =="Merchant Deleted SuccessFully")
        {
          this.getEWDetails()

        }
      })
      .catch(e => { 
        this.setState({ loading: false });
        console.log("error", e);
      });


}

acceptRejectRequest=(event_wallet_id,merchant_id,creator_id,AcceptReject)=>{
  this.setState({
    acceptRejectDialog:false,
    loading:true
  })


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
      console.log("all requestssss " + JSON.stringify(res) )


      alert(res.data.message)
        this.getEWDetails()
      })
      .catch(e => { 
        this.setState({ loading: false });
        console.log("error", e);
      });

}

render()
    {

      let requests = this.state.PendingRequests;
      requests = requests.length;

      console.log("merchanttt idddddddd" + this.state.merchantid)

        let eventId = this.state.EWid
        let ewCreator = this.state.ewCreator
        let EWrequest = this.state.EWrequest
        let EWJoined = this.state.EWJoined
        let ewStatus = this.state.EWStatus
        let archivestatus = this.state.archivestatus
        let EWbalance = this.state.EWbalance
        let merchant_status = this.state.EWMerchantStatus

        if(this.state.removeMerchantDialog){
          return (
            <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}>
              <ConfirmDialog
                  title="Click remove if you want to Delete this merchant"
                  visible={this.state.removeMerchantDialog}
                  onTouchOutside={() =>
                    this.setState({removeMerchantDialog: false})
                     //alert("Outside!")
                    }
                  positiveButton={{
                      title: "Remove",
                      onPress: () => this.removeMerchant(eventId,this.state.merchant_id)
                  }}
                  negativeButton={{
                    title: "Cancel",
                    onPress: () =>  this.setState({removeMerchantDialog: false})
                  }}
                 />                
             </LinearGradient>
          );               
        }

        if(this.state.acceptRejectDialog){
          return (
            <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}>
              <ConfirmDialog
                  title="This merchant has requested to join your EW"
                  visible={this.state.acceptRejectDialog}
                  onTouchOutside={() =>
                    this.setState({acceptRejectDialog: false})
                     //alert("Outside!")
                    }
                  positiveButton={{
                      title: "Accept",
                      onPress: () => this.acceptRejectRequest(eventId,this.state.merchant_id,ewCreator,"Accept")
                  }}
                  negativeButton={{
                    title: "Reject",
                    onPress: () =>  this.acceptRejectRequest(eventId,this.state.merchant_id,ewCreator,"Decline")
                  }}
                 />                

             </LinearGradient>
          );               
        }

    return (
        <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}>
            <NavigationEvents
            onWillBlur={payload => this.resetstack()}
            />

            <Spinner
              visible={this.state.loading}
            />

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

        {/* <CustomHeader /> */}

        {/* <TouchableOpacity
             style={{marginLeft:10}}
             onPress={() =>
            this.props.navigation.goBack()
          }
            >
            <Image
              style={{width:25, height:25}}
              source={require('../../../assets/BackArrow.png')}
            />
        </TouchableOpacity> */}


      <View style={{flexDirection:'row',alignSelf:'stretch',justifyContent:'space-between'}}>   

          <TouchableOpacity
                style={{marginLeft:10 , marginTop: Platform.OS === 'ios' ? '10%' : StatusBar.currentHeight,
                marginRight: 15, alignSelf:'flex-start'}}
                onPress={() =>
                this.props.navigation.goBack()
              }
                >
                <Logo width={22} height={22} />
          </TouchableOpacity>

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
      </View>

        <View style={styles.container}> 

            <View style={{flexDirection:'row',margin:10,height:70}}>
                <View style={{flexDirection:'row',width:"100%",backgroundColor:"#054d77", justifyContent:"center",alignItems:"center"}}> 
                   <View style={{marginStart:5,width:"70%"}}>
                        <Text
                            style={{fontSize:16,color:"#ffffff"}}>
                             {this.state.EWname}
                        </Text> 

                    </View>

                    <View > 
                   {this.state.EWUnarchive ?
                   <View>
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

                     </View>:
                     <View>
                   {EWrequest =="Pending" ?
                   <View>
                        <Text
                            style={{fontSize:14,color:"red",borderRadius:5,paddingLeft:10}}>
                            Pending 
                        </Text>  
                     </View>
                     :
                     <View>
                          {!EWJoined && this.state.merchantid!=ewCreator?                           
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
                                  { EWJoined && EWbalance == 0 && merchant_status==1?
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
                       }
                  </View>

                </View>           
            </View>



            <View style={{margin:10,padding:20,height:"100%"}}>

                <View style={{flexDirection:'row', justifyContent:"center",alignItems:"center"}}> 
                   <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:17, color:"#ffffff",fontWeight:'bold'}}>
                            Creator: 
                        </Text> 
                    </View>
                    <View style={{marginStart:5,width:"70%"}}>
                        <Text
                            style={{fontSize:16,color:"#ffffff"}}>
                             {this.state.EWcreator_name}
                        </Text> 
                    </View>                      
                </View>  

                <View style={{flexDirection:'row', justifyContent:"center",alignItems:"center"}}> 
                   <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:17, color:"#ffffff",fontWeight:'bold'}}>
                            Contact: 
                        </Text> 
                    </View>
                    <View style={{marginStart:5,width:"70%"}}>
                        <Text
                            style={{fontSize:16,color:"#ffffff"}}>
                             {this.state.EWContactNumber}
                        </Text> 
                    </View>                      
                </View>  

                <View style={{flexDirection:'row', justifyContent:"center",alignItems:"center"}}> 
                   <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:17, color:"#ffffff",fontWeight:'bold'}}>
                            Status: 
                        </Text> 
                    </View>
                    <View style={{marginStart:5,width:"70%"}}>
                        <Text
                            style={{fontSize:16,color:"#ffffff"}}>
                             {this.state.EWStatus}
                        </Text> 
                    </View>                      
                </View>  


                <View style={{flexDirection:'row', justifyContent:"center",alignItems:"center"}}> 
                   <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:17, color:"#ffffff",fontWeight:'bold'}}>
                            Amount: 
                        </Text> 
                    </View>
                    <View style={{marginStart:5,width:"70%"}}>
                        <Text
                            style={{fontSize:16,color:"#ffffff"}}>
                            ${this.state.EWbalance}
                        </Text> 
                    </View>                      
                </View> 

                <View style={{flexDirection:'row', justifyContent:"center",alignItems:"center"}}> 
                   <View style={{width:"100%"}}>
                        <Text
                            style={{fontSize:17, color:"#ffffff",fontWeight:'bold'}}>
                            Merchant : 
                        </Text> 
                    </View>
                                       
                </View> 

             <View style={{margin:5}}>

              {this.state.EWcreatorId == this.state.merchantid? 

                <FlatList
                data={this.state.PendingRequests}
                numColumns={4}
                //style={{height:'50%'}}
                renderItem={({ item, index }) => this.createPendingEW(item, index)}
                keyExtractor={(item) => item.id}
                />
                :
                null
                }

              <FlatList
                data={this.state.data}
                numColumns={3}
                style={ requests==0 || requests == undefined? {height:'100%'}:{ height:'70%'}}
               // style={{backgroundColor:'red'}}
                renderItem={({ item, index }) => this.createEW(item, index)}
                keyExtractor={(item) => item.id}
                />
              </View>

            </View>

        </View>

        </LinearGradient>

              
      
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
        flex: 1,
        justifyContent:'space-between',
        alignItems: 'center',
        flexDirection: 'column'
      },
    innerContainer :{
        alignItems: 'center',
        //justifyContent: 'center',
      } ,
  });

  
  export default withNavigation(MerchantEWDetailScreen);

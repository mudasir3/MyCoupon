import React, { Component } from 'react';
import { StyleSheet, View,Image,TouchableOpacity, Platform, StatusBar,
  TextInput,Text,FlatList, AsyncStorage,Modal} from 'react-native';
import { Icon  } from "native-base"; 
import CustomHeader from '../../CustomHeader';
import {  Tab,Tabs } from 'native-base';
//import QRCode from 'react-native-qrcode';
import { QRCode } from 'react-native-custom-qr-codes-expo';
import { Button } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

import {getAllEW,JoinEW,UserDetail,checkDevice,signOut,CustomerAllJoinedEW,getArchivedCustomers,getEWDetails} from "../API/ApiActions";
import {get,set} from "../LocalStorage";
import { withNavigation } from 'react-navigation';

import Spinner from 'react-native-loading-spinner-overlay';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import DeviceInfo from 'react-native-device-info';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { NavigationEvents } from 'react-navigation';

var _this;
class AllEventWalletsScreen extends Component {

  constructor(props) {
    super(props)
    this.arrayholder = [];
  }

static navigationOptions = { header: null };

state= {
    EWToggle : "live",
    data:[],
    Archiveddata:[],
    userid : 0,
    value:'',
    EWFLAG : false,
    EWname:'',
    EWbalance :0,
    EWid : 0,
    //EWJoined:false,
    ALLEW:[],
    nameDialog:false,
    loading: false,
    flatlistloading:false,
    flatlistarchivedloading:false,
    modalVisible: false,
    tempEW:0
}
// componentDidMount(){
//     this.getData()
//     this.getuserid()
// }


componentDidMount() {
  console.log("this.props.screenProps " + this.props.screenProps)
    _this =this;

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {

        this.getuserid() 
        
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

getuserid = async() =>
{
  let user =await get("USER_ID")

  console.log("user " + user);

  this.setState({
    userid : user,
    loading: true,
  })

  //this.getAllJoinedEvents(user)

  this.checkdevice(user)
 
}

getUserdetails=()=>{
   //this.setState({ loading: false })
    var id =this.state.userid
      UserDetail(id)
     .then(res => {
       this.setState({ loading: false })
      console.log("user detaillss res " + JSON.stringify(res.data.data))
  
      if((res.data.data.eventWalletCustomer == null))
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
          EWbalance :res.data.data.eventWalletCustomer.balance,
          EWid : res.data.data.eventWalletCustomer.event_wallet_id,
    
        })
      }
     })
     .catch(e => { 
       this.setState({ loading: false })
       console.log("error getting user details", e);
     });
  
  }

  refreshdetails=()=>{
    this.setState({ flatlistloading: true })
     var id =this.state.userid
       UserDetail(id)
      .then(res => {
        this.setState({ loading: false })
       console.log("user detaillss res " + JSON.stringify(res.data.data))
   
       if((res.data.data.eventWalletCustomer == null))
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
           EWbalance :res.data.data.eventWalletCustomer.balance,
           EWid : res.data.data.eventWalletCustomer.event_wallet_id,
           flatlistloading: false
         })
       }
      })
      .catch(e => { 
        this.setState({ loading: false, flatlistloading: false })
        console.log("error getting user details", e);
      });
   
   }

  checkdevice=(user)=>{
    var user_id =user
    var device_id = DeviceInfo.getUniqueId();
    const params = {user_id,device_id} ;

    checkDevice(params)
     .then(res => {
      //alert(res.)
      console.log("checkDevice ressss " + JSON.stringify(res))

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
          this.getData(user)
          this.getArchived()
          this.getUserdetails()
        });
      }
      else
      {
        this.getData(user)
        this.getArchived()
        this.getUserdetails()
      }
        
     })
     .catch(e => { 
       console.log("error", e);
       this.getData(user)
        this.getArchived()
        this.getUserdetails()
     });
     
  }

  delete =async()=>{
    this.setState({ loading: true,nameDialog:false })

    const userID = await AsyncStorage.getItem('USER_ID');
    const url = `https://koopa.sr7.tech/api/eventwalletcustomer/archive_delete`;
    let eventId = this.state.tempEW;

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userID,
        event_wallet_id: eventId,
        delete: 1,
      }),
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ loading: false })

        set(0,"event_id")
        alert(res.message);
        this.props.navigation.goBack(null)
      //  this.props.navigation.navigate('TennantOverview');
      })
      .catch(error => {
        this.setState({ loading: false })
        this.setState({ error });
      });
  }


  deleteEvent = (evId) => {
    this.setState({ tempEW:evId, nameDialog:true
    })

  };




  _archivEvent = async (evId) => {
    this.setState({ loading: true })
    console.log("api called: ")
    const userID = await AsyncStorage.getItem('USER_ID');
    const url = `https://koopa.sr7.tech/api/eventwalletcustomer/archive_delete`;
    let eventId = evId;

    console.log("archive event  eventid " + eventId + "  userid " + userID);

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userID,
        event_wallet_id: eventId,
        archive : 1,
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.log(" responsee " + JSON.stringify(res))
        this.setState({ loading: false })

        set(0,"event_id")
        alert(res.message);
        this.props.navigation.goBack(null)
      })
      .catch(error => {
        console.log(" responsee error  " + error)

        this.setState({ loading: false })
        this.setState({ error });
      });
  };

  _UnarchivEvent = async (evId,userid) => {
    this.setState({ loading: true })
    console.log("api called: ")
    const userID = await AsyncStorage.getItem('USER_ID');
    const url = `https://koopa.sr7.tech/api/eventwalletcustomer/unarchive_event_wallet`;
    let eventId = evId;

    console.log("params  userID " + userID + " eventId " + eventId);

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userID,
        event_wallet_id: eventId,
      }),
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ loading: false })
       // alert(res.message)
        //console.log("response " +JSON.stringify(res) )
       // this.props.navigation.goBack(null)

        if(res.message == undefined)
        {
          alert(res.error.message)
          this.props.navigation.goBack(null)
        }
        else
        {
          alert(res.message)

          set(eventId,"event_id")
          this.props.navigation.goBack(null)
        }
      })
      .catch(error => {
        this.setState({ loading: false })
        this.setState({ error });
      });
  };


  // getArchived=()=>{
  //   //this.setState({ loading: true })
  //   const userID = await AsyncStorage.getItem('USER_ID');
  //   var id =userID
  //   getArchivedCustomers(id)
  //    .then(res => {
  //      console.log("joinarchived events " + JSON.stringify(res) )
  //       this.setState({
  //         Archiveddata: res.data,
  //       });
  //    })
  //    .catch(e => { 
  //      console.log("error", e);
  //    });
  // }
  refreshArchived = async () => {
    const userID = await AsyncStorage.getItem('USER_ID');
    const url = `https://koopa.sr7.tech/api/eventwalletcustomer/get_all_archived_events/`;

    fetch(url+userID, {
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
        });

        this.getEWDetails()

        console.log(JSON.stringify(res.data))
      })
      .catch(error => {
        alert("Error retrieving archive events"+error)
      });
  };

  getArchived = async () => {
    this.setState({ loading: true })
    const userID = await AsyncStorage.getItem('USER_ID');
    const url = `https://koopa.sr7.tech/api/eventwalletcustomer/get_all_archived_events/`;
    

    fetch(url+userID, {
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

        this.getEWDetails()

        console.log(JSON.stringify(res.data))
      })
      .catch(error => {
        this.setState({ loading: false })
        alert("Error retrieving archive events"+error)
      });
  };




 getData =(userid)=> {
  this.setState({ loading: true })

    console.log("getdataaaaa " )

    getAllEW(userid)
     .then(res => {
       //alert(JSON.stringify(res))
       console.log("ress "+ JSON.stringify(res))

         this.arrayholder = res.data.data;

          let newArray = [];

      this.arrayholder.forEach(element => {
        if(element.archive_status == 1 )
        {
          
        }
        else
        {
          newArray.push(element);
         
        }

      });

      this.setState({
          data: newArray,
          loading: false,
      })   
      


      //alert("Event Balance: "+  JSON.stringify(res.data.data))
     }) 
     .catch(e => { 
       this.setState({ loading: false })
       console.log("error retrieving data ", e);
     });

 }


toggledrawer(){
 // console.log("toggle drawer")
}

joinEvent = (eventId) => {
  this.setState({ loading: true })
    var user_id = this.state.userid
    var event_wallet_id = eventId

    const params = {user_id,event_wallet_id};

    console.log("params " +JSON.stringify( params))

    JoinEW(params)
     .then(res => {
       this.setState({ loading: false })
      // this.setState({ loading: false }); 
      //console.log("res " + JSON.stringify(res.data))

      if(res.data.status === "success")
      {
        alert(res.data.message)
        set(event_wallet_id,"event_id")

        this.props.navigation.goBack(null)
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
      alert("Unable to join event")
     });
}

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
 
  console.log("archivedd  " + JSON.stringify(postInfo) )

  let eventId = postInfo.event_wallet_id
  let eventName = postInfo.name
  let ewCreator =postInfo.creator_id
  let ewStatus = postInfo.ew_status
  let archivestatus = postInfo.archive_status
  let balance = postInfo.balance
  let status =postInfo.status
  let creator_name =postInfo.merchant_name
   
    console.log("crweeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeator: "+ postInfo)
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

  
     return(
         <View >
       <TouchableOpacity 
             onPress={()=> this.props.navigation.navigate('EWDetail',{"EWid":eventId,"creator_name":creator_name,"ewStatus":status,"EWJoined":EWJoined,"EWbalance":EWbalance,"archivestatus":archivestatus,"unarchive":true})}
             style={{flexDirection:'row',margin:10,height:70}}>
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
                      onPress={()=> this._UnarchivEvent(eventId,this.state.userid)}
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
  //console.log("this.state.data Are You sure " + JSON.stringify(postInfo) )

    let eventId = postInfo.id
    let eventName = postInfo.name
    let ewCreator =postInfo.creator_id
    let ewStatus = postInfo.ew_status
    let archivestatus = postInfo.archive_status
    let balance = postInfo.balance
    let status =postInfo.status
    let creator_name =postInfo.merchant_name

    //console.log("Creaaaaaaaaaaaaaator:"+ postInfo.merchant_name)

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
  
        //console.log("EWJoined  " + EWJoined)


    return(
        <View >
      <TouchableOpacity 
             onPress={()=> this.props.navigation.navigate('EWDetail',{"EWid":eventId,"creator_name":creator_name,"ewStatus":status,"EWJoined":EWJoined,"EWbalance":EWbalance,"archivestatus":archivestatus})}
            //  onPress ={() => this.setState({
            //    modalVisible:true
            //  })}
             style={{flexDirection:'row',margin:10,height:70}}>
              <View style={{flexDirection:'row',width:"100%",backgroundColor:"#054d77", justifyContent:"center",alignItems:"center"}}> 
              <View style={{marginStart:5,width:"25%"}}>
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
  
                  <View style={{marginStart:5,width:"45%"}}>
                      <Text
                          style={{fontSize:16,color:"#ffffff"}}>
                          Creator
                      </Text> 
  
                      <Text
                          style={{fontSize:15,color:"#ffffff"}}>
                          {creator_name}
                      </Text>
                  </View>
  
                  <View > 
                      { !EWJoined ?                           
                              <TouchableOpacity 
                              onPress={()=> this.joinEvent(eventId)}
                              style={{backgroundColor:"#054d77"}}>
                                  <Text
                                      style={{fontSize:13,marginStart:10, borderRadius:5,color:"red",backgroundColor:"#eeeeee",paddingHorizontal:10,paddingVertical:5}}>
                                      Add
                                  </Text>                       
                              </TouchableOpacity>
                          :
                          <View>
                              { EWJoined && status==1 && EWbalance != 0 ?
                                <View> 
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
                                  {status==1 && EWbalance == 0?
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
                                         EWJoined && EWbalance != 0?
                                         <View>
                                            <TouchableOpacity 
                                                 style={{marginBottom:5,justifyContent:'center',alignItems:'center'}}
                                                onPress={()=> this.joinEvent(eventId)}
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
                                              EWJoined && EWbalance == 0?
                                              <View>
                                                  <TouchableOpacity
                                                      style={{marginBottom:5,justifyContent:'center',alignItems:'center'}}
                                                      onPress={()=> this.joinEvent(eventId)}
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
                                                  archivestatus!=null?
                                                    <View>
                                                       <TouchableOpacity 
                                                          style={{marginStart:10,marginBottom:5,backgroundColor:"#054d77"}}
                                                          onPress={()=> 
                                                            this._UnarchivEvent(eventId,this.state.userid)
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
  
    _this.refreshdetails()
    //_this.refreshArchived()
    //_this.getArchived()
  
  }



  closeModal=()=>{
    this.setState({nameDialog: false})
  }

  onSwipeDownArchived =()=>{
    console.log("swipeeeee" )
  }

  stoprefresh=()=>{
    this.setState({EWToggle : "live"})
  }


render()
    {

      console.log("togglleeeeeeeeeeeeee "+ this.state.EWToggle)

      const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
      };

    return (
      <GestureRecognizer
     // onSwipe={this.onSwipe}
      //onSwipeUp={this.onSwipeUp}
     // onSwipeDown={this.onSwipeDown}
     // onSwipeLeft={this.onSwipeLeft}
     // onSwipeRight={this.onSwipeRight}
        config={config}
        style={{flex:1,justifyContent:'flex-start',alignItems:'center'}}
        >
        <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}>
        <Spinner
          visible={this.state.loading}
        />
           <NavigationEvents
      onWillBlur={payload => this.stoprefresh() }
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

        {/* <Modal
          animationType="slide"
          transparent={false}

          visible={this.state.modalVisible}
          onRequestClose={() => {
           // alert('Modal has been closed.');
          }}/> */}

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
                data={this.state.Archiveddata}
                extraData={this.state.Archiveddata}
                onRefresh={()=> this.onSwipeDownArchived()}
                refreshing={this.state.flatlistarchivedloading}
                renderItem={({ item, index }) =>
                        this.RenderArchived(item, index)
                }
                keyExtractor={(item) => item.id}
                />


          }

        
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
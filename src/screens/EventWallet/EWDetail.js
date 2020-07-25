import React, { Component } from 'react';
import { StyleSheet, View,Image,TouchableOpacity, StatusBar, Platform,
  TextInput,Text,FlatList,AsyncStorage,Dimensions} from 'react-native';
import { Icon  } from "native-base"; 
import CustomHeader from '../../CustomHeader';
import {  Tab,Tabs } from 'native-base';
//import QRCode from 'react-native-qrcode';
import { QRCode } from 'react-native-custom-qr-codes-expo';
import { Button } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {getAllEW,JoinEW,UserDetail,CustomerAllJoinedEW,getEWDetails,checkDevice,signOut} from "../API/ApiActions";
import {get,set} from "../LocalStorage";
import { NavigationEvents } from 'react-navigation';

import { withNavigation } from 'react-navigation';



import Spinner from 'react-native-loading-spinner-overlay';

import { StackActions, NavigationActions } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import { ConfirmDialog } from 'react-native-simple-dialogs';

import Logo from '../../../assets/backbtn.svg';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


let chk = false

class EWDetailScreen extends Component {

  constructor(props) {
    super(props)

  }

static navigationOptions = { header: null };

state= {
    data:[],
    userid:'',
    EWname:'',
    EWStatus : '',
    EWContactNumber:'',
    EWcreatorId :'',
    balance: '',
    archiveStatus: '',
    archivestatus:'',
    EWJoined:'',
    EWid:'',
    ewStatus:'',
    EWbalance:'',
    EWUnarchive:false,
    EWcreatorname:'',
    loading:false,
    tempEW:0,
    nameDialog:false,

}

// componentDidUpdate(){
//     console.log("didupdate")
//     if (!chk){
//         console.log("ifff")

//       chk = true // Change value when rendering screen
//     } else {
//         console.log("elseee ")

//       //The popToTop action takes you back to the first screen in the stack, dismissing all the others.
//       this.props.navigation.dispatch(StackActions.popToTop()); 
//       chk = false //Initialization
//     }
//   }


 componentDidMount() {

    const { navigation } = this.props;

    this.focusListener = navigation.addListener('didFocus', () => {

      console.log("didmount" )

    this.getuserid()

    let eventId = this.props.navigation.getParam('EWid','00')
    let joined = this.props.navigation.getParam('EWJoined',false)
    let status = this.props.navigation.getParam('ewStatus','00')
    let balance = this.props.navigation.getParam('EWbalance','00')
    let archived = this.props.navigation.getParam('archivestatus','00')
    let unarchive = this.props.navigation.getParam('unarchive',false)
    let creatorname = this.props.navigation.getParam('creator_name','00')

    console.log("eventId " + eventId +  " joined " +joined + " status " +status +" balance " + balance + " archived "+archived)

    this.setState({
        EWid:eventId,        
        EWJoined:joined,
        ewStatus:status,
        EWbalance:balance,
        archivestatus:archived,
        EWUnarchive :unarchive,
        EWcreatorname :creatorname
    })
    console.log("Naaaaaaaaaaaaaaaaaaaaam" + this.props.navigation.getParam('creator_name','00'))

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
    })
    this.checkdevice(user)

  }
toggledrawer(){
  console.log("toggle drawer")
 
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

delete= async () => {
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

        alert(res.message);
        this.props.navigation.goBack(null)
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


  _archivEvent = async (evId) => {
    this.setState({ loading: true })
    console.log("api called: ")
    const userID = await AsyncStorage.getItem('USER_ID');
    const url = `https://koopa.sr7.tech/api/eventwalletcustomer/archive_delete`;
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
        user_id: userID,
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
        //this.props.navigation.goBack(null)

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
        this.setState({ loading: false })
        this.setState({ error });
      });
  };

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

    getEWDetails(this.state.EWid)
     .then(res => {
        console.log("res get ew details  " +JSON.stringify(res.data.data) )

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

      this.setState({
          data: res.data.data.Event_wallet_merchant,
          EWname:res.data.data.event_data[0].event_name,
          EWStatus : status,
          EWContactNumber:res.data.data.event_data[0].contact_number,
          EWcreatorId :res.data.data.event_data[0].creator_id,
          //balance: res.data.data.event_data[0].balance,
      })   
      //console.log("Status: "+ res.data.data.event_data[0].balance)
     })
     .catch(e => { 
       console.log("error", e);
     });
 }


createEW = (postInfo, index) =>{

    let merchant = postInfo.merchant_name
    //let eventName = postInfo.name
    //let ewCreator =postInfo.creator_id

     return(
      <View >
             <View style={{flexDirection:'row', justifyContent:"center",alignItems:"center",alignSelf:'stretch', marginTop:20}}> 
                {this.state.EWcreator_name ==postInfo.merchant_name?
                 null
                    :
                        <Text
                            style={{fontSize:12,color:"#ffffff",justifyContent:"center",
                            width:Dimensions.get('window').width/3.5,textAlign:'center',alignSelf:'center'}}>
                           {merchant}
                        </Text> 

                        }
               
        
            </View>
    
      </View>
    )
  }

  resetstack =()=>{
      console.log("reset stack" + chk)
      
    //   if (!chk){
    //     chk = true // Change value when rendering screen
    //   } else {
    //     //The popToTop action takes you back to the first screen in the stack, dismissing all the others.
    //     this.props.navigation.dispatch(StackActions.popToTop()); 
    //     chk = false //Initialization
    //   }
    //   this.props.navigation.popToTop() 
    //   const popAction = StackActions.pop();
     //this.props.navigation.dispatch(popAction);

        //     const resetAction = StackActions.reset({
        //     index: 0,
        //     //actions:{}
        //     actions: [NavigationActions.navigate({ routeName: 'tabNav' })],
        // });
        // this.props.navigation.dispatch(resetAction);
  }

  closeModal=()=>{
    this.setState({nameDialog: false})
  }

render()
    {
         let eventId = this.state.EWid
         let EWbalance = this.state.EWbalance   
         let status =this.state.ewStatus
         var EWJoined = this.state.EWJoined;
         let archivestatus = this.state.archivestatus

         var notch;

         let hasNotch = DeviceInfo.hasNotch();
         if(hasNotch)
         {
           notch = hp('2%')
         }
         else
         {
           notch =0
         }

    return (
        <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}>
            <NavigationEvents
            onWillBlur={payload => this.resetstack()}
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
        <View style={{flexDirection:'row',alignSelf:'stretch',justifyContent:'space-between',marginTop:notch}}>   

              <TouchableOpacity
                    style={{marginLeft:10 , marginTop: Platform.OS === 'ios' ? '10%' : StatusBar.currentHeight,
                    marginRight: 15, alignSelf:'flex-start'}}
                    onPress={() =>
                    this.props.navigation.goBack(null)
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
        <Spinner
          visible={this.state.loading}
        />

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
                          :
                          <View>
                      { !EWJoined ?                           
                              <TouchableOpacity 
                              onPress={()=> this.joinEvent(eventId)}
                              style={{backgroundColor:"#054d77"}}>
                                  <Text
                                      style={{fontSize:13,marginStart:10,color:"red",borderRadius:5,backgroundColor:"#eeeeee",paddingHorizontal:10,paddingVertical:5}}>
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
                    }
  
                  </View> 


                </View>           
            </View>



            <View style={{margin:10,backgroundColor:"#054d77",padding:20,height:"100%"}}>

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
                             {this.state.EWcreatorname}
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


                <FlatList
                data={this.state.data}
                numColumns={3}
                renderItem={({ item, index }) => this.createEW(item, index)}
                keyExtractor={(item) => item.id}
                />

                {/* <View style={{flexDirection:'row', justifyContent:"center",alignItems:"center",marginTop:20}}> 
                   <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1
                        </Text> 
                    </View>
                    <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1 
                        </Text> 
                    </View>  
                    <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1
                        </Text> 
                    </View>                     
                </View> 
                <View style={{flexDirection:'row', justifyContent:"center",alignItems:"center",marginTop:20}}> 
                   <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1
                        </Text> 
                    </View>
                    <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1 
                        </Text> 
                    </View>  
                    <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1
                        </Text> 
                    </View>                     
                </View>  
                <View style={{flexDirection:'row', justifyContent:"center",alignItems:"center",marginTop:20}}> 
                   <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1
                        </Text> 
                    </View>
                    <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1 
                        </Text> 
                    </View>  
                    <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1
                        </Text> 
                    </View>                     
                </View> 
                <View style={{flexDirection:'row', justifyContent:"center",alignItems:"center",marginTop:20}}> 
                   <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1
                        </Text> 
                    </View>
                    <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1 
                        </Text> 
                    </View>  
                    <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1
                        </Text> 
                    </View>                     
                </View> 
                <View style={{flexDirection:'row', justifyContent:"center",alignItems:"center",marginTop:20}}> 
                   <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1
                        </Text> 
                    </View>
                    <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1 
                        </Text> 
                    </View>  
                    <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1
                        </Text> 
                    </View>                     
                </View> 
                <View style={{flexDirection:'row', justifyContent:"center",alignItems:"center",marginTop:20}}> 
                   <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1
                        </Text> 
                    </View>
                    <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1 
                        </Text> 
                    </View>  
                    <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1
                        </Text> 
                    </View>                     
                </View> 
                <View style={{flexDirection:'row', justifyContent:"center",alignItems:"center",marginTop:20}}> 
                   <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1
                        </Text> 
                    </View>
                    <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1 
                        </Text> 
                    </View>  
                    <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1
                        </Text> 
                    </View>                     
                </View> 
                <View style={{flexDirection:'row', justifyContent:"center",alignItems:"center",marginTop:20}}> 
                   <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1
                        </Text> 
                    </View>
                    <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1 
                        </Text> 
                    </View>  
                    <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1
                        </Text> 
                    </View>                     
                </View> 
                <View style={{flexDirection:'row', justifyContent:"center",alignItems:"center",marginTop:20}}> 
                   <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1
                        </Text> 
                    </View>
                    <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1 
                        </Text> 
                    </View>  
                    <View style={{marginStart:5,width:"30%"}}>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            Merchant Name 1
                        </Text> 
                    </View>                     
                </View>  */}


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

  export default withNavigation(EWDetailScreen);

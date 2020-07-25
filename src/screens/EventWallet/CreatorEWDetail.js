import React, { Component } from 'react';
import { StyleSheet, View,Image, StatusBar, Platform, TouchableOpacity,TextInput,Text,FlatList} from 'react-native';
import { Icon  } from "native-base"; 
import CustomHeader from '../../CustomHeader';
import {  Tab,Tabs } from 'native-base';
//import QRCode from 'react-native-qrcode';
import { QRCode } from 'react-native-custom-qr-codes-expo';
import { Button } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {getAllEWMerchant,JoinEWMerchant,MerchantDetails,MerchantAllJoinedEW,RequestToJoin,UseEWMerchant,getEWDetails,checkDevice,signOut} from "../API/ApiActions";
import {get,set} from "../LocalStorage";
import { StackActions, NavigationActions } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';

import { withNavigation } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';

let chk = false

class CreatorEWDetailScreen extends Component {

  constructor(props) {
    super(props)
  }

static navigationOptions = { header: null };

state= {
    EWid: '',
    EWname:'',
    EW_islive:'',
    EW_isdefault:'',
    EW_isArchived :'',
    EW_hastokens:'',
    data:[],
    EWStatus : '',
    EWContactNumber:'',
    EWcreatorId :'',
    EWJoined:'',
    ewStatus:'',
    EWbalance:'',
    archivestatus:'',
    EWrequest:'',
    merchantid:'',
    EWMerchantStatus :'',
    EWUnarchive:false,
    EWCreatorName :'',
    loading: false,


}

componentDidMount() {
   
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
        let name = this.props.navigation.getParam('eventName','00')
        let islive = this.props.navigation.getParam('islive','00')
        let isdefault = this.props.navigation.getParam('isdefault','00')
        let hastoken = this.props.navigation.getParam('has_token','00')
        let archived = this.props.navigation.getParam('archived','00')
        let creator= this.props.navigation.getParam('ewCreator','00')
        let unarchive = this.props.navigation.getParam('unarchive',false)
        let creatorname = this.props.navigation.getParam('creator_name','00')
        let balance = this.props.navigation.getParam('balance','00')

        console.log("eventId " + eventId +  " name " +name + " islive " +islive +" isdefault " + isdefault + " hastoken "+hastoken + " archived "+ archived )
    
        this.setState({
            EWid : eventId,
            EWname:name,
            EW_islive: islive,
            EW_isdefault :isdefault,
            EW_hastokens :hastoken,
            EW_isArchived :archived,
            EWcreatorId:creator,
            EWUnarchive :unarchive,
            EWCreatorName :creatorname,
            EWbalance:balance

        })
    
    
        this.getEWDetails(eventId)  
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

  this.checkdevice(user)

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

        set(this.state.EWcreatorId,"NEWEWcreatorid")
        set(this.state.EWname,"NEWEWname")
        set(eventId,"NEWEWeventid")
      
        set(2,"first_login")
        this.props.navigation.navigate('Creator')

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


_UnarchivEvent = async (evId) => {
    this.setState({ loading: true })

    const url = `https://koopa.sr7.tech/api/eventwallet/creator_event_delete`;
    let eventId = evId;
  
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        creator_id : this.state.merchantid,
        event_wallet_id: eventId,
        unarchive: 1,
      }),
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ loading: false })
        console.log("delete ress "+ res)
        alert(res.message);
        this.props.navigation.goBack(null)
      })
      .catch(error => {
        this.setState({ loading: false })
      });
};

_archivEvent = async (evId) => {
    this.setState({ loading: true })

    const url = `https://koopa.sr7.tech/api/eventwallet/creator_event_delete`;
    let eventId = evId;
  
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        creator_id : this.state.merchantid,
        event_wallet_id: eventId,
        archive: 1,
      }),
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ loading: false })
        console.log("archive ress "+JSON.stringify(res) )
        alert(res.message);
        this.props.navigation.goBack(null)
      })
      .catch(error => {
        this.setState({ loading: false })
      });
};
  
  
  deleteEvent = async (evId) => {
    this.setState({ loading: true })
  
    const url = `https://koopa.sr7.tech/api/eventwalletmerchant/archive_delete`;
    let eventId = evId;
  
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


getEWDetails =(eventId)=> {
    getEWDetails(eventId)
     .then(res => {
        console.log("res get ew details  " +JSON.stringify(res) )
        var status;

        if(res.data.data.event_data[0].status == 1)
        {
          status ="Live"
        }
        else{
          status = "Archive"
        }
      this.setState({
          data: res.data.data.Event_wallet_merchant,
          EWname:res.data.data.event_data[0].event_name,
          EWStatus : status,
          EWContactNumber:res.data.data.event_data[0].contact_number,
          //EWcreatorId :res.data.data.event_data[0].creator_id
      })   
     })
     .catch(e => { 
       console.log("error", e);
     });
 }


createEW = (postInfo, index) =>{
  console.log("creator  dataaa " +JSON.stringify(postInfo) )

    let merchant = postInfo.merchant_name

     return(
      <View >
            <View style={{flexDirection:'row',alignItems:"center",marginTop:20}}> 
                <View style={{marginStart:5}}>
                {this.state.EWCreatorName ==postInfo.merchant_name?
                 null
                    :
                    <View>
                        <Text
                            style={{fontSize:12,color:"#ffffff"}}>
                            {merchant}
                        </Text> 
                        </View>
                        }
                </View>
                {/* <View style={{marginStart:5,width:"30%"}}>
                    <Text
                        style={{fontSize:12,color:"#ffffff"}}>
                        {merchant}
                    </Text> 
                </View>  
                <View style={{marginStart:5,width:"30%"}}>
                    <Text
                        style={{fontSize:12,color:"#ffffff"}}>
                        {merchant}
                    </Text> 
                </View>                      */}
            </View>
    
      </View>
    )
  }

render()
    {

        let eventId = this.state.EWid
        let islive = this.state.EW_islive
        let isdefault = this.state.EW_isdefault
        let has_token =this.state.EW_hastokens
        let archived = this.state.EW_isArchived

    return (
        <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}>

            <Spinner
                visible={this.state.loading}
                />
        {/* <CustomHeader /> */}

        <View style={{flexDirection:'row',alignSelf:'stretch',justifyContent:'space-between'}}>   

          <TouchableOpacity
                style={{marginLeft:10 , marginTop: Platform.OS === 'ios' ? '10%' : StatusBar.currentHeight,
                marginRight: 15, alignSelf:'flex-start'}}
                onPress={() =>
                this.props.navigation.goBack()
              }
                >
                <Image
                  style={{width:25, height:25}}
                  source={require('../../../assets/BackArrow.png')}
                />
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
                        onPress={()=> this._UnarchivEvent(eventId)}
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
                  { islive && isdefault && has_token ?
                   <View>
                        <TouchableOpacity 
                            style={{padding:10}} 
                            onPress={()=> this._archivEvent(eventId)}
                            >
                            <Text
                                style={{fontSize:13,color:"#ffffff",borderRadius:5}}>
                                Archive
                            </Text>                       
                        </TouchableOpacity>
                       </View>
                       :
                       <View>
                           {islive && isdefault && !has_token ?
                           <View>
                                 <TouchableOpacity
                                   style={{padding:10}} 
                                    onPress={()=> this.deleteEvent(eventId)}
                                    >
                                    <Text
                                        style={{fontSize:13,color:"#ffffff",borderRadius:5}}>
                                        Delete
                                    </Text>                       
                                </TouchableOpacity>
                               </View>
                               :
                               <View>
                                   { islive && !isdefault && has_token ?
                                     <View>
                                           <TouchableOpacity 
                                                onPress={()=> this.useEW(eventId)}
                                                style={{marginBottom:5,justifyContent:'center',alignItems:'center'}}
                                                >
                                                <Text
                                                    style={{fontSize:13,color:"#ffffff",borderRadius:5,padding:5}}>
                                                     Use
                                                </Text>                       
                                              </TouchableOpacity>

                                            <TouchableOpacity 
                                                style={{marginStart:10,marginBottom:5,backgroundColor:"#054d77"}}
                                                onPress={()=> 
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
                                             { islive && !isdefault && !has_token ?
                                             <View>
                                                <TouchableOpacity 
                                                    onPress={()=> this.useEW(eventId)}
                                                    style={{marginBottom:5,justifyContent:'center',alignItems:'center'}}
                                                    >
                                                    <Text
                                                        style={{fontSize:13,color:"#ffffff",borderRadius:5,padding:5}}>
                                                        Use
                                                    </Text>                       
                                                </TouchableOpacity>

                                                <TouchableOpacity 
                                                style={{marginStart:10,marginBottom:5,backgroundColor:"#054d77"}}
                                                onPress={()=> 
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
                                                     { !islive && archived && !isdefault && has_token ?
                                                      <View>
                                                            <TouchableOpacity 
                                                                style={{marginStart:10,marginBottom:5,backgroundColor:"#054d77"}}
                                                                onPress={()=> 
                                                                    this._UnarchivEvent(eventId)
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
                                                              </View>}
                                                     </View>

                                             }
                                             </View>

                                   }
                                   </View>

                           }
                           </View>

                  }           

                        </View>}
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
                             {this.state.EWCreatorName}
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

  export default withNavigation(CreatorEWDetailScreen);

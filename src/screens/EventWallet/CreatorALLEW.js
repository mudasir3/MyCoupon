import React, { Component } from 'react';
import { StyleSheet, View,Image, Platform, StatusBar,
  TouchableOpacity,TextInput,Text,FlatList,AsyncStorage} from 'react-native';
import { Icon  } from "native-base"; 
import CustomHeader from '../../CustomHeader';
import {  Tab,Tabs } from 'native-base';
//import QRCode from 'react-native-qrcode';
import { QRCode } from 'react-native-custom-qr-codes-expo';
import { Button } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

import {getAllEWCreator,checkDevice,signOut,JoinEWMerchant,MerchantDetails,MerchantAllJoinedEW,RequestToJoin,UseEWMerchant} from "../API/ApiActions";
import {get,set} from "../LocalStorage";
import { withNavigation } from 'react-navigation';

import Spinner from 'react-native-loading-spinner-overlay';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import DeviceInfo from 'react-native-device-info';


var _this;
class CreatorALLEWScreen extends Component {

  constructor(props) {
    super(props)
    this.arrayholder = [];
  }

static navigationOptions = { header: null };

state= {
    EWToggle : "live",
    data:[],
    creatorid : 0,
    value:'',
    merchantid:'',
    EWFLAG : false,
    EWname:'',
    EWbalance :0,
    EWid : 0,
    AllEW:[],
    loading: false,
    Archiveddata:[]
    //EWJoined:false

}

componentDidMount() {

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
  let ewcreatorid =await get("NEWEWcreatorid")
  let user =await get("USER_ID")

  console.log("user " + ewcreatorid);

  this.setState({
    creatorid : ewcreatorid,
  })

  this.getData(JSON.parse(ewcreatorid))
  this.getArchived(ewcreatorid)
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
       //this.setState({loading: false}) 
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
 getData =(creatorid)=> {
    this.setState({ loading: true })

    getAllEWCreator(creatorid)
     .then(res => {
        console.log("dataaaaa " +JSON.stringify(res) )

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
          //data: res.data.data
      })   
     })
     .catch(e => { 
         this.setState({ loading: false })
        console.log("getData error", e);
     });
 }


toggledrawer(){
  console.log("toggle drawer")
}

useEW = (eventId,eventName,ewCreator) => {
    this.setState({ loading: true })
    var merchant_id =JSON.parse(this.state.creatorid) 
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
        set(ewCreator,"NEWEWcreatorid")
        set(eventName,"NEWEWname")
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
  
    console.log("params " + "creator_id " + this.state.creatorid + " event_wallet_id" + eventId)
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        creator_id :JSON.parse(this.state.creatorid) ,
        event_wallet_id: eventId,
        unarchive: 1,
      }),
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ loading: false })
        console.log("delete ress "+JSON.stringify(res) )
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
        creator_id :JSON.parse(this.state.creatorid),
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

getArchived = async (creatorid) => {
  this.setState({ loading: true })
  const id = JSON.parse(creatorid) 
  const url = `https://koopa.sr7.tech/api/eventwallet/get_archived_events_creator/`;
  
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
      console.log("archivedddddddddddddddddddd " + JSON.stringify(res))
    })
    .catch(error => {
      this.setState({ loading: false })
      alert(error)
    });
};

deleteEvent = async (evId) => {
  this.setState({ loading: true })

  const url = `https://koopa.sr7.tech/api/eventwallet/creator_event_delete`;
  let eventId = evId;

  console.log("delete ress " + url+ "  creator_id "+this.state.creatorid + "  event_wallet_id " +eventId )

  fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      creator_id :JSON.parse(this.state.creatorid),
      event_wallet_id: eventId,
      delete: 1,
    }),
  })
    .then(res => res.json())
    .then(res => {
      this.setState({ loading: false })
      console.log("delete ress "+JSON.stringify(res) )
      //alert(res.message);s)
      alert(res.message);
      this.props.navigation.goBack(null)
     // this.props.navigation.navigate('MerchantHome')
    })
    .catch(error => {
      this.setState({ loading: false })
    });
};

RenderArchived = (postInfo, index) =>{
 
  console.log("renderarchived " + JSON.stringify(postInfo) )
  let eventId = postInfo.id
  //console.log("ew idd "+ eventId )

  var islive = false;
  var isdefault= false;
  var has_token= false;
  var archived= false;

  
  let eventName = postInfo.name
  let ewCreator =postInfo.creator_id

  let ewislive = postInfo.is_live
  let ewisdefault = postInfo.default
  let ewhas_token = postInfo.has_trasaction
  let ewarchived =postInfo.is_archived
  let creator_name =postInfo.merchant_name
  let balance = postInfo.balance

  if(ewislive =="yes")
  {
      islive = true
  }
  else
  {
      islive = false
  }

  if(ewisdefault =="yes")
  {
      isdefault = true
  }
  else
  {
      isdefault = false
  }
  if(ewhas_token =="yes")
  {
      has_token = true
  }
  else
  {
      has_token = false
  }
  if(ewarchived =="yes")
  {
      archived = true
  }
  else
  {
      archived = false
  }

  return(
      <View >
    <TouchableOpacity 
             onPress={()=> this.props.navigation.navigate('CreatorEWDetail',{"EWid":eventId,"creator_name":creator_name,"ewCreator":ewCreator,"eventName":eventName,"islive":islive ,"isdefault":isdefault,"has_token":has_token,"archived":archived,"unarchive":true,"balance":balance})}
             style={{flexDirection:'row',margin:10,height:50}}            
             >
            <View style={{flexDirection:'row',width:"100%",backgroundColor:"#054d77", justifyContent:"center",alignItems:"center"}}> 
            <View style={{marginStart:5,width:"30%"}}>
                    {/* <Text
                        styl
                        e={{fontSize:16,color:"#ffffff"}}>
                        Event Name
                    </Text>  */}
                    <Text
                        style={{fontSize:14,color:"#ffffff"}}>
                        {eventName}
                    </Text>
                </View>

                <View style={{marginStart:5,width:"40%"}}>
                    {/* <Text
                        style={{fontSize:16,color:"#ffffff"}}>
                        Creator
                    </Text> 

                    <Text
                        style={{fontSize:16,color:"#ffffff"}}>
                        {ewCreator}
                    </Text> */}
                </View>

                <View >                         
                  <TouchableOpacity 
                  onPress={()=> this._UnarchivEvent(eventId,ewCreator)}
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
  //console.log("this.state.data Are You sure " + JSON.stringify(postInfo)  )

    let eventId = postInfo.id
    console.log("creatorid "+JSON.parse(this.state.creatorid )  + " ewcreator " + postInfo.creator_id )

    var islive = false;
    var isdefault= false;
    var has_token= false;
    var archived= false;

    let eventName = postInfo.name
    let ewCreator =postInfo.creator_id

    let ewislive = postInfo.is_live
    let ewisdefault = postInfo.default
    let ewhas_token = postInfo.has_trasaction
    let ewarchived =postInfo.is_archived
   let creator_name =postInfo.merchant_name
   let balance = postInfo.balance

    if(ewislive =="yes")
    {
        islive = true
    }
    else
    {
        islive = false
    }

    if(ewisdefault =="yes")
    {
        isdefault = true
    }
    else
    {
        isdefault = false
    }
    if(ewhas_token =="yes")
    {
        has_token = true
    }
    else
    {
        has_token = false
    }
    if(ewarchived =="yes")
    {
        archived = true
    }
    else
    {
        archived = false
    }


    return(
        <View >
      <TouchableOpacity 
             onPress={()=> this.props.navigation.navigate('CreatorEWDetail',{"EWid":eventId,"creator_name":creator_name,"ewCreator":ewCreator,"eventName":eventName,"islive":islive ,"isdefault":isdefault,"has_token":has_token,"archived":archived,"balance":balance})}
             //style={{flexDirection:'row',margin:10,height:70}}
             style={JSON.parse(this.state.creatorid)==ewCreator ? {flexDirection:'row',margin:10,height:70,borderWidth:1,borderColor:'red'} : {flexDirection:'row',margin:10,height:70}}
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
                                                onPress={()=> this.useEW(eventId,eventName,ewCreator)}
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
                                                    onPress={()=> this.useEW(eventId,eventName,ewCreator)}
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
  
    _this.getuserid()
  
  }

render()
    {

      const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
      };

      console.log("toggle " + this.state.EWToggle)
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
                renderItem={({ item, index }) =>
                        this.RenderArchived(item, index)
                }
                keyExtractor={(item) => item.id}
                />


          }

        <TouchableOpacity 
        style={{alignSelf:"flex-end",marginTop:10,marginBottom:10}}
        onPress={() => this.props.navigation.navigate('NewEW',{"merchantid":this.state.creatorid} )}
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

  export default withNavigation(CreatorALLEWScreen);

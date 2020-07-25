import React, { Component } from 'react';
import { StyleSheet, View,Image,TouchableOpacity,Text, ActivityIndicator,TextInput,AppState} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {Changename,MerchantDetails,checkDevice,signOut} from "../API/ApiActions";
import GetLocation from 'react-native-get-location'
import { NavigationEvents } from 'react-navigation';

import {set,get} from "../LocalStorage";

import { ConfirmDialog } from 'react-native-simple-dialogs';

import DeviceInfo from 'react-native-device-info';
import Spinner from 'react-native-loading-spinner-overlay';


var _this;

export default class HomeScreen extends Component {

  constructor(props) {
    super(props);

    _this =this;
    AppState.addEventListener('change', newState => {
      console.log('new state', newState);

      this.setState({ show: false})

      setTimeout(function(){
        _this.setState({ show: true})     
      }, 1);
     });
  }

  state={
    user_id :'',
    loading:true,
    nameDialog:false,
    name:'',
    saveName :false,
    show:false,
    show:true

  }

  componentDidMount(){
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.setState({
        show: false
      })
      this.getuserid()
    });

  }

  getuserid = async() =>
  {
    let user =await get("USER_ID")
    let userid = await get("Merchant_id")
    console.log("user " + user);

    this.setState({
      user_id : userid
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
          this.getMerchantDetails()
        });
      }
      else
      {
        this.getMerchantDetails()
    }
        
     })
     .catch(e => { 
       console.log("error", e);
       this.getMerchantDetails()
    });
     
  }
  
  getMerchantDetails=async()=>{
    this.setState({ loading: true });


    let user =await get("Merchant_id")
  
    MerchantDetails(user)
     .then(res => {
      // this.setState({ loading: false })
      console.log("merchant detaillss res " + JSON.stringify(res.data.data.user_details))

        this.setState({
          name:res.data.data.user_details.merchant_name,
          nameDialog:true,
          loading: false
        })
        this.getusername(res.data.data.user_details.merchant_name)
 
     })
     .catch(e => { 
      this.setState({ 
      name : '',
      nameDialog:true,
      loading: false
     })
     
       console.log("error", e);
     });
  
     
  }
  
  getusername = (name) =>
  {
    this.setState({ loading: true });

    let merchantname =name

    console.log("usernameeee" + merchantname);

    if(merchantname!= undefined && merchantname!= '' && merchantname!= null && merchantname!="null" )
    {
      this.setState({ loading: false });

      this.setState({
        name : merchantname,
        nameDialog:true,
        loading: false
      })
      setTimeout(function(){
        _this.setState({ show: true})
      }, 1000);
     // this.LoginasMerchant()
    }
    else{

      this.setState({
        name : '',
        nameDialog:true,
        loading: false,
        show: true
      })
    }

  }


  closeModal=()=>{
    this.setState({nameDialog: false})
    this.props.navigation.goBack(null)
  }
  
  changeName =()=>{

    this.setState({
        saveName:true,
        nameDialog:false
    })

    var id = this.state.user_id
    var name = this.state.name

    const params = {name,id};

    console.log("params change name " +JSON.stringify( params) )

    Changename(params)
     .then(res => {
            this.setState({
                    saveName:false,
                })     
                
     console.log("res " + JSON.stringify(res.data))
 
     this.props.navigation.goBack(null)
     alert(res.data.message)
     })
     .catch(e => { 
        this.setState({
            saveName:false,
        })   
               console.log("error", e);
     });


  }

render()
    {

      let name = this.state.name

      if (this.state.loading) {
        return (
          <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{color:'white', marginBottom:5}}>Getting Merchant Name</Text>
                <ActivityIndicator size="large" color ="#ffffff" />
            </View>
          </LinearGradient>
        );
      }

      if(this.state.nameDialog){
        return (
          <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}>
            <ConfirmDialog
                title="Merchant Name"
                visible={this.state.nameDialog}
                onTouchOutside={() =>
                  this.closeModal()
                   //alert("Outside!")
                  }
                positiveButton={{
                    title: "OK",
                    onPress : ()=> this.changeName()
                    //onPress: () => this.state.name!=''? this.changeName(): alert("Please enter your name")
                }}
                negativeButton={{
                  title: "Cancel",
                  onPress: () =>  this.closeModal()

                }}
               >
                 {this.state.show? 
                 
                  <TextInput
                      placeholder ="Please Enter Your Name"
                      value={name}
                      autoFocus={true}
                      autoCorrect={false}
                      onChangeText={name => {
                        this.setState({ name : name });
                        }}
                      //placeholderTextColor ="#000000"
                      style={{marginLeft:10,marginRight:10, fontSize:16,color:"#ffffff",borderBottomColor:"#000000",borderBottomWidth:1,color:"#000000",placeholderTextColor:"red"}}>                           
                  </TextInput> 
                  :
                  <Text
                      value={name}
                      autoFocus={true}
                      onChangeText={name => {
                        this.setState({ name : name });
                        }}
                      //placeholderTextColor ="#000000"
                      style={{marginLeft:10,marginRight:10, fontSize:16,color:"#ffffff",borderBottomColor:"#000000",borderBottomWidth:1,color:"#000000",placeholderTextColor:"red"}}>                           
                  </Text> 
                   }
              
            </ConfirmDialog>
          </LinearGradient>
        );
      }
 
    return (
      <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}>
             <NavigationEvents
                //onDidFocus={payload => this._requestLocation()}
            />
  
        <Spinner
          visible={this.state.saveName}
        />

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
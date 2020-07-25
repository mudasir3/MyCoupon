import React, { Component } from 'react';
import { StyleSheet, View,Image,TouchableOpacity,Text, ActivityIndicator,TextInput,AppState} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {LoginMerchant,MerchantDetails,checkDevice,signOut} from "../API/ApiActions";
import GetLocation from 'react-native-get-location'
import { NavigationEvents } from 'react-navigation';

import {set,get} from "../LocalStorage";

import { ConfirmDialog } from 'react-native-simple-dialogs';

import DeviceInfo from 'react-native-device-info';

var _this;
var longi ='';
var lati ='';
var merchname=''

export default class HomeScreen extends Component {

  constructor(props) {
    super(props);

    _this =this;
    AppState.addEventListener('change', newState => {
      console.log('new state', newState);

     // this.setState({ show: false})
      // setTimeout(function(){
      //   _this.setState({ show: true})     
      // }, 1);

   
     });
  }

  state={
    user_id :'',
    longitude :'',
    latitude :'',
    user_id: '',
    loading:true,
    nameDialog:false,
    name:'',
    show:false

  }

  componentDidMount(){
    
    // setTimeout(function(){
    //   set(0 , 'loginmerchant')   
    // }, 4000);

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.getuserid()
    });

  }

  getuserid = async() =>
  {
    let user =await get("USER_ID")

    console.log("user " + user);

    this.setState({
      user_id : user
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
          this._requestLocation()
        });
      }
      else
      {
        this._requestLocation()
      }
        
     })
     .catch(e => { 
       console.log("error", e);
       this._requestLocation()
     });
     
  }
  
  getMerchantDetails=async()=>{
    this.setState({ loading: true,show:false });

    setTimeout(function(){
      set(0 , 'loginmerchant')   
    }, 2000);

    let user =await get("Merchant_id")
  
    MerchantDetails(user)
     .then(res => {
      // this.setState({ loading: false })
      console.log("merchant detaillss res " + JSON.stringify(res.data.data.user_details))
      if(res.data.data.user_details != null)
      {
        console.log("merchant detaillss iffff")

        this.setState({ loading: false });

        this.setState({
          name:res.data.data.user_details.merchant_name
        })
        
        this.getusername(res.data.data.user_details.merchant_name)

    }
    else
        {

          console.log("merchant detaillss elsee ")
 
          this.setState({
            show:false,
            name : '',
            nameDialog:true,
            loading: false,
          })

          setTimeout(function(){
            _this.setState({ 
            show: true})
          }, 2000);

          // this.setState({
          //   name : '',
          //   nameDialog:true,
          //   loading: false,
          //   show: true
          // })
        }
  

     })
     .catch(e => { 
      // setTimeout(function(){
      //   _this.setState({ show: true})
      // }, 1000);

      this.setState({ 
        name : '',
      nameDialog:true,
      loading: false,
      show: true
     })
     
       console.log("error", e);
     });
  
     
  }
  
  getusername = (name) =>
  {
    this.setState({ loading: true,show :false });

    let merchantname =name

    console.log("usernameeee" + merchantname);

    if(merchantname!= undefined && merchantname!= '' && merchantname!= null && merchantname!="null" )
    {
      this.setState({ loading: false });

      this.setState({
        name : merchantname,
      })

      merchname = merchantname

      this.LoginasMerchant()
    }
    else{
      
      this.setState({
        show:false,
        name : '',
        nameDialog:true,
        loading: false,
      })

      setTimeout(function(){
        _this.setState({ 
        show: true})
      }, 2000);
    }

  }

  _requestLocation = () => {
    console.log("requestlocation")
    this.setState({ loading: true, location: null });
  
    GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 150000,
    })
        .then(location => {
  
          console.log("then location " + location.longitude)
  
            this.setState({
                longitude:location.longitude,
                latitude:location.latitude,
                //nameDialog:true,
                loading: false,
            });

            longi= location.longitude,
                lati=location.latitude,


           this.getMerchantDetails()
            

        })
        .catch(ex => {

          
          set(0 , 'loginmerchant')   
         

          console.log("catch exx " +  ex)
  
          const { code, message } = ex;
          console.warn(code, message);

          if(code == 'CANCELLED')
          {
           console.log("ifff")
            this.setState({
              location: null,
              //loading: false,
          });

          }else if(code != 'UNAVAILABLE' && code === 'UNAUTHORIZED') {
              alert("please enable location & try again")
              this.props.navigation.goBack(null)

              this.setState({
                location: null,
                loading: false,
            });

            }
            else if(code === 'UNAVAILABLE') {
              alert("please enable location & try again")
              this.props.navigation.goBack(null)

              this.setState({
                location: null,
                loading: false,
            });

            }
          
          else
          {

            console.log("elseee _requestLocation")


            //alert("please enable location & try again")
            //this.props.navigation.goBack(null)

            this.setState({
              location: null,
              loading: false,
          });
          }


            // if (code === 'CANCELLED') {
            //     Alert.alert('Location cancelled by user or by another request');
            // }
            // if (code === 'UNAVAILABLE') {
            //     Alert.alert('Location service is disabled or unavailable');
            // }
            // if (code === 'TIMEOUT') {
            //     Alert.alert('Location request timed out');
            // }

            this.setState({
                location: null,
               // loading: false,
            });
        });
  }

  LoginasMerchant=()=>{

    this.setState({ loading: true});


    console.log("login as merchant ")
    var user_id = this.state.user_id
    var longitude = longi
    var latitude = lati
    var merchant_name;

    if(this.state.name!='')
    {
      merchant_name=this.state.name
    }
    else
    {
      merchant_name=merchname
    }

    const params = {user_id,longitude,latitude,merchant_name};

    console.log("params " +JSON.stringify( params))

    LoginMerchant(params)
     .then(res => {
      console.log("response  " + JSON.stringify(res))

      this.setState({
        loading: false,
     });

      if(res.data.status === "success")
      {
        set(true,"is_merchant")
        set(2,"first_login")
        set(res.data.data.merchant_id,"Merchant_id")
        set(merchant_name,"merchant_name")
        this.props.navigation.navigate('Merchant',{merchantid:res.data.data.id} )
      }
       else{
        alert("PIN incorrect")
       }    
     })
     .catch(e => { 
        this.setState({
        loading: false,
      });
       console.log("error LoginMerchant", e);

       
       alert("please enable location & try again")
       this.props.navigation.goBack(null)
     });

  }

  closeModal=()=>{
    this.setState({nameDialog: false})
    this.props.navigation.goBack(null)
  }
  
render()
    {
      if (this.state.loading) {
        return (
          <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{color:'white',marginBottom:10}}>Switching Account</Text>
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
                    onPress: () => this.state.name!=''? this.LoginasMerchant(): alert("Please enter your name")
                }}
                negativeButton={{
                  title: "Cancel",
                  onPress: () =>  this.closeModal()

                }}
               >
                
                {this.state.show? 

                  <TextInput
                      placeholder ="Please Enter Your Name"
                      value={this.state.name}
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
                  //value={name}
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
                onDidFocus={payload => this._requestLocation()}
            />

        {/* <TouchableOpacity 
            //onPress={()=> this.props.navigation.navigate('MerchantHome')}
            onPress ={()=> this.LoginasMerchant()}
            style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize :30,color:'white',fontFamily:'PoppinsMedium'}}>Login Merchant</Text>

        </TouchableOpacity> */}

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
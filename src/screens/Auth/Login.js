import React, { Component } from 'react';
import { StyleSheet,
 Text,
 View,Image ,
TextInput,TouchableOpacity,
Platform,Alert,Modal,
TouchableHighlight, KeyboardAvoidingView,Keyboard,AppState,ActivityIndicator} from 'react-native';

import Constants from 'expo-constants';
import VirtualKeyboard from 'react-native-virtual-keyboard';

import * as LocalAuthentication from 'expo-local-authentication';
import * as Permissions from 'expo-permissions';
// import {
//   Asset,
//   Constants,
//   FileSystem,
//   Permissions,
// } from 'react-native-unimodules';

import {Login,BiometricLogin,sendFcmToken} from "../API/ApiActions";
import {get,set} from "../LocalStorage";

import Spinner from 'react-native-loading-spinner-overlay';

import LinearGradient from 'react-native-linear-gradient';

import { SvgUri } from 'react-native-svg';

import Logo from '../../../assets/Logo.svg';
import { withNavigation } from 'react-navigation';

import { NavigationEvents } from 'react-navigation';

var _this;

var face=0;

var biometricCheck =1

class LoginScreen extends Component {

    constructor(props) {
      super(props);
      _this=this;

      AppState.addEventListener('change', newState => {
        console.log('new state', newState);
  
        // if(newState=='active')
        // {
        //   _this.getSettings()
        //   _this.checkDeviceForHardware();
        //   _this.checkForFingerprints();

        // }
        // this.setState({ show: false})

        // setTimeout(function(){
        //   _this.setState({ show: true})
    
        // }, 10);
       });
    }

  // componentDidMount(){
  //   let numberCount = this.state.number.length
  //   // console.logle.log("numbercount " + numberCount)
  //   if(numberCount == 4)
  //   {
  //     // console.logle.log("ifffff ")
  //     this.props.navigation.navigate('HomeScreen')
  //   }
  // }

state ={
  compatible: false,
  fingerprints: false,
  result: '',
  phone :0,
  pincode : 0,
  number : '',
  userid : 0,
  face : false,
  loading: false,
  authenticated: false,
  modalVisible: false,
  failedCount: 0,
  notificationsetting:false,
  biometricsettings:false,
  show: true,
  faceidCheck:true,
  keyboardheight:0

}


setModalVisible(visible) {
  this.setState({ modalVisible: visible });
}

changeText(newText) {
  this.setState({number : newText});

  }

  
  _keyboardDidShow(e) {
    // console.logle.log("keyboard height " + e.endCoordinates.height)

    _this.setState({
      keyboardheight:e.endCoordinates.height
    })

   // _this.visible(false)
}

_keyboardDidHide(e) {
  // console.logle.log("keyboard height " + e.endCoordinates.height)

  _this.setState({
    keyboardheight:e.endCoordinates.height
  })

 // _this.visible(true)
}

  componentDidMount = async() => {

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {

      biometricCheck=1

      console.log("didfocusssss")

      this.setState({ show: false})

      setTimeout(function(){
        _this.setState({ show: true})
  
      }, 10);

        //  if (Platform.OS === "android") {
          this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this._keyboardDidShow );
          this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
        //}
       // if(face==0)
       // {   
               this.getSettings()


       // }



        this.getuserid()

    });


  }


  visible = visible => () => this.setState({visible});

  componentWillUnmount = () => {
    this.focusListener.remove();

  this.keyboardDidShowListener.remove();
  this.keyboardDidHideListener.remove();
}

  getSettings = async() =>
  {
    let biometric =await get("biometricSettings")

    console.log("biometricSettings " + biometric);

    if(biometric =='' || biometric == undefined ||biometric ==null)
    {

        this.checkDeviceForHardware();
        //this.checkForFingerprints();

      set(true,"biometricSettings")

      this.setState({
        biometricsettings:true
      })
     }else {

      if(biometric==true || biometric=="true")
      {
        this.checkDeviceForHardware();
       // this.checkForFingerprints();
      }
      this.setState({
        biometricsettings:biometric
      })
     }
    // this.setState({
    //   userid : user
    // })
  }

  getuserid = async() =>
  {
    let user =await get("USER_ID")

    // console.logle.log("user " + user);

    this.setState({
      userid : user
    })
  }

  checkDeviceForHardware = async () => {

     console.log("checkDeviceForHardware");

    var compatibleface = await LocalAuthentication.supportedAuthenticationTypesAsync()
    //.then((val)=>{
    if(compatibleface == 1 )
    {
      // alert("Face Auth");
      this.setState({
        face :false,
        compatible:true
      })

     // if(Platform.OS === 'android')
      //{ 
        this.checkForFingerprints()
        // }


    }
    else if(compatibleface ==2 )
    {
      // alert("Finger Auth");
      this.setState({
        face :true,
        compatible:false

      })

     // if(Platform.OS === 'android')
      //{ 
        this.checkForFingerprints()
        //}
    }
    else if(compatibleface.length ==2 ){
      // alert("both true")
      this.setState({
        face :true,
        compatible:true

      })

     // if(Platform.OS === 'android')
      //{ 
      this.checkForFingerprints()
     // } 
       }
    else
    {
      this.setState({
        face :false,
        compatible:false

      })
    }
    //// console.logle.log( " compatibleface val" + val);

    //})
    // .catch((e)=>{
    // // console.logle.log( " error" + e);

    // })
    // console.logle.log( " compatibleface " + compatibleface);

    
   // // console.logle.log("compatiblee " + compatible)
    
    
    
  };
 
  checkForFingerprints = async () => {
    let fingerprints = await LocalAuthentication.isEnrolledAsync()
    .then((val)=>{
    this.setState({ fingerprints:val });

    this.scanFingerprint()
    // console.logle.log( " isEnrolledAsync val" + val);

    })
    .catch((e)=>{
    // console.logle.log( " error" + e);

    });
  };
 
  scanFingerprint = async () => {
    console.log("scan fingerprint " + face)


     //this.setState({ loading: true })

    //  if(biometricCheck=1)
    //  {

     
    let result = await LocalAuthentication.authenticateAsync(
      { promptMessage: 'Sign into App with your Fingerprint or FaceId', 
      fallbackLabel: 'Use your iPhone passcode to sign into App', }
    );
   // biometricCheck=0

    // console.logle.log('Scan Result:', result.success + " userid " + this.state.userid);

        //this.setState({ loading: true })

    // this.setState({
    //   result: JSON.stringify(result),
    // });

    let user = await get("first_login")


    // if(result.success ==  true)
    // {
      //face=1

     

       // console.logle.log('Biometric login params '+  params );

       if(result.success==undefined)
       {
        this.props.navigation.navigate('AuthLoading');

       }
       else if(result.success == false)
       {
         this.setState({ loading: false,        failedCount: this.state.failedCount + 1,
          })
        //  biometricCheck=1
        //this.props.navigation.navigate('AuthLoading');

       }
       else
       {
        let userid =await get("USER_ID")
        let tok = await get("fcmtoken")

        let token = JSON.parse(tok)
        
        if(userid != 0 && userid != undefined)
        {
          var id = userid
          const params = {id};


        BiometricLogin(params)
        .then(res => {
         // console.logle.log("res " + JSON.stringify(res))
       //  biometricCheck=1

         if(res.data.token !== undefined)
         {
         // biometricCheck=1

          // this.setState({ loading: false,        failedCount: this.state.failedCount + 1,
          // })

          var user_id = this.state.userid
          var fcm_token = token

          const params = {user_id,fcm_token};
          sendFcmToken(params)
          .then(res => {
            console.log("fcm token sent")
          })
          .catch(e=>{

          })

  
          result = false
          
          if(user ==1 ){
            //face=1
            this.setState({ loading: false,       
              // failedCount: this.state.failedCount + 1,
            })
    
            // console.logle.log("User Login")
            this.props.navigation.navigate('HomeScreen');
            set(false,"is_merchant")
          }
          if(user == 2){
            // console.logle.log("Merchant Login")
             this.props.navigation.navigate('Merchant');
          }
          if(user == 3){
            // console.logle.log("Creator Login")
             this.props.navigation.navigate('Creator');
          }
  
           //this.props.navigation.navigate('HomeScreen' )
         }
          else{
            this.setState({ loading: false })
            alert("Error authenticating user")
            //biometricCheck=1
          }  
  
          })
          .catch(e => {
           // biometricCheck=1
            this.setState({ loading: false })
            // console.logle.log("error", e);
  
            alert("Get Registered first")
            this.props.navigation.navigate('Register')
          });

        }else
        {
        //  biometricCheck=1
          this.setState({ loading: false })
  
          alert("Get Registered first")
          this.props.navigation.navigate('Register')
        }

    
      //}

     
    }
  };

  fingerPrintScan =() => {
    // console.logle.log("fingerprinttt ")
    if(Platform.OS === 'android')
    { 
      // this.showAndroidAlert()
      // this.scanFingerprint();
      this.setModalVisible(!this.state.modalVisible);
    }
    else{
     this.scanFingerprint()
    }
  }

  showAndroidAlert = () => {
    Alert.alert(
      'Fingerprint Scan',
      'Place your finger over the touch sensor and press scan.',
      [
        {
          text: 'Scan',
          onPress: () => {
            this.scanFingerprint();
          },
        },
        {
          text: 'Cancel',
          onPress: () =>  console.log('Cancel'),
          style: 'cancel',
        },
      ]
    );
  };

  login  = async() =>{ 
    let user = await get("first_login")
    let tok = await get("fcmtoken")

    let token = JSON.parse(tok)

    this.setState({ loading: true })

    if(this.state.number != '' && this.state.userid != 0 )
    {
    var id = this.state.userid
    var pin = this.state.number

    const params = {pin,id};

    // console.logle.log("params " +JSON.stringify( params) + " user " + user)

    Login(params)
     .then(res => {
       this.setState({ loading: false }); 
      // console.logle.log("res " + JSON.stringify(res.data))

      if(res.data.message == "Success")
      {
             var user_id = this.state.userid
            var fcm_token = token

            const params = {user_id,fcm_token};
            sendFcmToken(params)
            .then(res => {
              console.log("fcm token sent"+res)

            })
            .catch(e=>{

            })



        if(user ==1 ){
          // console.logle.log("User Login")
          this.props.navigation.navigate('HomeScreen');
          set(false,"is_merchant")
        }
        if(user == 2){
          // console.logle.log("Merchant Login")
           this.props.navigation.navigate('Merchant');
        }
        if(user == 3){
          // console.logle.log("Creator Login")
           this.props.navigation.navigate('Creator');
        }
        // if(user)
        // {
        //   // console.logle.log("User Login")
        //   this.props.navigation.navigate('HomeScreen');
        //   set(false,"is_merchant")
        // }

      }
       else{
        alert("PIN incorrect")
        // this.setState({ show: false})
        // setTimeout(function(){
        //   _this.setState({ show: true})
    
        // }, 2000);

        this.setState({ show: false})

        Alert.alert(  
         '',
         'PIN incorrect',  
          [    
             {text: 'OK', onPress: () => this.setState({ show: true})
           },  
          ]  
     );

       }    
     })
     .catch(e => { 
       this.setState({ loading: false })

       this.setState({ show: false})

       Alert.alert(  
        '',
        'PIN incorrect',  
         [    
            {text: 'OK', onPress: () => this.setState({ show: true})
          },  
         ]  
    ); 
      // alert("PIN incorrect")


       
     });
    }
    else
    {
      this.setState({ loading: false }); 
      alert("Enter pin to login or Register first")
    }
  } 

  stoprefresh=()=>{
  LocalAuthentication.cancelAuthenticate()
  
  }
render()
    {
      // if(this.state.faceidCheck ) 
      // {
      //   return (
      //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,backgroundColor:'red'}}>
      //     <Text>Loading</Text>
      //     <ActivityIndicator />
      //   </View>
      //   )
      // }
  
      

      // console.logle.log("this.state.biometricsettings " + this.state.biometricsettings)
    return (
       <LinearGradient colors={['#048de3', '#024875']} style={{ flex: 1,
        flexDirection: 'column',paddingTop:50,
        justifyContent: 'flex-start'}}> 

      <View style={styles.container}>
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


        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onShow={this.scanFingerprint}>
          <View style={ModalStyles.modal}>
            <View style={ModalStyles.innerContainer}>
              <Text>Sign in with fingerprint</Text>
              <Image
                style={{ width: 128, height: 128 }}
                source={require('../../../assets/thumb.png')}
              />
              {this.state.failedCount > 5 && (
                <Text style={{ color: 'red', fontSize: 14 }}>
                  Failed to authenticate, press cancel and try again.
                </Text>
              )}
              <TouchableHighlight
                onPress={async () => {
                  LocalAuthentication.cancelAuthenticate();
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text style={{ color: 'red', fontSize: 16 }}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>


    {/* <Image 
         source={require('../../../assets/koopa.png')} /> */}
      <Logo width={115} height={107} />




      <View style={{     
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      marginTop: 30,
      borderBottomWidth: 1, 
      borderBottomColor: '#a5a5a4', 
       width: '50%', color: 'white'
      }}>   
      <Image style={{ height: 20, width: 20, marginTop: -10 }}
         source={require('../../../assets/pincode.png')} />

         
          {this.state.show ?
        <TextInput
            keyboardType={"numeric"} 
            secureTextEntry={true}
            autoFocus={true}
            autoCorrect={false}
            //editable= {false}  styles.ViewContainer
            style={{ paddingTop: 0,
              paddingBottom: 0, textAlign: 'left', color: 'white',  height:35, marginTop: -10, width:100
            }}
            placeholder="PIN Code"
            paddingLeft={10}
            placeholderTextColor="white"
            textContentType="oneTimeCode"
            maxLength={4}            
            value={this.state.number}
            onChangeText={phone => { this.changeText(phone)}} />
            :
            <Text
            style={{ paddingTop: 0,
              paddingBottom: 0, textAlign: 'left', color: 'white',  height:35, marginTop: -10
            }}/>
          }
      </View>

      {/* <View style={styles.innerContainer}>   
          <VirtualKeyboard 
            color='black'
            pressMode='string'  
            applyBackspaceTint 
            onPress={(val) => this.changeText(val)} />
      </View> */}


      <TouchableOpacity 
            onPress ={()=> this.login()}
            style={{
            marginTop:25,
            backgroundColor: 'rgb(255, 255, 255)', 
            borderRadius: 10, 
            borderColor: 'rgb(194, 194, 194)',
            borderWidth: 2,
            width: 130.444,
            height: 41.444,
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center'
          }}
            //style={{flex:1,justifyContent:'center',alignItems:'center',marginTop:20}}
            >   
        <Text style={{
        fontSize :18,
        fontWeight: 'bold',
        color:"#048de3", 
         }}>Login </Text>
      </TouchableOpacity>

      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 5}}>
        {this.state.biometricsettings == 'false'?
        <View>
          </View>
          :
          <View>
            {
              this.state.compatible ? 
              <TouchableOpacity
                    onPress={() => this.fingerPrintScan()}
                  // onPress ={() => this.setModalVisible(!this.state.modalVisible)}
                    >
                    <Image   
                  source={require('../../../assets/thumbPrint.png')} />
              </TouchableOpacity>
              :
              <View/> 

              }
              {
              this.state.face ? 
              <TouchableOpacity
                      onPress={() => this.fingerPrintScan()}
                    //onPress={() => this.props.navigation.navigate('LoginScreen')}
                    >
                    <Image style={{ marginTop: 10,width :50 ,height:50}} 
              source={require('../../../assets/face.png')} />
              </TouchableOpacity>
              :
              <View/>
              }
            </View>}

        </View>
      </View>


          <View style={styles.BottomContainer}>   

            <TouchableOpacity
                  onPress={() =>
                    this.state.userid!=0? this.props.navigation.navigate('Forgot'): alert("You are not registered with this device.")}
                  >
                  <Text style={{fontSize :15,color:"#ffffff",textAlign:'center'}}>Forgot Pin? </Text>
            </TouchableOpacity>

            <TouchableOpacity
            //this.props.navigation.navigate('Register')}
                  onPress={() => 
                  //this.state.userid==0? this.props.navigation.navigate('Register'): alert("You are already registered with this device.")
                  this.props.navigation.navigate('Register',{'fromlogin':true})
                }
                  >
                  <Text style={{fontSize :15,marginBottom:5,color:"#ffffff", marginTop: 8}}>Register New Account?</Text>
            </TouchableOpacity>
          </View>
     </LinearGradient>
    
    );
  }
}
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    innerContainer :{
      marginTop:10,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    } ,
    BottomContainer :{
      //flex:1,

      justifyContent: 'flex-end',
      alignItems: 'center',
      margin: 20,
    } ,
    linearGradient: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center'
    },
     ViewContainer :{
    //  backgroundColor: '#ffffff',
      width :250,
      textAlign: 'left',
      color: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomColor: 'white',
      // borderRadius:10,
      borderBottomWidth:1,
      // borderColor :'#000000',
      marginTop:10,
      marginBottom: 30
      }
  });



  const ModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    paddingTop: Constants.statusBarHeight,
    padding: 8,
  },
  modal: {
    flex: 1,
    marginTop: '95%',
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    marginTop: '30%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    alignSelf: 'center',
    fontSize: 22,
    padding: 20,
  },
});

export default withNavigation(LoginScreen);
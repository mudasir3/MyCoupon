import React, { Component } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,TouchableOpacity ,KeyboardAvoidingView, 
  TextInput,Image,Platform, 
  ActivityIndicator,AppState
} from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import VirtualKeyboard from 'react-native-virtual-keyboard';
import Spinner from 'react-native-loading-spinner-overlay';

import {SetPin,ForgotPin,sendFcmToken} from "../API/ApiActions";
import {set,get} from "../LocalStorage";
import LinearGradient from 'react-native-linear-gradient';

import Logo from '../../../assets/Logo.svg';
var _this

export default class SetPinScreen extends Component {
  constructor(props) {

    
    super(props)
    // this.buildNameTextInput = React.createRef();

    _this =this;

    AppState.addEventListener('change', newState => {
      console.log('new state', newState);

      this.setState({ show: false})

      setTimeout(function(){
        _this.setState({ show: true})     
      }, 1);
     });

    console.disableYellowBox = true;
    this.state = {
      code: '',
      password: '',
      userid : 0,
      loading: false,
      forgot  : true,
      holding: true,
      show:true

  };
}

      // pinInput = React.createRef();

    componentDidMount(){
      this.UpdateStates();
    }
  
    UpdateStates() {
      this.setState({
        userid : this.props.navigation.getParam("userid" , "123"),
        forgot : this.props.navigation.getParam("forgot" , false)
      })
       setTimeout(()=>{
         this.setState({holding: false}) 
        },200); 
  
    }

      _checkCode = async(code) => {
        let tok = await get("fcmtoken")
        let token = JSON.parse(tok)

      this.setState({ loading: true }); 
      var pin = code
      var id = this.state.userid

      const params = {pin,id};
      console.log("params ",params);

      if(this.state.forgot == true)
      {
        this.forgotpassword(pin)
      }
      else
      {
      SetPin(params)
      .then(res => {
        this.setState({ loading: false });
        console.log("SETPIN ress ",JSON.stringify(res) );

        if(res.data.token !== undefined)
        {
          var user_id = this.state.userid
          var fcm_token = token

          const params = {user_id,fcm_token};
          sendFcmToken(params)
          .then(res => {

            set(id,"USER_ID")
            set(pin,"pin")
            set(1,"first_login")
  
            this.props.navigation.navigate('HomeScreen')
            
          })
          .catch(e=>{

          })


        }
        else
        {
          alert("please set your pin again")
        }       
      })
      .catch(e => {
        this.setState({ loading: false });
        console.log("error", e);
      });

  //  }
      }
    }
    forgotpassword = (pincode) => 
    {

      var pin = pincode
      var id = this.state.userid

      const params = {pin,id};

      console.log("ForgotPin params ",JSON.stringify(params) );


      ForgotPin(params)
      .then(res => {
        console.log("ForgotPin ress ",JSON.stringify(res) );

        if(res.data.status == "success")
        {
         // set(this.state.userid,"USER_ID")

         alert("pin reset successful")
          this.props.navigation.navigate('HomeScreen')
        }
        else
        {
          alert("please set your pin again")
        }       
      })
      .catch(e => {
        console.log("error", e);
      });


    }
    changeText(newText) {
      let numberLength = newText.length
      if(numberLength > 4){
      }else{ 
      if(numberLength >= 5){
          alert("Enter New pin")
      }
      else if(numberLength == 4){ 
        this.setState({code : newText});
        this._checkCode(newText);
      }else{
        this.setState({code : newText});
      }
    }
    }

    render()
    {
      if (this.state.holding) {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Loading</Text>
            <ActivityIndicator />
          </View>
        );
      }
        return (
          <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}>
          <KeyboardAvoidingView   style={styles.container} behavior="padding" enabled>

          <View style={styles.innerContainer}>
          <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.loading}
          //Text with the Spinner
          // textContent={'Loading...'}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
          {/* <Image 
               source={require('../../../assets/koopa.png')} /> */}


          <Logo width={111} height={103} />
  
            <Text style={{fontSize :20, fontStyle : 'italic',color: "#ffffff",marginTop:30}}> SET PIN</Text>
   
            <View
                style={{marginTop:20}}
                ></View>

              {this.state.show?

                <SmoothPinCodeInput
                   autoFocus = {true}
                    //editable= {false}
                    //ref={this.pinInput}
                    inputProps={{
                      keyboardType: "numeric" 
                    }}
                    keyboardType={"numeric"} 

                    cellStyle={{
                      borderWidth: 2,                   
                      borderColor: '#06931f',
                      backgroundColor: 'azure',
                    }}
                    value={this.state.code}
                    onTextChange={code => this.changeText(code)}
                    codeLength={4}
                    // onFulfill={()=> this._checkCode()}
                    onBackspace={this._focusePrevInput}
                />
                :
                null
              }



          {/* <VirtualKeyboard 
             color='black'
             pressMode='string' 
             applyBackspaceTint
             onPress={(val) => this.changeText(val)} /> */}

              <View
                 // onPress={() => this.props.navigation.navigate('HomeScreen')}
                  >
                    {/* <Text style={{fontSize :20, fontStyle : 'italic',color: "#ffffff",marginTop:50}}> Complete</Text> */}
              </View>

          </View>  
          </KeyboardAvoidingView>  
          </LinearGradient>            
        );
    }
}

const styles = StyleSheet.create({
  container: {
    marginTop:50,
    //backgroundColor: '#fff',
    alignItems: 'center',
    //justifyContent: 'flex-start',
  },
  innerContainer :{
    alignItems: 'center',
    justifyContent: 'center',
  } ,
  linearGradient: {
    flex: 1,
    justifyContent: 'center',
    // paddingLeft: 15,
    // paddingRight: 15,
    // borderRadius: 5
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  ViewContainer :{
     backgroundColor: '#eeeeee',
     width :50,
     padding:15,
     marginRight:5,
     alignItems: 'center',
     justifyContent: 'center',
     fontSize:20,
     borderRadius:10,
     borderWidth:1,
     borderColor :'#000000'
    },
    spinnerTextStyle: {
    color: '#FFF',
  },
});

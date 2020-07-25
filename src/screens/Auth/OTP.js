import React, { Component } from 'react';
import { StyleSheet, 
  Text, 
  View,
  TouchableOpacity,
  KeyboardAvoidingView, 
  TouchableWithoutFeedback ,
  TextInput,
  ActivityIndicator,
  Image,Keyboard,Platformm,AppState} from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import VirtualKeyboard from 'react-native-virtual-keyboard';

import {EnterOTP,ResendCode} from "../API/ApiActions";
import Spinner from 'react-native-loading-spinner-overlay';
import SmsRetriever from 'react-native-sms-retriever';
import {get} from "../LocalStorage";

import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationEvents } from 'react-navigation';

import Logo from '../../../assets/Logo.svg';

import DeviceInfo from 'react-native-device-info';

var tempmsg =0
var _this

export default class OTPScreen extends Component {
  constructor(props) {

    
    super(props)
    // this.buildNameTextInput = React.createRef();

    console.disableYellowBox = true;

    _this =this;

    AppState.addEventListener('change', newState => {
      console.log('new state', newState);

      this.setState({ show: false})

      setTimeout(function(){
        _this.setState({ show: true})     
      }, 1);
     });

    this.state = {
    code: '',
    password: '',
    userid : 0,
    number : 0,
    forgot  : "false",
    otpnumber : 0,
    resendTimer:true,
    loading: false,
    holding: true,
    otpCode :'',
    forgotid :0,
    eventDate:moment.duration().add({minutes:2,seconds:0}), 
    mins:2,
    secs:0,
    show:true

  };
}

    //pinInput = React.createRef();

    // constructor(props) {
      
    //     super(props)
    //     console.disableYellowBox = true;
    //   //this.buildNameTextInput = React.createRef();
    // }

    componentDidMount()
    {
      
         //this.textInputRef.focus()
         if(Platform.OS === 'ios')
         {
         }
         else
         {
          this._onSmsListenerPressed()
         }

          this.updateTimer()
          this.UpdateStates();
    
    // this.getuserid()
  }

  // getuserid = async() =>
  // {
  //   let user =await get("USER_ID")

  //   console.log("user " + user);

  //   this.setState({
  //     userid : user
  //   })
  // }
  
  
    UpdateStates() {
      this.setState({
      //  userid : this.props.navigation.getParam("userid"),
        userid : this.props.navigation.dangerouslyGetParent().getParam('userid'),
        number : this.props.navigation.dangerouslyGetParent().getParam("number", "123"),
        forgot : this.props.navigation.dangerouslyGetParent().getParam("forgot" , "false"),
        forgotid :this.props.navigation.dangerouslyGetParent().getParam("forgotid","0")

      })

      console.log("forgotid"+this.props.navigation.dangerouslyGetParent().getParam("number","0"))

       setTimeout(()=>{
         this.setState({holding: false}) 
        },200); 
  
    }




_onSmsListenerPressed = async () => {
    try {
      const registered = await SmsRetriever.startSmsRetriever();
      
      if (registered) {
        SmsRetriever.addSmsListener((val) => this._onReceiveSms(val));  
      }
      
      // alert(`SMS Listener Registered: ${registered}`);
    } catch (error) {
      //alert(`SMS Listener Error: ${JSON.stringify(error)}`);
    }
  };
  
  // Handlers
  
  validate(text) {
    num=/^[0-9]{4,4}$/
      if (num.test(text)) {
        this.setState({
          code : text
        })
        this._checkCode(text);
      }
      else {
        alert("Kindly enter otp manually.")
      }

   // this._checkCode(text);
  }
  
  
  _onReceiveSms = (event) => {
    
    // if(tempmsg==0)
    // {
    //   tempmsg=1
    

      console.log("Hello"+JSON.stringify(event))
      // alert(event.message);
      if(event.message!=undefined)
      {
        var otp = event.message.toString().slice(23,27);
        // alert("code"+otp); 
      
        //SmsRetriever.removeSmsListener();

        this.validate(otp);
         
      }

    //}
  }; 

    _checkCode = (codee) => {

      console.log("otp  ",codee );

      this.setState({ loading: true });
      var otp = codee

      var device_id = DeviceInfo.getUniqueId();
      console.log(JSON.stringify("DeviceID: "+device_id ))

      var id ;
      if(this.state.forgotid != undefined && this.state.forgotid !=0)
      {
        id = this.state.forgotid
      }
      else{
        id = this.state.userid
      }
      
      const params = {otp,id,device_id};

      EnterOTP(params)
      .then(res => {
        console.log("otp ress ",JSON.stringify(res ) );

        this.setState({ loading: false });

        if(res.data.message == "OTP Verified")
        {

          if(Platform.OS === 'android')
          {
            SmsRetriever.removeSmsListener();
          }
          else
          {
            
          }


          if(this.state.forgot == true)
          {
            this.props.navigation.navigate('SetPin',{"userid" :res.data.data[0].user.id,"forgot" : true })
          }
          else
          {
            if(res.data.data[0].user.id != undefined)
            {
              this.props.navigation.navigate('SetPin',{"userid" :res.data.data[0].user.id })
            }
            else
            {
              this.props.navigation.navigate('SetPin',{"userid" :res.data.data[0].user[0].id })

            }
          }
         // this.setState({ loading: false });
        //  this.props.navigation.navigate('SetPin',{"userid" :res.data.data[0].user.id })
        }
        else if(res.data.message == "Logout From Previous Device"){
          this.props.navigation.navigate('Auth')
          alert(res.data.message)
        }
        else
        {
          if(res.data.error.message =="OTP Not Valid" )
          {
            alert(res.data.error.message)
          }
          else
          {
            if(Platform.OS === 'android')
            {
              SmsRetriever.removeSmsListener();
            }
            else
            {

            }

            this.props.navigation.navigate('Auth')
            alert("OTP Incorrect")
          }
         
        }
        // else{
        //   //this.setState({ loading: false });
        //   alert("OTP is incorrect else ")
        // }       


      })
      .catch(e => {
        this.setState({ loading: false,code: '' });
        alert("OTP is incorrect")
        //this.props.navigation.navigate('Auth')

        console.log("error", e);
      }); 


    
   }

   ResendCode = () =>{
    this.setState({ loading: true });

     //var id = this.state.userid
     var mobile_number = this.state.number
     const params = {mobile_number};

     console.log("resend params " + params)
     ResendCode(params)
      .then(res => {
        console.log("ress " + JSON.stringify(res))

          if(res.data.status == "success")
          {
            alert("code send successful to given number")

            if(Platform.OS === 'ios')
            {
            }
            else
            {
             this._onSmsListenerPressed()
            }

            this.updateTimer()

            this.setState({
             // loading: false,
              resendTimer: true,
              eventDate:moment.duration().add({days:0,hours:0,minutes:2,seconds:0}),
             // days:0,
             // hours:0,
              mins:2,
              secs:0,
              userid:res.data.data[0].otp.id
            })
          }
          else{
            //this.setState({ loading: false });
            this.updateTimer()

            this.setState({
             // loading: false,
              resendTimer: true,
              eventDate:moment.duration().add({days:0,hours:0,minutes:2,seconds:0}),
             // days:0,
             // hours:0,
              mins:2,
              secs:0,
              //userid:res.data.data[0].otp.id
            })
            alert("Error resending OTP")
          }

          this.setState({ loading: false });

        })
        .catch(e => {
          this.setState({ loading: false });

          this.updateTimer()

          this.setState({
           // loading: false,
            resendTimer: true,
            eventDate:moment.duration().add({days:0,hours:0,minutes:2,seconds:0}),
           // days:0,
           // hours:0,
            mins:2,
            secs:0,
           // userid:res.data.data[0].otp.id
          })

          alert("Error resending OTP")
          console.log("error", e);
        });

    } 

  changeText(newText) {
    let numberLength = newText.length
    if(numberLength == 4){ 
      this.setState({code : newText});
      this._checkCode(newText);
    }else{
      this.setState({code : newText});
    }
  }

  updateTimer=()=>{
    
    console.log("updatetimer")
    const x = setInterval(()=>{
      let { eventDate} = this.state

      if(eventDate <=0){
        clearInterval(x)
      }else {
        eventDate = eventDate.subtract(1,"s")
       // const days = eventDate.days()
      //  const hours = eventDate.hours()
        const mins = eventDate.minutes()
        const secs = eventDate.seconds()
        
        this.setState({
         // days,
         // hours,
          mins,
          secs,
          eventDate
        })
      }

      if(eventDate ==0)
      {
        this.setState({
          resendTimer: false,

        })
        console.log("0000000000")
      }
    },1000)

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

      const { mins, secs } = this.state
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

            {/* <Text style={{fontSize :20, fontStyle : 'italic',marginTop:20}}> OTP</Text> */}

                {/* <TouchableWithoutFeedback 
                style={{marginTop:40}}
                onPress={Keyboard.dismiss} > */}
                <View
                style={{marginTop:50}}
                ></View>

              {this.state.show?

                <SmoothPinCodeInput
                    autoFocus = {true}
                    inputProps={{
                      textContentType:"oneTimeCode",
                      marginTop:20,
                      keyboardType: "numeric" 

                    }}
                    keyboardType={"numeric"} 

                    cellStyle={{
                      borderWidth: 2,                   
                      borderColor: '#06931f',
                      backgroundColor: 'azure',
                    }}
                    //editable= {false}
                    //ref={this.pinInput}
                    // ref={ref => this.textInputRef = ref}
                    value={this.state.code}
                    onTextChange={code => this.changeText(code)}
                    codeLength={4}
                    //onFulfill={()=> this._checkCode(this.state.code)}
                    onBackspace={this._focusePrevInput}
                  />
                  :
                  null
                }

                            {/* <TextInput
                                placeholder="Quiz Deck Title"
                                autoFocus={true}
                                value={this.state.code}
                                onChangeText={code => this.changeText(code)}
                                inputProps={{
                                  textContentType:"oneTimeCode",
                                  marginTop:20
                                }}
                            /> */}



                {/* </TouchableWithoutFeedback> */}

                {/* <TextInput 
                   // editable= {false}
                    placeholder="Enter your Pin" 
                    keyboardType={"numeric"} 
                    textContentType="oneTimeCode"
                    value ={this.state.code}
                    autoFocus={true}
                    onChangeText={phone => { this.changeText(phone)}} 
                    style={{fontSize :20,borderBottomWidth:1,width:250,height : 50}}></TextInput>  */}

          {/* <VirtualKeyboard 
             color='black'
             pressMode='string' 
             applyBackspaceTint
             onPress={(val) => this.changeText(val)} /> */}
    
            {this.state.resendTimer ? 
              <TouchableOpacity 
              disabled={true}
            // onPress ={()=> this.props.navigation.navigate('SetPin')}
                  >
                     <Text style={{fontSize :24, fontStyle : 'italic',marginTop:50,color:"white"}}> Re send</Text>
              </TouchableOpacity> 
               :

              <TouchableOpacity 
                  onPress={() => this.ResendCode()}
                  >
                     <Text style={{fontSize :24, fontStyle : 'italic',color:"#ffffff",marginTop:50}}> Re send</Text>
              </TouchableOpacity> 

              }
                
                <Text style={{fontSize :20, fontStyle : 'italic',color:"#ffffff",marginTop:10}}> {`${mins<10?"0"+ mins : mins} : ${secs<10?"0"+secs: secs}`}</Text>

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
  linearGradient: {
    flex: 1,
    justifyContent: 'center',
    // paddingLeft: 15,
    // paddingRight: 15,
    // borderRadius: 5
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  innerContainer :{
    alignItems: 'center',
    justifyContent: 'flex-start',
  } ,
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











// import React, { Component } from 'react';
// import { TextInput } from 'react-native';
// import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

// export default function UselessTextInput() {
//   const [value, onChangeText] = React.useState('1234');

//   return (
//                 <SmoothPinCodeInput
//                     autoFocus = {true}
//                     inputProps={{
//                       textContentType:"oneTimeCode",
//                       marginTop:20
//                     }}
//                     cellStyle={{
//                       borderWidth: 2,                   
//                       borderColor: 'mediumturquoise',
//                       backgroundColor: 'azure',
//                     }}

//                     value={value}
//                     onTextChange={code => this.onTextChange(value)}
//                     codeLength={4}
//                     //onFulfill={()=> this._checkCode(this.state.code)}
//                     // onBackspace={this._focusePrevInput}
//                 />
//   );
// }


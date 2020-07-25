import React, { Component } from 'react';
import { StyleSheet, Text, View,TouchableOpacity ,TextInput,Image, Keyboard,Platform,StatusBar, ActivityIndicator,KeyboardAvoidingView,AppState} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import RNPicker from "rn-modal-picker";

import {registerUser,checkDevice,signOut} from "../API/ApiActions";
import LinearGradient from 'react-native-linear-gradient';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {get,set} from "../LocalStorage";
import {SetPin} from "../API/ApiActions";

import Logo from '../../../assets/Logo.svg';
import DeviceInfo from 'react-native-device-info';

import BackButton from '../../../assets/backbtn.svg';


var _this
export default class ChangePinCodeScreen extends Component {
    
    constructor(props) {
        super(props)

        _this =this;

        AppState.addEventListener('change', newState => {
          console.log('new state', newState);
    
          this.setState({ show: false})
  
          setTimeout(function(){
            _this.setState({ show: true})     
          }, 1);
         });

        this.state = {
        code : '',
        loading: false,
        userid:0,
        type:0,
        show:true
        };      

    }

    componentDidMount = async() => {
        this.getuserid()

        this.setState({ show: false})

        // setInterval(() => {
        //   this.setState({
        //     show:true
        //   })
        // }, 2000);

        setTimeout(function(){
          _this.setState({ show: true})
        }, 100);

      }
    
      getuserid = async() =>
      {
        let user =await get("USER_ID")

        let usertype = await get("first_login")

        console.log("user " + user);
    
        this.setState({
          userid : user,
          type:usertype,
         // show:true
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

    changeText(newText) {
        let numberLength = newText.length
        if(numberLength > 4){
        }else{ 
        if(numberLength >= 5){
            //alert("Enter New pin")
        }
        else if(numberLength == 4){ 
            this.setState({code : newText});
            this._checkCode(newText);
        }else{
            this.setState({code : newText});
        }
        }
        }

    _checkCode = (code) => {

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
    
            if(res.data.token !== undefined)
            {
                set(pin,"pin")
                alert("Pin Changed Successfully")
                console.log( " this.state.type " +this.state.type)
                if(this.state.type ==1)
                {

                 this.props.navigation.navigate('HomeScreen')
                }
                else if(this.state.type ==2)
                {

                this.props.navigation.navigate('MerchantHome')

                }
                else if(this.state.type ==3){
                    this.props.navigation.navigate('CreatorHome')
                }
            }
            else
            {
              this.setState({code:'' });
              
            alert("please set your pin again")
            }       
        })
        .catch(e => {
            this.setState({ loading: false,
              code:'' });
            console.log("error", e);
        });
    
    //  }
        }
        }

    
    render()
    {
        return (
          <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}> 

          <TouchableOpacity
                style={{marginLeft:10 , marginTop: Platform.OS === 'ios' ? '10%' : StatusBar.currentHeight,
                marginRight: 15, alignSelf:'flex-start'}}
                onPress={() =>
                this.props.navigation.goBack()
              }
                >
                <BackButton width={22} height={22} />
          </TouchableOpacity>

           <KeyboardAvoidingView   style={styles.container} behavior="padding" enabled> 

            <View style={styles.innerContainer}>

              <Spinner
              visible={this.state.loading}/>

            <Logo width={111} height={103} />


              <Text style={{marginTop: 40,fontSize :26,color:"#ffffff" }}> Enter New Pincode</Text>

              <View style={{ 
                  alignSelf: 'center',
                  flexDirection:'row', 
                  justifyContent:'center',
                  marginTop:30,
                  }}>


                 {this.state.show?
                  <SmoothPinCodeInput
                  cellStyle={{
                    borderWidth: 2,                   
                    borderColor: '#06931f',
                    backgroundColor: 'azure',
                  }}
                  value={this.state.code}
                  onTextChange={code => this.changeText(code)}
                  codeLength={4}
                  autoFocus={true}
                  // onFulfill={()=> this._checkCode()}
                  onBackspace={this._focusePrevInput}
              />
              :
                  null
                 }
               
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
    flex:1,
    //alignItems: 'center',
    //justifyContent: 'flex-start',
  },
  innerContainer :{
    alignItems: 'center',
    justifyContent: 'center',
  } ,
  bottomContainer :{
    alignItems: 'flex-end',
    //justifyContent: 'center',
    //flexDirection:'row',
    
  } ,
  linearGradient: {
    flex: 1,
   // paddingLeft: 15,
   // paddingRight: 15,
   // borderRadius: 5,
    //backgroundColor:'#048de3'
  },
});



const Styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  },


  searchBarContainerStyle: {
    marginBottom: 10,
    flexDirection: "row",
    height: 40,
    shadowOpacity: 1.0,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1
    },
    backgroundColor: "rgba(255,255,255,1)",
    shadowColor: "#d3d3d3",
    borderRadius: 10,
    elevation: 3,
    marginLeft: 10,
    marginRight: 10
  },

  selectLabelTextStyle: {
    color: "white",
    textAlign: 'center',
    marginVertical: 15,
    width: 50,
    flexDirection: "row"
  },
  placeHolderTextStyle: {
    color: "white",
    textAlign: 'center',
    marginVertical: 15,
    width: 50,
    flexDirection: "row"
  },
  dropDownImageStyle: {
    width: 15,
    height: 15,
    alignSelf: "center"
  },
  listTextViewStyle: {
    color: "black",
    marginVertical: 10,
    flex: 0.9,
    marginLeft: 20,
    marginHorizontal: 10,
    textAlign: "left",

  },
  pickerStyle: {
    marginLeft: 10,
    elevation:0,
    paddingRight: 15,
    marginRight: 0,
    marginBottom: 0,
    width: 70,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#a5a5a4',
    flexDirection: "row"
  }
});
import React, { Component } from 'react';
import { StyleSheet, Text, View,TouchableOpacity ,TextInput,Image, Keyboard,Platform,StatusBar, ActivityIndicator,KeyboardAvoidingView,AppState} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import RNPicker from "rn-modal-picker";

import {registerUser} from "../API/ApiActions";
import LinearGradient from 'react-native-linear-gradient';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {get,set} from "../LocalStorage";

import Logo from '../../../assets/Logo.svg';
import BackButton from '../../../assets/backbtn.svg';

import { withNavigation } from 'react-navigation';

var _this;

 class OldPinCodeScreen extends Component {
    
    constructor(props) {
        super(props)

        _this=this;

        AppState.addEventListener('change', newState => {
          console.log('new state', newState);
    
          this.setState({ show: false})
  
          setTimeout(function(){
            _this.setState({ show: true})     
          }, 1);
         });

    this.state = {
      code : '',
      oldpin:'',
      loading: false,
      show: true,
    };
    }


    componentDidMount()
    {
      this.getPincode()

      const { navigation } = this.props;
      this.focusListener = navigation.addListener('didFocus', () => {
     
  
      });
      
    }

    getPincode =async()=>{

     let pin =await get("pin")

     console.log("pinn " +pin)
     this.setState({
         oldpin:pin
     })

    }
    changeText(newText) {
        let numberLength = newText.length
        if(numberLength > 4){
        }else{ 
        if(numberLength >= 5){
        }
        else if(numberLength == 4){ 
          this.setState({code : newText});
          this._checkCode(newText);
        }else{
          this.setState({code : newText});
        }
      }
      }

      _checkCode =  (code) => {

        this.setState({loading : true});

        var oldpin =JSON.parse(this.state.oldpin)

        if(oldpin == code)
        {
            this.setState({loading : false});
            this.setState({code:'' });
            //console.log("pinnnnnnnnnnnnn")
           
            this.props.navigation.navigate('ChangePincode')
        }else
        {
          this.setState({code:'' });
            this.setState({loading : false,code:''});

            alert("Pin incorrect")
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


              <Text style={{marginTop: 40,fontSize :26,color:"#ffffff" }}> Enter Old Pincode</Text>

                <View style={{ 
                  alignSelf: 'center',
                  flexDirection:'row', 
                  justifyContent:'center',
                  marginTop:30,
                  }}>

                 {this.state.show ?

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
    // backgroundColor: '#fff',
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
    //paddingLeft: 15,
    //paddingRight: 15,
    //borderRadius: 5
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

export default withNavigation(OldPinCodeScreen);
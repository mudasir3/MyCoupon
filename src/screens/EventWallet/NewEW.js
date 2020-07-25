import React, { Component } from 'react';
import { StyleSheet, Platform, StatusBar,
  View,Image,TouchableOpacity,TextInput,Text} from 'react-native';
import { Icon  } from "native-base"; 
import CustomHeader from '../../CustomHeader';
import {  Tab,Tabs } from 'native-base';
//import QRCode from 'react-native-qrcode';
import { QRCode } from 'react-native-custom-qr-codes-expo';
import { Button } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {NewEW,JoinEWMerchant,checkDevice,signOut} from "../API/ApiActions";
import {get,set} from "../LocalStorage";
import { StackActions, NavigationActions } from 'react-navigation';

import Logo from '../../../assets/backbtn.svg';

import Spinner from 'react-native-loading-spinner-overlay';

import RNPicker from "rn-modal-picker";

import DeviceInfo from 'react-native-device-info';

var _this;
export default class NewEWScreen extends Component {

  constructor(props) {
    super(props)
    _this=this;

  }

  state={
    creator_id :'',
    loading: false,
    name:'' ,
    contact_number :'',
    ew_status:'',
    user_id:0,
    merchantid:0,
    currency: "",
      selectedText: "",
      dataSource:[
         {"cc":"AED","symbol":"\u062f.\u0625;","name":"UAE dirham"},
         {"cc":"AFN","symbol":"Afs","name":"Afghan afghani"},
         {"cc":"ALL","symbol":"L","name":"Albanian lek"},
         {"cc":"AMD","symbol":"AMD","name":"Armenian dram"},
         {"cc":"ANG","symbol":"NA\u0192","name":"Netherlands Antillean gulden"},
         {"cc":"AOA","symbol":"Kz","name":"Angolan kwanza"},
         {"cc":"ARS","symbol":"$","name":"Argentine peso"},
         {"cc":"AUD","symbol":"$","name":"Australian dollar"},
         {"cc":"AWG","symbol":"\u0192","name":"Aruban florin"},
         {"cc":"AZN","symbol":"AZN","name":"Azerbaijani manat"},
         {"cc":"BAM","symbol":"KM","name":"Bosnia and Herzegovina konvertibilna marka"},
         {"cc":"BBD","symbol":"Bds$","name":"Barbadian dollar"},
         {"cc":"BDT","symbol":"\u09f3","name":"Bangladeshi taka"},
         {"cc":"BGN","symbol":"BGN","name":"Bulgarian lev"},
         {"cc":"BHD","symbol":".\u062f.\u0628","name":"Bahraini dinar"},
         {"cc":"BIF","symbol":"FBu","name":"Burundi franc"},
         {"cc":"BMD","symbol":"BD$","name":"Bermudian dollar"},
         {"cc":"BND","symbol":"B$","name":"Brunei dollar"},
         {"cc":"BOB","symbol":"Bs.","name":"Bolivian boliviano"},
         {"cc":"BRL","symbol":"R$","name":"Brazilian real"},
         {"cc":"BSD","symbol":"B$","name":"Bahamian dollar"},
         {"cc":"BTN","symbol":"Nu.","name":"Bhutanese ngultrum"},
         {"cc":"BWP","symbol":"P","name":"Botswana pula"},
         {"cc":"BYR","symbol":"Br","name":"Belarusian ruble"},
         {"cc":"BZD","symbol":"BZ$","name":"Belize dollar"},
         {"cc":"CAD","symbol":"$","name":"Canadian dollar"},
         {"cc":"CDF","symbol":"F","name":"Congolese franc"},
         {"cc":"CHF","symbol":"Fr.","name":"Swiss franc"},
         {"cc":"CLP","symbol":"$","name":"Chilean peso"},
         {"cc":"CNY","symbol":"\u00a5","name":"Chinese/Yuan renminbi"},
         {"cc":"COP","symbol":"Col$","name":"Colombian peso"},
         {"cc":"CRC","symbol":"\u20a1","name":"Costa Rican colon"},
         {"cc":"CUC","symbol":"$","name":"Cuban peso"},
         {"cc":"CVE","symbol":"Esc","name":"Cape Verdean escudo"},
         {"cc":"CZK","symbol":"K\u010d","name":"Czech koruna"},
         {"cc":"DJF","symbol":"Fdj","name":"Djiboutian franc"},
         {"cc":"DKK","symbol":"Kr","name":"Danish krone"},
         {"cc":"DOP","symbol":"RD$","name":"Dominican peso"},
         {"cc":"DZD","symbol":"\u062f.\u062c","name":"Algerian dinar"},
         {"cc":"EEK","symbol":"KR","name":"Estonian kroon"},
         {"cc":"EGP","symbol":"\u00a3","name":"Egyptian pound"},
         {"cc":"ERN","symbol":"Nfa","name":"Eritrean nakfa"},
         {"cc":"ETB","symbol":"Br","name":"Ethiopian birr"},
         {"cc":"EUR","symbol":"\u20ac","name":"European Euro"},
         {"cc":"FJD","symbol":"FJ$","name":"Fijian dollar"},
         {"cc":"FKP","symbol":"\u00a3","name":"Falkland Islands pound"},
         {"cc":"GBP","symbol":"\u00a3","name":"British pound"},
         {"cc":"GEL","symbol":"GEL","name":"Georgian lari"},
         {"cc":"GHS","symbol":"GH\u20b5","name":"Ghanaian cedi"},
         {"cc":"GIP","symbol":"\u00a3","name":"Gibraltar pound"},
         {"cc":"GMD","symbol":"D","name":"Gambian dalasi"},
         {"cc":"GNF","symbol":"FG","name":"Guinean franc"},
         // {"cc":"GQE","symbol":"CFA","name":"Central African CFA franc"},
         {"cc":"GTQ","symbol":"Q","name":"Guatemalan quetzal"},
         {"cc":"GYD","symbol":"GY$","name":"Guyanese dollar"},
         {"cc":"HKD","symbol":"HK$","name":"Hong Kong dollar"},
         {"cc":"HNL","symbol":"L","name":"Honduran lempira"},
         {"cc":"HRK","symbol":"kn","name":"Croatian kuna"},
         {"cc":"HTG","symbol":"G","name":"Haitian gourde"},
         {"cc":"HUF","symbol":"Ft","name":"Hungarian forint"},
         {"cc":"IDR","symbol":"Rp","name":"Indonesian rupiah"},
         {"cc":"ILS","symbol":"\u20aa","name":"Israeli new sheqel"},
         {"cc":"INR","symbol":"\u20B9","name":"Indian rupee"},
         {"cc":"IQD","symbol":"\u062f.\u0639","name":"Iraqi dinar"},
         {"cc":"IRR","symbol":"IRR","name":"Iranian rial"},
         {"cc":"ISK","symbol":"kr","name":"Icelandic kr\u00f3na"},
         {"cc":"JMD","symbol":"J$","name":"Jamaican dollar"},
         {"cc":"JOD","symbol":"JOD","name":"Jordanian dinar"},
         {"cc":"JPY","symbol":"\u00a5","name":"Japanese yen"},
         {"cc":"KES","symbol":"KSh","name":"Kenyan shilling"},
         {"cc":"KGS","symbol":"\u0441\u043e\u043c","name":"Kyrgyzstani som"},
         {"cc":"KHR","symbol":"\u17db","name":"Cambodian riel"},
         {"cc":"KMF","symbol":"KMF","name":"Comorian franc"},
         {"cc":"KPW","symbol":"W","name":"North Korean won"},
         {"cc":"KRW","symbol":"W","name":"South Korean won"},
         {"cc":"KWD","symbol":"KWD","name":"Kuwaiti dinar"},
         {"cc":"KYD","symbol":"KY$","name":"Cayman Islands dollar"},
         {"cc":"KZT","symbol":"T","name":"Kazakhstani tenge"},
         {"cc":"LAK","symbol":"KN","name":"Lao kip"},
         {"cc":"LBP","symbol":"\u00a3","name":"Lebanese lira"},
         {"cc":"LKR","symbol":"Rs","name":"Sri Lankan rupee"},
         {"cc":"LRD","symbol":"L$","name":"Liberian dollar"},
         {"cc":"LSL","symbol":"M","name":"Lesotho loti"},
         {"cc":"LTL","symbol":"Lt","name":"Lithuanian litas"},
         {"cc":"LVL","symbol":"Ls","name":"Latvian lats"},
         {"cc":"LYD","symbol":"LD","name":"Libyan dinar"},
         {"cc":"MAD","symbol":"MAD","name":"Moroccan dirham"},
         {"cc":"MDL","symbol":"MDL","name":"Moldovan leu"},
         {"cc":"MGA","symbol":"FMG","name":"Malagasy ariary"},
         {"cc":"MKD","symbol":"MKD","name":"Macedonian denar"},
         {"cc":"MMK","symbol":"K","name":"Myanma kyat"},
         {"cc":"MNT","symbol":"\u20ae","name":"Mongolian tugrik"},
         {"cc":"MOP","symbol":"P","name":"Macanese pataca"},
         {"cc":"MRO","symbol":"UM","name":"Mauritanian ouguiya"},
         {"cc":"MUR","symbol":"Rs","name":"Mauritian rupee"},
         {"cc":"MVR","symbol":"Rf","name":"Maldivian rufiyaa"},
         {"cc":"MWK","symbol":"MK","name":"Malawian kwacha"},
         {"cc":"MXN","symbol":"$","name":"Mexican peso"},
         {"cc":"MYR","symbol":"RM","name":"Malaysian ringgit"},
         {"cc":"MZM","symbol":"MTn","name":"Mozambican metical"},
         {"cc":"NAD","symbol":"N$","name":"Namibian dollar"},
         {"cc":"NGN","symbol":"\u20a6","name":"Nigerian naira"},
         {"cc":"NIO","symbol":"C$","name":"Nicaraguan c\u00f3rdoba"},
         {"cc":"NOK","symbol":"kr","name":"Norwegian krone"},
         {"cc":"NPR","symbol":"NRs","name":"Nepalese rupee"},
         {"cc":"NZD","symbol":"NZ$","name":"New Zealand dollar"},
         {"cc":"OMR","symbol":"OMR","name":"Omani rial"},
         {"cc":"PAB","symbol":"B./","name":"Panamanian balboa"},
         {"cc":"PEN","symbol":"S/.","name":"Peruvian nuevo sol"},
         {"cc":"PGK","symbol":"K","name":"Papua New Guinean kina"},
         {"cc":"PHP","symbol":"\u20b1","name":"Philippine peso"},
         {"cc":"PKR","symbol":"Rs.","name":"Pakistani rupee"},
         {"cc":"PLN","symbol":"z\u0142","name":"Polish zloty"},
         {"cc":"PYG","symbol":"\u20b2","name":"Paraguayan guarani"},
         {"cc":"QAR","symbol":"QR","name":"Qatari riyal"},
         {"cc":"RON","symbol":"L","name":"Romanian leu"},
         {"cc":"RSD","symbol":"din.","name":"Serbian dinar"},
         {"cc":"RUB","symbol":"R","name":"Russian ruble"},
         {"cc":"SAR","symbol":"SR","name":"Saudi riyal"},
         {"cc":"SBD","symbol":"SI$","name":"Solomon Islands dollar"},
         {"cc":"SCR","symbol":"SR","name":"Seychellois rupee"},
         {"cc":"SDG","symbol":"SDG","name":"Sudanese pound"},
         {"cc":"SEK","symbol":"kr","name":"Swedish krona"},
         {"cc":"SGD","symbol":"S$","name":"Singapore dollar"},
         {"cc":"SHP","symbol":"\u00a3","name":"Saint Helena pound"},
         {"cc":"SLL","symbol":"Le","name":"Sierra Leonean leone"},
         {"cc":"SOS","symbol":"Sh.","name":"Somali shilling"},
         {"cc":"SRD","symbol":"$","name":"Surinamese dollar"},
         {"cc":"SYP","symbol":"LS","name":"Syrian pound"},
         {"cc":"SZL","symbol":"E","name":"Swazi lilangeni"},
         {"cc":"THB","symbol":"\u0e3f","name":"Thai baht"},
         {"cc":"TJS","symbol":"TJS","name":"Tajikistani somoni"},
         {"cc":"TMT","symbol":"m","name":"Turkmen manat"},
         {"cc":"TND","symbol":"DT","name":"Tunisian dinar"},
         {"cc":"TRY","symbol":"TRY","name":"Turkish new lira"},
         {"cc":"TTD","symbol":"TT$","name":"Trinidad and Tobago dollar"},
         {"cc":"TWD","symbol":"NT$","name":"New Taiwan dollar"},
         {"cc":"TZS","symbol":"TZS","name":"Tanzanian shilling"},
         {"cc":"UAH","symbol":"UAH","name":"Ukrainian hryvnia"},
         {"cc":"UGX","symbol":"USh","name":"Ugandan shilling"},
         {"cc":"USD","symbol":"US$","name":"United States dollar"},
         {"cc":"UYU","symbol":"$U","name":"Uruguayan peso"},
         {"cc":"UZS","symbol":"UZS","name":"Uzbekistani som"},
         {"cc":"VEB","symbol":"Bs","name":"Venezuelan bolivar"},
         {"cc":"VND","symbol":"\u20ab","name":"Vietnamese dong"},
         {"cc":"VUV","symbol":"VT","name":"Vanuatu vatu"},
         {"cc":"WST","symbol":"WS$","name":"Samoan tala"},
         {"cc":"XAF","symbol":"CFA","name":"Central African CFA franc"},
         {"cc":"XCD","symbol":"EC$","name":"East Caribbean dollar"},
         {"cc":"XDR","symbol":"SDR","name":"Special Drawing Rights"},
         {"cc":"XOF","symbol":"CFA","name":"West African CFA franc"},
         {"cc":"XPF","symbol":"F","name":"CFP franc"},
         {"cc":"YER","symbol":"YER","name":"Yemeni rial"},
         {"cc":"ZAR","symbol":"R","name":"South African rand"},
         {"cc":"ZMK","symbol":"ZK","name":"Zambian kwacha"},
         {"cc":"ZWR","symbol":"Z$","name":"Zimbabwean dollar"}
       ],
  placeHolderText: "Select Currency",
  show: false,


  }
static navigationOptions = { header: null };

componentDidMount(){
  this.getuserid()
  this.setState({
    merchantid : this.props.navigation.getParam("merchantid" , "00")
  })

  //console.log("merchantid " +this.props.navigation.getParam("merchantid" , "00"))

  const { navigation } = this.props;
  this.focusListener = navigation.addListener('didFocus', () => {

    this.setState({ show: false})

    setTimeout(function(){
      _this.setState({ show: true})

    }, 10);

  })

}

getuserid = async() =>
{
  let merchant =await get("Merchant_id")

  let user =await get("USER_ID")

  console.log("user " + merchant);

  this.setState({
    user_id : merchant
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
    else
    {
      
     // this.props.navigation.navigate('Auth')

    }
      
   })
   .catch(e => { 
     console.log("error", e);
  
   });
   
}

createNewEW =()=> {
  //this.setState({ loading: true })
    var creator_id = this.state.user_id
    var name = this.state.name
    var contact_number = this.state.contact_number
    var currency = this.state.currency
    var ew_status = 1

    console.log("name " + name + "  currency " + currency + " contact number " + contact_number)

    if(name =='')
    {
      alert("EW Name is required")
    }
    else if(contact_number =='')
    {
      alert("Contact Number is required")
    }
    else if(currency =='' || currency =="Select Currency")
    {
      alert("Please select Currency")
    }
    else
    {

      this.setState({ loading: true
       })

      console.log(" elseeeee ")


    const params = {creator_id,name,contact_number,currency,ew_status};

    console.log("params " +JSON.stringify( params))

    NewEW(params)
     .then(res => {
       this.setState({ loading: false })
      console.log("res " + JSON.stringify(res))

      if(res.data.status === "success")
      {
        set(creator_id,"NEWEWcreatorid")
        set(name,"NEWEWname")
        set(res.data.data.id,"NEWEWeventid")
        set(2,"first_login")

        this.setState({
          name :'',
          contact_number :'',
          currency :'',
          selectedText:"Select Currency",
        })

        // const popAction = StackActions.pop({
        //   n: 1,
        // });
        
        // this.props.navigation.dispatch(popAction);

      //  this.props.navigation.dispatch(StackActions.popToTop());

      //   const resetAction = StackActions.reset({
      //     index: 0,
      //     //actions:{}
      //     actions: [NavigationActions.navigate({ routeName: 'MerchHome' })],
      // });
      // this.props.navigation.dispatch(resetAction);

      alert("EW Created Successfully")

      this.props.navigation.goBack(null)
      
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
}


      _selectedValue(index, item) {
    this.setState({ selectedText: item.name + " " + item.symbol, currency: item.symbol,  });
  }

render()
    { 
    return (
        <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}>
                    <Spinner
                    //visibility of Overlay Loading Spinner
                    visible={this.state.loading}
                    //Text with the Spinner
                    // textContent={'Loading...'}
                    //Text style of the Spinner Text
                    textStyle={styles.spinnerTextStyle}
                    />

        {/* <CustomHeader /> */}
              <View style={{flexDirection:'row',alignSelf:'stretch',justifyContent:'space-between'}}>   

      <TouchableOpacity
            style={{ marginLeft:10 , marginTop: Platform.OS === 'ios' ? '10%' : StatusBar.currentHeight,
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

            <View>
                <Text
                    style={{fontSize:24,color:"#ffffff"}}>
                    New Event
                </Text> 

            </View>

            <View style={{margin:10,backgroundColor:"#054d77",padding:20,height:"100%"}}>

                <View style={{
                  flexDirection:'row',margin:10,height:50,
                  paddingLeft: 10, justifyContent: 'flex-start', alignItems: 'center',
                  backgroundColor:"#054A73",borderRadius:10}}>
                    {/* <View style={{width:"100%"}}>  */}
                    {this.state.show ?

                        <TextInput
                            placeholder ="EW Name"
                            autoFocus ={true}
                            value={this.state.name}
                            onChangeText={name => {
                              this.setState({ name : name });
                              }}
                            placeholderTextColor ="#ffffff"
                            style={{fontSize:16,color:"#ffffff",width:"100%"}}>                           
                        </TextInput> 
                        :
                          <Text
                          style={{ paddingHorizontal:5, textAlign: 'left', color: 'white',fontSize:16,color:"#ffffff"
                          }}>EW Name</Text>
                        }
                     {/* </View>      */}
                </View>


                <View style={{
                  flexDirection:'row',margin:10,height:50,
                  paddingLeft: 10, justifyContent: 'flex-start', alignItems: 'center',
                  backgroundColor:"#054A73",borderRadius:10}}>
                    {/* <View style={{width:"100%"}}>  */}
                        <TextInput
                            keyboardType={"numeric"} 
                            placeholder ="Contact Number"
                            value={this.state.contact_number}
                            onChangeText={contact_number => {
                              this.setState({ contact_number : contact_number });
                              }}
                            placeholderTextColor ="#ffffff"
                            style={{fontSize:16,color:"#ffffff",width:"100%"}}>                         
                        </TextInput> 
                     {/* </View>      */}
                </View>


                
                
                    <View style={{width:"100%"}} > 
                    
                    {/* <Text style={{fontSize: 10, color: 'white', marginLeft: 15}}>Select a Currency</Text> */}
                      <RNPicker
                      dataSource={this.state.dataSource}
                      dummyDataSource={this.state.dataSource}
                      defaultValue={false}
                      //pickerTitle={"Currency Picker"}
                      showSearchBar={true}
                      disablePicker={false}
                      changeAnimation={"none"}
                      searchBarPlaceHolder={"Search....."}
                      showPickerTitle={true}
                      searchBarContainerStyle={this.props.searchBarContainerStyle}
                      pickerStyle={Styles.pickerStyle}
                      pickerItemTextStyle={Styles.listTextViewStyle}
                      selectedLabel={this.state.selectedText}
                      placeHolderLabel={this.state.placeHolderText}
                      selectLabelTextStyle={Styles.selectLabelTextStyle}
                      placeHolderTextStyle={Styles.placeHolderTextStyle}
                      dropDownImageStyle={Styles.dropDownImageStyle}
                      dropDownImage={require("../../../assets/dropDown.png")}
                      selectedValue={(index, item) => this._selectedValue(index, item)}
                    />

                </View>

                <TouchableOpacity 
                    onPress ={()=> this.createNewEW()}                   
                    style={{margin:10,height:50,backgroundColor:"#1B5C82",justifyContent:'center',alignItems:'center',borderRadius:10}}>
                    <View style={{width:"100%",justifyContent:'center',alignItems:'center'}}> 
                        <Text
                            style={{fontSize:16,color:"#ffffff"}}>
                            Create EW
                        </Text> 
                     </View>     
                </TouchableOpacity>

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
      marginTop:5,
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









  const Styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center"
    },
  
    searchBarContainerStyle: {
      marginBottom: 10,
      flexDirection: "row",
      height: 40,
    //   shadowOpacity: 1.0,
    //  shadowRadius: 5,
    //   shadowOffset: {
    //     width: 1,
    //     height: 1
    //   },
      backgroundColor: "rgba(255,255,255,1)",
      //shadowColor: "#d3d3d3",
      borderRadius: 10,
      elevation: 3,
      marginLeft: 10,
      marginRight: 10
    },
  
    selectLabelTextStyle: {
      color: "#000",
      textAlign: "left",
      width: "99%",
      color: "#D3D3D3",

      padding: 10,
      flexDirection: "row"
    },
    placeHolderTextStyle: {
      color: "#D3D3D3",
      padding: 10,
      textAlign: "left",
      width: "99%",
      flexDirection: "row"
    },
    dropDownImageStyle: {
      marginLeft: 10,
      width: 10,
      height: 10,
      alignSelf: "center"
    },
    listTextViewStyle: {
      color: "#000",
      marginVertical: 10,
      flex: 0.9,
      marginLeft: 20,
      marginHorizontal: 10,
      textAlign: "left"
    },
    pickerStyle: {
      marginLeft: 18,
      elevation:3,
      paddingRight: 25,
      marginRight: 10,
      marginBottom: 2,
     // shadowOpacity: 1.0,
      // shadowOffset: {
      //   width: 1,
      //   height: 1
      // },
      //borderWidth:1,
     // shadowRadius: 10,
      backgroundColor: "#054A73",
      //shadowColor: "#d3d3d3",
      borderRadius: 5,
      flexDirection: "row"
    }
  });
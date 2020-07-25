import React, {Component } from 'react';
import { Text, View, StyleSheet, Button,
  Platform, StatusBar ,TextInput,KeyboardAvoidingView,TouchableOpacity,Image,AppState} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

 import { BarCodeScanner } from 'expo-barcode-scanner';

 import {transaction,cashout,checkDevice,signOut} from "../API/ApiActions";
 import * as Permissions from 'expo-permissions';
 import {set,get} from "../LocalStorage";

 import Spinner from 'react-native-loading-spinner-overlay';
 import DeviceInfo from 'react-native-device-info';

 import Logo from '../../../assets/backbtn.svg';

 
 var _this

export default class ScanQRMerchant extends Component{

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

    this.state={
      payerid:0,
      payerType:'',
      EWId:0,
      receiverid:0,
      receivertype :'',
      tokens:'',
      hasCameraPermission: null,
      scanned: false,
      cashout :false,
      loading:false,
      show:true

    }
  }
  // state={
  //   payerid:0,
  //   payerType:'',
  //   EWId:0,
  //   receiverid:0,
  //   receivertype :'',
  //   tokens:0,
  //   hasCameraPermission: null,
  //   scanned: false,
  // }


  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    console.log("permissionsss " + status)

    this.setState({ hasCameraPermission: status === 'granted' });
  }


  componentDidMount() {
    this.getPermissionsAsync();

    //this.getUserdetails()
    this.getuserid()
    if(this.props.navigation.getParam("balance" , "") >0)
    {
      this.setState({
        //payerid : this.props.navigation.getParam("userid" , "00"),
        // payerType : this.props.navigation.getParam("userType" , "00")
        cashout:this.props.navigation.getParam("cashout" , false),
        tokens :this.props.navigation.getParam("balance" , "")
       })
    }
    else
    {
      this.setState({
        //payerid : this.props.navigation.getParam("userid" , "00"),
        // payerType : this.props.navigation.getParam("userType" , "00")
        cashout:this.props.navigation.getParam("cashout" , false),
        tokens :''
       })
    }


    console.log("tokenss "+ this.props.navigation.getParam("tokens" , false))

  }


  getuserid=async ()=>{
    let merchant =await get("Merchant_id")
    let user =await get("USER_ID")


    setInterval(() => {
      set(0, 'pay')

    }, 2000);
    
    console.log("user " + merchant);

    this.setState({
      payerid : merchant,
      payerType:"merchant"

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

      }
        
     })
     .catch(e => { 
       console.log("error", e);

     });
     
  }
  handleBarCodeScanned =  ({data })=> {
    console.log("handleBarCodeScannedddddddd")

    //setScanned(true);
    this.setState({ scanned: true });

    console.log("dataaa " + data)

     var d = data;
     d= d.split(" ");
    
      this.setState({
      EWId:d[0],
      receiverid:d[1],
      receivertype :d[2]
      })
    
    console.log(d[0]);
    console.log(d[1]);
     console.log(d[2]);
 
    //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    
    if(this.state.tokens == 0)
    {
      alert("Please eneter token quanitity")
    }
    else
    {
      console.log("this.state.cashout " + this.state.cashout)

      this.state.cashout?
      this.Cashout(data)
      :
      this.scanQR(data)
    }
  
    
  };

  Cashout =(data)=>{
    this.setState({ loading: true })

    console.log("cashoutttttttttttttttt" + data)
    var d = data;
    d= d.split(" ");
  
    var event_wallet_id = d[0]
    var merchant_id  = this.state.payerid
    var event_creator_id  = JSON.parse( d[1])
    var tokens  = this.state.tokens

    const params = {event_wallet_id,merchant_id,event_creator_id,tokens};

    console.log("params " + JSON.stringify(params))

    cashout(params)
     .then(res => {
      // this.setState({ loading: false }); 
      console.log("res " + JSON.stringify(res.data))

      var message = res.data.message
      this.setState({ loading: false })

       if(res.data.message == "Transaction made successfully")
       {
        this.props.navigation.goBack(null)
      }

      alert(message)

      // if(res.data.message === "Success")
      // {
      //   this.props.navigation.navigate('HomeScreen' )
      // }
      //  else{
      //   alert("PIN incorrect")
      //  }    
     })
     .catch(e => { 
       this.setState({ loading: false })
       console.log("error", e);
     });
  }

  scanQR =(data) =>{
    this.setState({ loading: true })

    var ismerchant;

    var d = data;
    d= d.split(" ");
    
    if(this.state.payerType =='merchant')
    {
      ismerchant=1
    }
    else{
      ismerchant=0
    }

    var event_wallet_id = d[0]
    var is_merchant  = ismerchant
    var id  = 0
    var payer_id  = this.state.payerid
    var payer_type  = this.state.payerType
    var receiver_id  = d[1]
    var receiver_type  = d[2]
    var tokens  = this.state.tokens

    // var event_wallet_id = 13
    // var is_merchant  = 0
    // var id  = 0
    // var payer_id  = 42
    // var payer_type  = 0
    // var receiver_id  = 41
    // var receiver_type  = 0
    // var tokens  = 10

    const params = {event_wallet_id,is_merchant,id,payer_id,payer_type,receiver_id,receiver_type,tokens};

    console.log("params " + JSON.stringify(params))

    transaction(params)
     .then(res => {
      // this.setState({ loading: false }); 
      console.log("res " + JSON.stringify(res.data))

      var message = res.data.message
      this.setState({ loading: false })

      alert(message)

      if(res.data.message == "Transaction made successfully")
      {
        this.props.navigation.goBack(null)
      }
      
      // if(res.data.message === "Success")
      // {
      //   this.props.navigation.navigate('HomeScreen' )
      // }
      //  else{
      //   alert("PIN incorrect")
      //  }    
     })
     .catch(e => { 
       this.setState({ loading: false })
       console.log("error", e);
     });

  }
render(){
  var tokens  = this.state.tokens
  tokens =tokens.toString()
  
  console.log("cashout " + this.state.cashout)
  const { hasCameraPermission, scanned } = this.state;

  if (hasCameraPermission === null) {
    return <LinearGradient colors={['#048de3', '#024875']} style={{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'blue'
    }}>
    <Text style={{ fontSize: 15, color: 'white'}}>Requesting for camera permission</Text>
    </LinearGradient>
    
  }
  if (hasCameraPermission === false) {
        this.props.navigation.goBack();
    return (
      <LinearGradient colors={['#048de3', '#024875']} style={{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'blue'
    }}>
    <Text style={{ fontSize: 15, color: 'white'}}>Permission Denied</Text>
    </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={['#048de3', '#024875']} style={{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: 'blue'
    }}>

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

      <Spinner
          visible={this.state.loading}
        />

<KeyboardAvoidingView styles={{alignItems: 'center', justifyContent: 'center'}} behavior="padding" enabled>

<View style={{ flexDirection:'column', 
alignItems: 'center', 
justifyContent: 'flex-end' }}>
    <Text style={{fontSize :15, fontWeight: 'bold', color: 'white'}}>Input transaction</Text>
    <Text style={{fontSize :15, fontWeight: 'bold', color: 'white'}}>amount and scan reciever qr code</Text>
    </View>
    
    <View style={{ height: "55%", width: 260, borderRadius: 15, borderColor:'white', borderWidth:2,margin:15,alignSelf:'center'}}>
    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
      style={StyleSheet.absoluteFillObject}
      //style={{ height: 300, width: 300 }}
    />
    

    {scanned && (
      <Button title={'Tap to Scan Again'}
      // onPress={() => setScanned(false)}
      onPress={() => this.setState({ scanned: false })}
        />
    )}
    </View>

    <View style={{ flexDirection:'row', alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{fontSize :30, fontWeight: 'bold', color: 'white', marginTop: -12}}>$</Text>

    {this.state.show?

      <TextInput 
      placeholder={'0.00'}
      autoFocus = {true}
      keyboardType={"numeric"} 
      value={tokens}
        onChangeText={tokens => {
          this.setState({ tokens : tokens });
          }}
      style={{ 
        marginTop: -10,
        width: '77%',
        fontSize: 20, color: 'black', 
        textAlign: 'left',
        paddingLeft:8,

        backgroundColor: 'white', 
        borderWidth: 2,
        borderColor: 'gray',
        borderRadius: 10
        }}></TextInput>
        :
        <Text
       style={{ 
         marginTop: -10,
         width: '77%',
         fontSize: 20, color: 'white', 
         textAlign: 'right',
         backgroundColor: 'white', 
         borderWidth: 2,
         borderColor: 'gray',
         borderRadius: 10,
         }}></Text>
        }

    </View>
    </KeyboardAvoidingView>

  </LinearGradient>
  );
      }
}

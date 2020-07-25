import React, {Component } from 'react';
import { Text, View, StyleSheet, Button, Platform, StatusBar ,TextInput,KeyboardAvoidingView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

 import { BarCodeScanner } from 'expo-barcode-scanner';

 import {transaction} from "../API/ApiActions";
 import * as Permissions from 'expo-permissions';
 import {get} from "../LocalStorage";
 import Spinner from 'react-native-loading-spinner-overlay';

export default class ScanQRCreator extends Component{

  constructor(props) {
    super(props)
    this.state={
      payerid:0,
      payerType:'',
      EWId:0,
      receiverid:0,
      receivertype :'',
      tokens:0,
      hasCameraPermission: null,
      scanned: false,
      loading:false

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

    this.getuserid()


    this.setState({ hasCameraPermission: status === 'granted' });
  }


  
  getuserid=async ()=>{
    let user =await get("Merchant_id")

    console.log("user " + user);

    this.setState({
      payerid : user,
      payerType:"creator"

    })

  }

  componentDidMount() {
    this.getPermissionsAsync();

    //this.getUserdetails()
   // this.getuserid()
    this.setState({
     // payerid : this.props.navigation.getParam("userid" , "00"),
     // payerType : this.props.navigation.getParam("userType" , "00")
    })

    console.log("payerType "+ this.props.navigation.getParam("userType" , "00"))

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
      this.scanQR(data)
    }
  
    
  };


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
    var is_merchant  = 1
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
 
         <Spinner
          visible={this.state.loading}
        />

<KeyboardAvoidingView styles={{alignItems: 'center', justifyContent: 'center'}} behavior="padding" enabled>

<View style={{ 
  flexDirection:'column', alignItems: 'center', 
  justifyContent: 'flex-end', marginTop: Platform.OS === 'ios' ? 35: StatusBar.currentHeight }}>
    <Text style={{fontSize :15, fontWeight: 'bold', color: 'white'}}>Input transaction</Text>
    <Text style={{fontSize :15, fontWeight: 'bold', color: 'white'}}>amount and scan reciever qr code</Text>
    </View>
    
    <View style={{ height: "50%", width: 280, borderRadius: 15, borderColor:'white', borderWidth:2,margin:20}}>
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
    <Text style={{fontSize :30, fontWeight: 'bold', color: 'white'}}>$</Text>
      <TextInput 
      //placeholder={'0.00'}
      autoFocus = {true}
      keyboardType={"numeric"} 
      value={this.state.tokens}
        onChangeText={tokens => {
          this.setState({ tokens : tokens });
          }}
      style={{ 
        marginTop: -10,
        width: '77%',
        fontSize: 20, color: 'black', 
        textAlign: 'right',
        backgroundColor: 'white', 
        borderWidth: 2,
        borderColor: 'gray',
        borderRadius: 10
        }}></TextInput>
    </View>

    </KeyboardAvoidingView>

  </LinearGradient>
  );
      }
}

import React from 'react';
import { Image, View,TouchableOpacity, Platform, Text,AsyncStorage, ActivityIndicator ,AppState,Keyboard } from "react-native";
import { createAppContainer,createSwitchNavigator} from 'react-navigation';
import { createStackNavigator, } from 'react-navigation-stack';
import { createDrawerNavigator, } from 'react-navigation-drawer';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import 'react-native-gesture-handler';

import LoginScreen from "./src/screens/Auth/Login";
import ForgetScreen from "./src/screens/Auth/Forgot";
import Transaction from "./src/screens/EventWallet/Transactions";
import TransactionMerchant from "./src/screens/EventWallet/TransactionMerchant";
import moment from 'moment';

import Token from "./src/screens/EventWallet/Token";
import RegisterNumberScreen from "./src/screens/Auth/RegisterNumber";
import CountryPicker from "./src/screens/Auth/CountryPicker"

import modals from "./src/screens/Auth/modal";
import OTPScreen from "./src/screens/Auth/OTP";
import SetPinScreen from "./src/screens/Auth/SetPin";
import HomeScreen from "./src/screens/EventWallet/HomeScreen"
import AllEventWalletsScreen from "./src/screens/EventWallet/AllEventWallets"
import MerchantAllEventWalletsScreen from "./src/screens/EventWallet/MerchantALLEW"
import CreatorAllEWScreen from "./src/screens/EventWallet/CreatorALLEW"

import EWDetailScreen from "./src/screens/EventWallet/EWDetail"
import MerchantEWDetailScreen from "./src/screens/EventWallet/MerchantEWDetails"
import CreatorEWDetailScreen from "./src/screens/EventWallet/CreatorEWDetail"


import CustomDrawerContentComponent from './src/HeaderComponent'
import SettingsScreen from "./src/settings"
import LoginMerchantScreen from "./src/screens/EventWallet/LoginMerchant"
import ChangeMerchantNameScreen from "./src/screens/EventWallet/ChangeMerchantName"

import SignOutScreen from "./src/screens/EventWallet/SignOut"

import {NavigationActions} from 'react-navigation';


import SwitchToCustomerScreen from "./src/screens/EventWallet/SwitchToCustomer"

import PendingRequests from "./src/screens/EventWallet/PendingRequests"
import ChangePincodeScreen from "./src/screens/EventWallet/ChangePinCode"

import OldPincodeScreen from "./src/screens/EventWallet/OldPin"

import NewEWScreen from "./src/screens/EventWallet/NewEW"

import ScanQr from "./src/screens/EventWallet/ScanQr";
import ScanQrMerchant from "./src/screens/EventWallet/ScanQRMerchant";

import LinearGradient from 'react-native-linear-gradient';

import * as Font from 'expo-font';

// import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import MerchantHome from './src/screens/EventWallet/MerchantHome';
import CreatorHome from './src/screens/EventWallet/CreatorHome';


import trans from './assets/transaction.png';
import refresh from './assets/refresh.png';

import {get,set} from './src/screens/LocalStorage';

import NavigationService from './src/screens/NavigationService';
import { create } from 'react-native-extended-stylesheet';
import ScanQRCreator from './src/screens/EventWallet/ScanQRCreator';

import SideMenu from './src/SideMenu';
import SideMenuMerchant from './src/SideMenuMerchant';
import SideMenuCreator from './src/SideMenuCreator';

import DeviceInfo from 'react-native-device-info';

import Logo from './assets/Home-icon.svg';

import AppLogo from './assets/Logo.svg';

import  { showMessage } from "react-native-flash-message";
import messaging from '@react-native-firebase/messaging';
import FlashMessage from "react-native-flash-message";



  CustomDrawerContentComponentWrapper = (props) => {   
    return ( <CustomDrawerContentComponent headerProps = {props} /> )
  }


  class AuthLoadingScreen extends React.Component {

    constructor() {
      super();
      this.getFirstTimeAuth();
   
      Font.loadAsync({
        'PoppinsMedium': require('./src/fonts/Poppins-Medium.ttf'),
      });

      this.state={
        appstatus :1
      }
      const uniqueId = DeviceInfo.getUniqueId();
      //console.log(JSON.stringify("DeviceID: "+uniqueId ))


    }

  
    componentDidMount(){
      
messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
     console.log("Tapped")
    });
    messaging().onMessage((payload) => {
    //alert(JSON.stringify(payload))
      showMessage({
        message: payload.notification.title,
        description: payload.notification.body,
        icon: "success",
        type: "success",
        duration:80000,
        onPress: () => {
         // alert("clicked")
         console.log('pressed')
        },
      });
    });
      messaging().getToken().then((currentToken) => {
      if (currentToken) {
        console.log("Tokennnn " + currentToken)

        set(currentToken,'fcmtoken')

      } else {
        alert('No Instance ID token available. Request permission to generate one.');
      }
    }).catch((err) => {
      alert('An error occurred while retrieving token. '+ err);
    });
    }

    getFirstTimeAuth = async () => {
      let user = await get("first_login")
    
    //console.log("first login " + user);      
    
    var converted;

    if(user)
    {
      var converted = JSON.parse(user)
    }
    
     if(user == "" || user =='' || converted=="first")
       {
         //console.log("else if Register")
        this.props.navigation.navigate('Register');
       }
       else{
        // console.log("Last Auth")
        this.props.navigation.navigate('Auth');
       }
    }
    
  

    render() {
      return (
        <LinearGradient colors={['#048de3', '#024875']} style={{flex:1,alignItems:'center',justifyContent:'center'}}>

          {/* <AppLogo width={160} height={145} /> */}
        </LinearGradient>
      );
    }
  }

  const RegisterStack =createStackNavigator({
    Register: {
      screen: RegisterNumberScreen,
      navigationOptions: {
        header: null,
    }
    },
    CountryPicker: {
      screen: CountryPicker,
      navigationOptions: {
        header: null,
      }
    },

    // OTP: {
    //   screen: OTPScreen,
    //   navigationOptions: {
    //     header: null,
    // }
    // },
    SetPin: {
      screen: SetPinScreen,
      navigationOptions: {
        header: null,
    }

    },
  },
  );

  // const ChangeCodeStack =createStackNavigator({
  //   OldPin:{
  //     screen:OldPincodeScreen,
  //     navigationOptions: {
  //       header: null,
  //   }
  //   },
  //   ChangePincode :{
  //     screen: ChangePincodeScreen,
  //     navigationOptions: {
  //       header: null,
  //     }
  //   },

  // },
  // );

  const ForgotNavigator = createStackNavigator({
    Forgot: {
      screen: ForgetScreen,
      navigationOptions: {
        header: null,
    }
    }
  })

  const OtpNavigator = createStackNavigator({
    OTP: {
      screen: OTPScreen,
      navigationOptions: {
        header: null,
    }
    }
  })



  const AuthNavigator = createStackNavigator({

    Login: {
      screen: LoginScreen,
      navigationOptions: {
        header: null,
    }
    },
    Register: {
      screen: RegisterNumberScreen,
    navigationOptions: {
      header: null,
    }
    },
    CountryPicker: {
      screen: CountryPicker,
      navigationOptions: {
        header: null,
      }
    },
    // CountryPicker: {
    //   screen: CountryPicker,
    //   navigationOptions: {
    //     header: null,
    //   }
    // },
  },
  );



  

  const CustomerEWNavigatorStack = createStackNavigator({
    AllEventWallets :{
      screen: AllEventWalletsScreen
    },
    EWDetail: {screen: EWDetailScreen,
      navigationOptions: {
       header: null} 
      
      },
  })

  const HomeNavigator = createStackNavigator({
    HomeCustomer: {
      screen: HomeScreen,
        navigationOptions: {
         header: null,
          drawerIcon: ({ tintColor }) => (
            <Image
              source={require("./assets/FacialRecognition.png")}
              resizeMode="contain"
              style={{ width: 20, height: 20,tintColor :tintColor}}
            />
          ),
        }
    
    },  
    ScanQr : { screen: ScanQr,
        navigationOptions: {
         header: null} 
          },

    // tabNav: {screen: TabNavigator,
    //     navigationOptions: {
    //      header: null} 
    //      },
    EWDetail: {screen: EWDetailScreen,
     navigationOptions: {
      header: null} 
      },

    AllEventWallets :{
      screen: AllEventWalletsScreen
    },
    OldPin:{
      screen:OldPincodeScreen,
      navigationOptions: {
        header: null,
    },
    ChangePincode :{
      screen: ChangePincodeScreen,
      navigationOptions: {
        header: null,
    }
    },
  

     }
  },


  );

  

const TabNavigator = createBottomTabNavigator(
          {
          Transaction: {
            screen: Transaction,
            navigationOptions: {
              header : null,
              tabBarIcon: ({tintColor}) => (
                                <View style={{flexDirection: 'column', 
                width:'100%', height: '100%', alignItems: 'center', justifyContent:'center',
                backgroundColor: tintColor}}>
                <Text style={{fontSize: 12, color: 'white'}}>Transaction</Text>
                </View>

              ),
            },
          },
            Ask: {
            screen: HomeNavigator,
            navigationOptions: {
              header : null,
              tabBarIcon: ({tintColor}) => (
                <View
                  style={{
                   // position: 'absolute',
                    bottom: 3, // space from bottombar #5a95ff
                    height: 50,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: tintColor,
                    borderColor:'#006400',
                    borderWidth: 0.5,
                    borderBottomWidth: 0,
                    shadowColor: "black",
                    shadowOffset: { height: 2},
                    shadowOpacity: 0.3,
                  }}>
                  {/* <Image
                    source={require('./assets/home.png')}
                    style={{
                      shadowColor : 'black',
                     // 
                    }}
                  /> */}
                              <Logo width={40} height={40} />

                </View>
              ),
            },
          },
          AllEvents: {
            screen: CustomerEWNavigatorStack,
            navigationOptions: {
              header : null,
              tabBarIcon: ({tintColor}) => (
                <View style={{flexDirection: 'column', 
                width:'100%', height: '100%', alignItems: 'center', justifyContent:'center',
                backgroundColor: tintColor}}>
                <Text style={{fontSize: 12, color: 'white'}}>All EW</Text>
                </View>
              ),
            },
          },
          },
          {
            initialRouteName: "Ask",
          tabBarOptions: {
            activeTintColor: '#048ce2',
            inactiveTintColor: 'green',
          
            showIcon: true,
            showLabel: false,
            style: {
              backgroundColor: 'green',
              height: 50
            },
           
          },
          },
);

const NewEWNavigatorStack = createStackNavigator({
  NewEW :{
    screen: NewEWScreen,
    navigationOptions: {
      header: null,
      }
  },
})

const MerchantEWNavigatorStack = createStackNavigator({
  MerchantAllEW :{
    screen: MerchantAllEventWalletsScreen
  }, 
    MerchantEWDetail: {
    screen: MerchantEWDetailScreen,
    navigationOptions: {
      header: null} 
    },
    NewEW :{
      screen: NewEWNavigatorStack,
      navigationOptions: {
        header: null,
        }
    },

})


const MerchantNavigatorStack = createStackNavigator({
  MerchantHome: {
    screen: MerchantHome,
    navigationOptions: {
      header: null,
      }
  },

  PendingRequests :{
    screen: PendingRequests
  },
  MerchantAllEW :{
    screen: MerchantAllEventWalletsScreen
  }, 
  ScanQr : { screen: ScanQrMerchant,
    navigationOptions: {
     header: null
      } 
    },
  MerchantEWDetail: {
    screen: MerchantEWDetailScreen,
    navigationOptions: {
      header: null
      } 
    },
    ChangePincode :{
      screen: ChangePincodeScreen,
      navigationOptions: {
        header: null,
    }
    },
    OldPin:{
      screen:OldPincodeScreen,
      navigationOptions: {
        header: null,
    },
    }

})

const TabNavigatorMerchant = createBottomTabNavigator(
          {
          Transaction: {
            screen: TransactionMerchant,
            navigationOptions: {
              header : null,
              tabBarIcon: ({tintColor}) => (
                                <View style={{flexDirection: 'column', 
                width:'100%', height: '100%', alignItems: 'center', justifyContent:'center',
                backgroundColor: tintColor}}>
                <Text style={{fontSize: 12, color: 'white'}}>Transaction</Text>
                </View>

              ),
            },
          },
    //       Transaction1: {
    //         screen: EWDetailScreen,
    //         navigationOptions: {
    //           header : null,
             
    //         },
    //         tabBarOptions: {
    //   visible: false
    // }
    //       },
            Home: {
            screen: MerchantNavigatorStack,
            navigationOptions: {
              header : null,
              tabBarIcon: ({tintColor}) => (
                <View
                  style={{
                   // position: 'absolute',
                    bottom: 3, // space from bottombar #5a95ff
                    height: 50,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: tintColor,
                    borderColor:'#006400',
                    borderWidth: 0.5,
                    borderBottomWidth: 0,
                    shadowColor: "black",
                    shadowOffset: { height: 2},
                    shadowOpacity: 0.3,
                  }}>
                  {/* <Image
                    source={require('./assets/home.png')}
                    style={{
                      shadowColor : 'black',
                     // 
                    }}
                  /> */}

           <Logo width={40} height={40} />

                </View>
              ),
            },
          },
          AllEvents: {
            screen: MerchantEWNavigatorStack,
            navigationOptions: {
              header : null,
              tabBarIcon: ({tintColor}) => (
                <View style={{flexDirection: 'column', 
                width:'100%', height: '100%', alignItems: 'center', justifyContent:'center',
                backgroundColor: tintColor}}>
                <Text style={{fontSize: 12, color: 'white'}}>All EW</Text>
                {/* <Text style={{fontSize :15, color: 'white', marginLeft: 5, marginBottom: 5}}>Events</Text> */}
                </View>
              ),
            },
          }
          },
          
          {
            initialRouteName: "Home",
          tabBarOptions: {
            activeTintColor: '#048ce2',
            inactiveTintColor: 'green',
            showIcon: true,
            showLabel: false,
            style: {
              backgroundColor: 'green',
              height: 50
            },
          },
          },
);


const CreatorNavigatorStack = createStackNavigator({
  CreatorHome: {
    screen: CreatorHome,
    navigationOptions: {
      header: null,
  }
  },

  // NewEW :{
  //   screen: NewEWScreen
  // },
  CreatorAllEW :{
    screen: CreatorAllEWScreen
  }, 
  ScanQr : { screen: ScanQRCreator,
    navigationOptions: {
     header: null} 
     }, 
    CreatorEWDetail: {
    screen: CreatorEWDetailScreen,
    navigationOptions: {
      header: null} 
    },
    ChangePincode :{
      screen: ChangePincodeScreen,
      navigationOptions: {
        header: null,
    }
    },
    OldPin:{
      screen:OldPincodeScreen,
      navigationOptions: {
        header: null,
    },
    }
    // ChangePincode :{
    //   screen: ChangePincodeScreen,
    //   navigationOptions: {
    //     header: null,
    // }
    // },
    // OldPin:{
    //   screen:OldPincodeScreen,
    //   navigationOptions: {
    //     header: null,
    // }
    // }

})


const CreatorEWNavigatorStack = createStackNavigator({
  CreatorAllEW :{
    screen: CreatorAllEWScreen
  }, 
    CreatorEWDetail: {
    screen: CreatorEWDetailScreen,
    navigationOptions: {
      header: null} 
    },
    NewEW :{
      screen: NewEWNavigatorStack,
      navigationOptions: {
        header: null,
        }
    },
}

)
      //  navigationOptions:()=>{
      //     return {
      //       tabBarVisible:false,
      //     };
      //  }

const TabNavigatorCreator = createBottomTabNavigator(
          {
          Transaction: {
            screen: TransactionMerchant,
            navigationOptions: {
              header : null,
              tabBarIcon: ({tintColor}) => (
                                <View style={{flexDirection: 'column', 
                width:'100%', height: '100%', alignItems: 'center', justifyContent:'center',
                backgroundColor: tintColor}}>
                <Text style={{fontSize: 12, color: 'white'}}>Transaction</Text>
                </View>

              ),
            },
          },
            Home: {
            screen: CreatorNavigatorStack,
            navigationOptions: {
              header : null,
              tabBarIcon: ({tintColor}) => (
                <View
                  style={{
                   // position: 'absolute',
                    bottom: 3, // space from bottombar #5a95ff
                    height: 50,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: tintColor,
                    borderColor:'#006400',
                    borderWidth: 0.5,
                    borderBottomWidth: 0,
                    shadowColor: "black",
                    shadowOffset: { height: 2},
                    shadowOpacity: 0.3,
                  }}>
                  <Image
                    source={require('./assets/home.png')}
                    style={{
                      shadowColor : 'black',
                     // 
                    }}
                  />
                </View>
              ),
            },
          },
          AllEvents: {
            screen: CreatorEWNavigatorStack,
            navigationOptions: {
              header : null,
              tabBarIcon: ({tintColor}) => (
                <View style={{flexDirection: 'column', 
                width:'100%', height: '100%', alignItems: 'center', justifyContent:'center',
                backgroundColor: tintColor}}>
                <Text style={{fontSize: 12, color: 'white'}}>All EW</Text>
                {/* <Text style={{fontSize :15, color: 'white', marginLeft: 5, marginBottom: 5}}>Events</Text> */}
                </View>
              ),
            },
          },
          },
          {
            initialRouteName: "Home",
          tabBarOptions: {
            activeTintColor: '#048ce2',
            inactiveTintColor: 'green',
            showIcon: true,
            showLabel: false,
            style: {
              backgroundColor: 'green',
              height: 50
            },
          },
          },
);

// export default createStackNavigator({Tabs}, {headerMode: "none"});







const appDrawerNavigator = createDrawerNavigator(
  {
    Home12: {
       screen: TabNavigator ,
       navigationOptions: {
       title: "Change Pin Code",

      headerStyle: {
        height: 200,
      }
    }
    },
    LoginMerchant: {
      screen: LoginMerchantScreen,
      navigationOptions: {
       title: "Change Pin Code",
    }
    },

  },
  {
  contentComponent: SideMenu,
  drawerWidth: 300,
  drawerPosition: "right",
  activeTintColor: 'white',
  inactiveTintColor: 'white'
}
);



const MerchantappDrawerNavigator = createDrawerNavigator(
  {
    Home12: {
       screen: TabNavigatorMerchant ,
       navigationOptions: {
       title: "Change Pin Code",
      headerStyle: {
        height: 200,
      }
    }
    },

    LoginMerchant: {
            screen: SwitchToCustomerScreen ,
       navigationOptions: {
       title: "Change Pin Code",

      headerStyle: {
        height: 200,
      }
    }
    },
    ChangeMerchantName: {
      screen: ChangeMerchantNameScreen ,
 navigationOptions: {
 title: "Change Pin Code",

headerStyle: {
  height: 200,
}
}
}

  },
  {
  contentComponent: SideMenuMerchant,
  drawerWidth: 300,
  drawerPosition: "right",
  activeTintColor: 'white',
  inactiveTintColor: 'white'
}
);



const CreatorDrawerNavigator = createDrawerNavigator(
  {
    Home: {
       screen: TabNavigatorCreator ,
       navigationOptions: {
       title: "Change Pin Code",

      headerStyle: {
        height: 200,
      }
    }
    },

    LoginMerchant: {
             screen: LoginMerchantScreen ,
       navigationOptions: {
       title: "Change Pin Code",

      headerStyle: {
        height: 200,
      }
    }
    }

  },
  {
  contentComponent: SideMenuCreator,
  drawerWidth: 300,
  drawerPosition: "right",
  activeTintColor: 'white',
  inactiveTintColor: 'white'
}
);

 const RootContainer =  createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth: AuthNavigator,
    Register : RegisterStack,
    HomeScreen: appDrawerNavigator,
    Forgot: ForgotNavigator,
    OTP: OtpNavigator,
    Merchant: MerchantappDrawerNavigator,
    Creator: CreatorDrawerNavigator, 
    SignOut :SignOutScreen 
    //changeCode:ChangeCodeStack
    //EWDetail: CustomerEWDetailNavigatorStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));


const headerStyle = {
  headerStyle: {
    backgroundColor: "#a78c52"
  },
  headerTintColor: "white",
  headerTitleStyle: {
    fontWeight: "bold",
    color: 'white'
  }
};

function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

var _this;
var intervalID;


export default class App extends React.Component {
  constructor(props) {
    super(props);

    _this =this

    intervalID = 0;
  }

  state={
    screen:'',
    eventDate:moment.duration().add({minutes:0,seconds:0}), 
    secs:0,
    date:''

  }
  componentDidMount() {
    if(Platform.OS=='ios')
    {
    AppState.addEventListener('change', this._handleAppStateChange);

    }
  }
  componentWillUnmount() {
    if(Platform.OS=='ios')
    {
     AppState.removeEventListener('change', this._handleAppStateChange);

    }
  }
  
  _handleAppStateChange = nextAppState => {
    if (nextAppState === 'background'|| nextAppState=='inactive') {
      var that = this;
      var date = new Date().getDate(); //Current Date
      var month = new Date().getMonth() + 1; //Current Month
      var year = new Date().getFullYear(); //Current Year
      var hours = new Date().getHours(); //Current Hours
      var min = new Date().getMinutes(); //Current Minutes
      var sec = new Date().getSeconds(); //Current Seconds
      this.setState({ date: date + month + year + hours + min + sec }, () =>
        this._storeData(this.state.date)
      );
      console.log('backgrounded');
    }
    if (nextAppState === 'active') {
      console.log('Active');
      var them = this;
      var dateGet = new Date().getDate(); //Current Date
      var monthGet = new Date().getMonth() + 1; //Current Month
      var yearGet = new Date().getFullYear(); //Current Year
      var hoursGet = new Date().getHours(); //Current Hours
      var minGet = new Date().getMinutes(); //Current Minutes
      var secGet = new Date().getSeconds(); //Current Seconds
      this.setState({ date: dateGet + monthGet + yearGet + hoursGet + minGet + secGet }, () =>
        this._retrieveData(this.state.date)
      );
    }
    this.setState({ appState: nextAppState });
  };
  _storeData = async timeStamp => {
    try {
      await AsyncStorage.setItem('counter', String(timeStamp));
    } catch (error) {
      console.log(error);
    }
  };
  _retrieveData = async (timeStamp) => {
    try {
      console.log("beforeeeeeeeeeeeeeeeeeeeeeee "+ this.state.screen)
      const value = await AsyncStorage.getItem('counter');
      const faceCheck = await AsyncStorage.getItem('faceCheck');
      const payCheck = await AsyncStorage.getItem('pay');
      const loginmerchant = await AsyncStorage.getItem('loginmerchant');

      if (value !== null) {
        // We have data!!
        var one = parseInt(value)
        var two = parseInt(timeStamp)
        var z = two - one
        
        console.log('Saved TimeStamp ' + one + " and Current "+ two);
        console.log("Time calculated: " + z + "  paycheck "+payCheck + "  facecheck " + faceCheck + "  loginmerchant " + loginmerchant)
        if(z > 6  && this.state.screen !== 'Login' && faceCheck != 1 && payCheck!=1  && loginmerchant!=1||
         z < 0 && this.state.screen !== 'Login' && faceCheck != 1 && payCheck!=1 && loginmerchant!=1)
         {
          NavigationService.navigate('AuthLoading')
          console.log("logoutttttttttttttttttttt "+ this.state.screen)
        }else{
          console.log("nothing")
        }
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  appstatelistner =(prevScreen,currentScreen)=>{
    var x =0

    AppState.addEventListener('change', newState => {
      //console.log('new state', newState);
    
      if( this.state.screen!="ScanQr" &&
       //newState!="background" &&
      this.state.screen!="HomeCustomer" &&
       this.state.screen!="MerchantHome"&&  
       this.state.screen!="Login" &&
        this.state.screen!="AuthLoading" && 
        this.state.screen!="Register" && 
        this.state.screen!="OTP" && 
        this.state.screen!="SetPin" && 
        this.state.screen!="LoginMerchant" &&
        this.state.screen != "Transaction" &&
          newState!='background'
        )
        {             
          NavigationService.navigate('AuthLoading')
        //  console.log("chal pawaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaan" + this.state.screen)
        }
      
      else
      {
       // console.log("elseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" +currentScreen)
      }

     });  
  }



  render() {
    const prefix = Platform.OS == 'android' ? 'myapp://' : 'myapp://';

    return <View style={{flex:1}}>
      <RootContainer

      uriPrefix={prefix}
      ref={navigatorRef => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }}
      onNavigationStateChange={(prevState, currentState) => {
        const currentScreen = getCurrentRouteName(currentState);
        const prevScreen = getCurrentRouteName(prevState);
  
        console.log(" previous " + prevScreen + " current " + currentScreen )

        this.setState({
          screen :currentScreen
        })
        
        if(Platform.OS=='android')
        {
                   this.appstatelistner(prevScreen,currentScreen)

        }
        
        
       // this.appstatelistner(currentScreen)


      }} 
       /> 
       
       <FlashMessage position="top" />

       </View>
  }
}


//export default createAppContainer(RootContainer);
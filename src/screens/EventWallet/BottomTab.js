import React from 'react';
import { Platform, Keyboard } from 'react-native';

import { createBottomTabNavigator } from 'react-navigation-tabs';


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
      screen: MerchantEWNavigatorStack,
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
        height: 50,
        //position:'absolute'
        bottom: 0
      },
    },
    },
);

class TabBarComponent extends React.Component {
  state = {
    visible: true
  }

  componentDidMount() {
  //  if (Platform.OS === 'android') {
      this.keyboardEventListeners = [
        Keyboard.addListener('keyboardDidShow', this.visible(false)),
        Keyboard.addListener('keyboardDidHide', this.visible(true))
      ];
   // }
  }

  componentWillUnmount() {
    this.keyboardEventListeners && this.keyboardEventListeners.forEach((eventListener) => eventListener.remove());
  }

  visible = visible => () => this.setState({visible});

  render() {
    if (!this.state.visible) {
      return null;
    } else {
      return (
        <BottomTabBar {...this.props} />
      );
    }
  }
}
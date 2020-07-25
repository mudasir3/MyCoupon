import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './SideMenu.style';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View, Switch} from 'react-native';
import {get,set} from "../src/screens/LocalStorage";

class SideMenu extends Component {
      state = {
                switchValue: true,
                switchValue2: true
            };

  componentDidMount(){
    this.getSettings()
  } 
  
  getSettings = async() =>
  {
    let biometric =await get("biometricSettings")
    if(biometric =='' || biometric == undefined ||biometric ==null)
    {
      set(true,"biometricSettings")
      this.setState({
        switchValue2:true
      })
      }else if(biometric == 'true') {
      this.setState({
        switchValue2:true
      })
      }
      else
      {
      this.setState({
        switchValue2:false
      })
      }
  }

  _handleToggleSwitch = async() => {
    console.log("switch 1 " + this.state.switchValue )

    set(!this.state.switchValue,"notificationSettings")

    this.setState(state => ({
      switchValue: !state.switchValue,
    }));
  }


  _handleToggleSwitch2 = () =>{
    console.log("switch 2" + this.state.switchValue2 )

    set(!this.state.switchValue2,"biometricSettings")

    this.setState(state => ({
      switchValue2: !state.switchValue2
    }));
  }


  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render () {
    return (
      <View style={styles.container}>

            <View style={styles.navSectionStyle}>
            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('OldPin')}>
              Change Pin Code
              </Text>

              <Text style={styles.navItemStyle} onPress={  
                this.navigateToScreen('Login')
                }>
                Switch Merchant
              </Text>
            
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%'}}>
              <Text style={styles.navItemStyle}>
                Turn Notifications
              </Text>
              <Switch
                onValueChange={this._handleToggleSwitch}
                value={this.state.switchValue}
                />
                </View>



              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%'}}>
              <Text style={styles.navItemStyle}>
                Turn Biometric
              </Text>
              <Switch
                onValueChange={this._handleToggleSwitch2}
                value={this.state.switchValue2}
                />
                </View>


              <Text style={styles.navItemStyle} onPress={  
              this.navigateToScreen('SignOut')
              }>
              Sign Out
              </Text>


              </View>
          



      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

export default SideMenu;
import React, { Component } from 'react';
import { StyleSheet, View,Image,TouchableOpacity,Text} from 'react-native';
export default class CustomHeader extends Component {

render()
    {
    return (
  <View style={styles.container}> 
            {/* <TouchableOpacity
            style={{borderColor: '#aaaaaa',width :150,padding:15,alignItems: 'center',justifyContent: 'center',borderRadius:30,borderWidth:1}}
            //onPress={() => this.props.navigation.navigate('LoginScreen')}
            >
            <Text style={{fontSize :20}}>Add New EW</Text>
          </TouchableOpacity> */}

           

          <Image
          style={{ marginRight: 10 }}
          source={require('../assets/settings.png')}
        />
      </View>
    );
  }
}
  
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'flex-end',
      flexDirection: 'row',
      height: 40,
      alignSelf: 'flex-end',
    },
  });
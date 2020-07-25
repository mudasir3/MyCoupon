import React, { Component } from 'react';
import { StyleSheet, View,Image,TouchableOpacity,Text} from 'react-native';
import { Icon  } from "native-base"; 

//import QRCode from 'react-native-qrcode';


export default class HomeScreen extends Component {

  constructor(props) {
    super(props)
  }

  static navigationOptions = ({ navigation }) => 
  ({
    headerLeft: (
        <View style={{ paddingLeft: 16 }}>
          <Icon
            name="md-menu"
            size={30}
            style={{ color: "#000000" }}
            onPress={() => navigation.toggleDrawer()}
          />
        </View>
      ),
      headerRight: (
        <View style={{ paddingRight: 10 }}>
          <Icon
            name="md-settings"
            size={30}
            style={{ color: "#000000" }}
            //onPress={() => navigation.toggleDrawer()}
          />
        </View>
      )
})

render()
    {
    return (
      <View style={styles.container}> 

       <Text>Token Screens</Text>
              
      </View>
    );
  }
}
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      //alignItems: 'center',
      //justifyContent: 'center',
      marginTop:30
    },
    innerContainer :{
        flex:1,
        alignItems: 'center',
        //justifyContent: 'center',
      } ,
      qrContainer :{
        flex:2,
        alignItems: 'center',
      },
       ViewContainer :{
       // backgroundColor: '#aaaaaa',
        width :250,
        padding:15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius:10,
        borderWidth:1,
        borderColor :'#000000'
        }
  });
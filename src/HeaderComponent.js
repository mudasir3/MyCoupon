import EStyleSheet from "react-native-extended-stylesheet";
import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { Container, Content, Text, Body, Header, View } from "native-base";

import { 
  DrawerItems
} from "react-navigation-drawer"; 
const navigationStyles = EStyleSheet.create({
  expImageStyles: {
    width: "80rem",
    height: "80rem",
  },
  userImageContainer: { width: "85rem", height: "85rem",  marginHorizontal: 15 },
  userImageStyles: { width: "85rem", height: "85rem", borderRadius: "42rem",  }
});

class CustomDrawerContentComponent extends React.Component {
 

  render() {  

    return (
      <Container>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height: 150,
            backgroundColor: "#D3D3D3"
          }}>
          <Image
            style={{ width: "100%", height: "100%", position: "absolute" }}
            resizeMode="contain"
            source={require("../assets/koopa.png")}
          />
        </View>

        <Content>
          {this.props.headerProps && <DrawerItems {...this.props.headerProps} />}
        </Content>
      </Container>
    );
  }
}
 
export default CustomDrawerContentComponent;

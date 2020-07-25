import { AsyncStorage } from "react-native";

 const set = async (value, key) => {
  try {
    const val = JSON.stringify(value)
    await AsyncStorage.setItem(key, val);
  } catch (error) {
    console.log(error);
  }
};

const get = async(key) =>  {
    try {
    const value = await AsyncStorage.getItem(key);  
     if(!value) {
        throw 'null'
     }
     console.log("value " + value);

     return value
    } catch (error) {
        if(error === 'null') {
            return ''
        }
      console.log("errorr " + error);
    }
  };
  
  
    export {set,get };

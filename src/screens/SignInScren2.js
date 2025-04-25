import React, { useState } from 'react';
import { Text, View,TextInput,Image } from 'react-native';

import { useNavigation } from '@react-navigation/native';


import styles from '../Styles/SignIn2Style';
import CustomButton from '../components/Button';
import CustomSwitch from '../components/Checkmark';
import PfpUpload from '../components/ImageInsert';

import { useSQLiteContext } from "expo-sqlite";
import { registerUser } from '../Database/db';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SigInScreen2({route,}) {
  const DB = useSQLiteContext();
  const navigation = useNavigation();

  const { name, password } = route.params || {};

  const [StayLogged,setStayLogged] = useState(false)
  const [Image,setImage] = useState('')

  const HandleSingIn = async() => {
    try{
      console.log("Submit button pressed"); 
      
      console.log("DB object: ", DB);
  
      console.log("HandleSingIn, Sends: ", name , password)
  
      await registerUser(name,password,Image,DB)
      navigation.reset({index: 0,routes: [{ name: 'Login' }],});

    } catch (error){ 

      console.error(error)

    }

  };

  const handleToggle = (value) => {
    
    setStayLogged(value)
    console.log(value)
    console.log(name)
    console.log(password)
    console.log("Route params:", route.params); 



  };

  const storeImage = async (imageUri,userName) => {

    try{

      const userDir = `${FileSystem.documentDirectory}users/${userName}/`;

      const dirInfo = await FileSystem.getInfoAsync(userDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(userDir, { intermediates: true });
      }

      const filename = `${userName}_profile.jpg`;
      const newPath = userDir + filename;
    
      await FileSystem.copyAsync({
        from: imageUri,
        to: newPath,
      });
    
      await AsyncStorage.setItem('profileImagePath', newPath); 
      return newPath;

    } catch (error){

      console.error(error)

    }

  };

  const handleImageSelected = async(imageUri) => {
    try{

      const imagePath = await storeImage(imageUri,name)
      setImage(imagePath);

      console.log("Profile picture Saved at:", imagePath);

    } catch(error) {

      console.error("Image Storing Failed:",error)
    }

  };

  return (

    <View style={styles.container}>


        <PfpUpload name={name} onImageSelected={handleImageSelected}/>

       
        <View style={styles.Toggle}>

          <Text style={styles.ToggleLabel}> Stay Logged In?</Text>
          <CustomSwitch  onToggle={handleToggle} />

        </View>
        

        <CustomButton 
          onPress={() => HandleSingIn()}
          buttonText="SUBMIT"

          anchura={110}
          altura={50}
          fontSize={19}
          
        />


      
    </View>
  );
}

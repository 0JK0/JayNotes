import React, { useState, useEffect } from 'react';
import { Text, View,TextInput } from 'react-native';

import CustomButton from '../components/Button';

import { useNavigation } from '@react-navigation/native';
import { useSQLiteContext } from "expo-sqlite";

import styles from '../Styles/LoginStyle';
import { validateCredentials,saveUserSession,getUserId } from '../Database/db';


export default function LoginScreen() {

  const DB = useSQLiteContext();

  // Init UseNavigation
  const navigation = useNavigation();

  // Getting Name AND Password Text
  const [Name, setName] = useState('')
  const [Password, setPassword] = useState('')

  const handleLogin = async() => {
     
    try{
      const valid =  await validateCredentials(Name,Password,DB);
      console.log("ANSWER FROM validateCredentials: ", valid)

      if(valid){

        const userId = await getUserId(Name, DB);

        if (userId === null) {
          console.log("User ID could not be retrieved.");
          return;
        }

        await saveUserSession(Name,userId);
        navigation.replace('Home', {name: Name,})

      } else {

        alert("User Not Found");

      }
      
      

    } catch(error) {

      console.error(error)

    }
    
  };

  return (

    <View style={styles.container}>

        <View style={styles.CustomButton}>
         <CustomButton 
         onPress={() => navigation.navigate('SigIn')}
         buttonText={"SIGN IN"}

         anchura={108}
         altura={45}
         fontSize={18}

         /> 
        </View>
        

        <Text style={styles.Text} > LOG IN </Text>

        <TextInput

          style={styles.TextInput} 
          placeholder='Name' 
          placeholderTextColor='#c6c3c3' 
          
          // Asing the Value of the TextInput to Name 
          value={Name}
          
          // When it cahnges activate the UseState Switch so the value is passed to the Var
          onChangeText={setName}
          
        /> 

        <TextInput 

          style={styles.TextInput} 
          placeholder='Password' 
          placeholderTextColor='#c6c3c3' 
          secureTextEntry={true}
          textContentType="password"

          value={Password}
          onChangeText={setPassword}
          
          
        />

        <CustomButton 
          onPress={handleLogin}  
          buttonText="SUBMIT"

          anchura={110}
          altura={50}
          fontSize={19}
          
        />


      
    </View>
  );
}

import React, { useState } from 'react';
import { Text, View,TextInput } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useSQLiteContext } from "expo-sqlite";
import { checkExists } from '../Database/db';

import styles from '../Styles/SignInStyle';
import CustomButton from '../components/Button';




export default function SigInScreen() {


  const navigation = useNavigation();
  const DB = useSQLiteContext();


  const [Name, setName] = useState('')
  const [Password, setPassword] = useState('')
  const [ConfirmPassword, setConfirmPassword] = useState('')

  const HandleSingIn = async (name, password, confirmPassword) => {

    console.log(name, password, confirmPassword);
    const exists = await checkExists(name,DB);

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    } else if(!name){

      alert("Please Enter An Name")
      return;
    } else if (!name && !password){
      
      alert("Please Input All The Information");
      return;

    } else if(!password){

      alert("Please Enter A Password");
      return;

    } else if(exists){

      console.warn('NAME ALREADY EXIST IN THE DB: ABORTING INSERT');
      alert("Username Already In Usage")
      return;
      
    } else {

      console.log(`Name: ${name} - Password: ${password} - ConfirmPassword: ${confirmPassword}`);

      navigation.navigate('SignIn2', {
  
        name: Name,
        password: Password,
  
      })
      return;
    }
    
  };



  return (

    <View style={styles.container}>
      
        <Text style={styles.Text} > SIGN IN </Text>

        <TextInput

          style={styles.TextInput} 
          placeholder='Name' 
          placeholderTextColor='#c6c3c3' 
          

          value={Name}
          
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


        <TextInput 

          style={styles.TextInput} 
          placeholder='Confirm Password' 
          placeholderTextColor='#c6c3c3' 
          secureTextEntry={true}
          textContentType="password"

          value={ConfirmPassword}
          onChangeText={setConfirmPassword}


        />
        

        <CustomButton 

          onPress={() => HandleSingIn(Name,Password,ConfirmPassword)}
          buttonText="CONTINUE"

          anchura={120}
          altura={55}
          fontSize={19}
          
        />


      
    </View>
  );
}

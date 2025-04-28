import React, { useState, useEffect } from 'react';
import { Text, View,TextInput } from 'react-native';

import CustomButton from '../components/Button';

import { useNavigation } from '@react-navigation/native';
import { useSQLiteContext } from "expo-sqlite";

import styles from '../Styles/LoginStyle';
import { validateCredentials,saveUserSession,getUserId,addToRecentUsers,getRecentUsers } from '../Database/db';

import RecentUsers from '../components/QuickLogin';
 

export default function LoginScreen() {

  const DB = useSQLiteContext();

  const navigation = useNavigation();
  
  const [Name, setName] = useState('')
  const [Password, setPassword] = useState('')

  const [showLogin,setShowLogin] = useState(true)
  const [recent,setRecent] = useState();

  useEffect(() => {

    const loadData = async () => {
      
      const recent = await getRecentUsers();
      setRecent(recent);

    };
    
    loadData();

  }, []);


  useEffect(() => {

    if (recent && recent.length > 0) {

      setShowLogin(false);

    }

  }, [recent]);


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
        await addToRecentUsers(userId, Name);
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

          anchura={120}
          altura={50}
          fontSize={20}

        /> 
      </View>

      {showLogin && (

        <View style={styles.container}> 

          <Text style={styles.Text} > LOG IN </Text>

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

          <CustomButton 
            onPress={handleLogin}  
            buttonText="SUBMIT"

            anchura={120}
            altura={55}
            fontSize={20}
            
          />


        </View>

    )}

    {!showLogin && (

      <View style={styles.container}>
        
        <RecentUsers />

      <CustomButton 
          onPress={() => {setShowLogin(true)}}  
          buttonText="OR LOGIN"

          anchura={180}
          altura={60}
          fontSize={25}
          
        />

      </View>

     

    )}
      
    
      
    </View>
  );
}

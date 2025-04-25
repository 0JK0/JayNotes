import { Text, ScrollView,View, Image,Alert } from 'react-native';
import { useState,useEffect } from 'react';

import {useNavigation } from '@react-navigation/native';
import { useSQLiteContext } from "expo-sqlite";

import styles from '../Styles/SettingsStyle';
import SettingsButton from '../components/SettingsButton'

import { getCurrentUser,getProfilePicture,clearUserSession,deleteUser } from '../Database/db';



function SettingsScreen({ }) {
  const DB = useSQLiteContext();

  const [user, setUser] = useState(null);
  const [picture, setPicture] = useState(null);
  const [userId,setUserId] = useState();

  const navigation = useNavigation();

  useEffect(() => {
    
    const loadData = async () => {

      const session = await getCurrentUser();
      setUser(session.userName);
      setUserId(session.userId)
  
      const userPic = await getProfilePicture(session.userName, DB);
      setPicture(userPic);


    };
  
    loadData();
}, []);

  const handleCloseSession = async() => {

    console.log("Close Session Button Pressed")

    try{

      await clearUserSession();
      navigation.reset({index: 0,routes: [{ name: 'Login' }],});

    } catch(error){console.log("handleCloseSession ERROR: ",error)}


  }

  const handleDeleteUser = async( ) => {

    console.log ("DELETE USER PRESSED")

    Alert.alert(
      "Delete User",
      "ARE YOU SURE YOU WANT TO DELETE THIS USER?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {

            await deleteUser(userId,user, DB);
            await clearUserSession();

            console.log("Attempting to reset navigation");
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            console.log("Navigation reset triggered");


          }
        }
      ]
    );


  }




  console.log(`Current User: ${user} -- UserPicture?: ${picture}`)

  return(
    

    <ScrollView style={styles.Container} contentContainerStyle={styles.ContentContainer}>

      <View style={styles.ProfileZone}>

        <Image style={styles.UserPFP} source={{ uri: picture || "../../assets/images/icon.png" }}/> 
        <Text style={styles.UserName}>{user || "Loading..."}</Text>

      </View>
      
      
      <Text style={styles.Text}> Account </Text>
      <SettingsButton buttonText='Close Session' onPress={() => handleCloseSession()} />
      <SettingsButton buttonText='Delete Account' onPress={() => handleDeleteUser()} />
      
    

      <Text style={styles.Text}> NOTES </Text>
      <SettingsButton buttonText='Open Storage' />
      
      <Text style={styles.Text}> APP </Text>
      <SettingsButton buttonText='Version Info' />
      <SettingsButton buttonText='Notifications' />
      
      

    </ScrollView>

  )



}

export default SettingsScreen;
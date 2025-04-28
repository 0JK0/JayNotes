import {Pressable,View,Text,Animated } from 'react-native';
import {useNavigation } from '@react-navigation/native';
import { useState,useEffect } from "react"
import { StyleSheet,Image } from 'react-native';

import { getCurrentUser,getProfilePicture } from '../Database/db';
import { useSQLiteContext } from "expo-sqlite";

const UserNameHeader = () => {
    
    const [user, setUser] = useState(null);
    
    useEffect(() => {
    
        const loadData = async () => {
    
          const session = await getCurrentUser();
          setUser(session.userName);

        };
      
        loadData();
    }, []);

    return (

        <View> 
            
        <Text style={{fontFamily: 'Mx437', fontSize: 25, fontWeight: 'bold'}}> {user} </Text>
            
        </View>

    )
}

export default UserNameHeader;
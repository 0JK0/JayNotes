import {Pressable,View,Text,Animated } from 'react-native';
import {useNavigation } from '@react-navigation/native';
import { useState,useEffect } from "react"
import { StyleSheet,Image } from 'react-native';

import { getCurrentUser,getProfilePicture } from '../Database/db';
import { useSQLiteContext } from "expo-sqlite";

const GoUserSettings = () => {

    const navigation = useNavigation();

    return (

        <View style={styles.Header}> 
            
        <PfPButton onPress={() => navigation.navigate('Settings')}/>
            
        </View>

    )


}

const PfPButton = ({ onPress }) => {

    const DB = useSQLiteContext();
    
    const [user, setUser] = useState(null);
    const [picture, setPicture] = useState(null);

    
    useEffect(() => {
    
        const loadData = async () => {
    
          const session = await getCurrentUser();
          setUser(session.userName);
      
          const userPic = await getProfilePicture(session.userName, DB);
          setPicture(userPic);

    
        };
      
        loadData();
    }, []);

    const[scale] = useState(new Animated.Value(1));

    const handlePressIn = () => {

        Animated.spring(scale, {

            toValue: 1.1,
            useNativeDriver: true,

        }).start();


    };

    const handlePressOut = () => {

        Animated.spring(scale, {

            toValue: 1,
            useNativeDriver: true,

        }).start();

    };


    return (

        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>

            <Animated.View

                style={{

                    transform: [{ scale }],

                    backgroundColor: "#000",

                    borderColor: "#000",
                    borderWidth: 2,
                    borderRadius: 50,

                    margin: 0,
                    padding: 0,

                    height: 55,
                    width: 55,

                    alignItems: 'center',  
                    justifyContent: 'center', 


                }}

                
            >
                <Image style={styles.Image} source={{ uri: picture}}/> 
            </Animated.View>
        </Pressable>


    )

};

const styles = StyleSheet.create({

    Container:{

        alignItems: 'flex-start',

    },

    Image: {
        width: 50, 
        height: 50, 
        borderRadius: 50,
        margin:0, 
        padding:0, 
        alignItems:'center',
        justifyContent:`center`,
        alignSelf: 'center',
    }

})

export default GoUserSettings;
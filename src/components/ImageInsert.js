import { View,Text,StyleSheet,Image } from "react-native"
import { useState } from "react"

import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker';


import CustomButton from "./Button";


const PfpUpload = ({username,onImageSelected}) => {

    const[UserImage, setImage] = useState(null);

    const pickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [12, 12],
            quality: 1,
        });

        if (!result.canceled) {
            const {uri} = result.assets[0];


            setImage(uri);
            onImageSelected(uri);
        }
    };
  

    return(

        <View style={styles.Container}>

            <View style={styles.ProfileZone}>

            <Image style={styles.UserPFP}  source={{uri: UserImage || 'https://img.icons8.com/windows/32/user.png',}}/>
            <Text style={styles.UserName}>{username}</Text>
            
            </View>

            <CustomButton 
                onPress={pickImage}
                buttonText="Set Profile Picture"

                anchura={200}
                altura={50}
                fontSize={19}

            />

        </View>
        
    )

};

const styles = StyleSheet.create({

    Container:{
        
        alignItems: 'center',
        justifyContent: 'center',

        marginTop: 10,

    },



    ProfileZone: {
        flexDirection: 'column',

        width: 690,
        height:300,


        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',

    },
    
    UserPFP: {

        width: 200,
        height:200,
        
        borderRadius: 100,

        marginTop: 30,
        marginBottom: 20,

        backgroundColor: '#fff',

        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        
    },

    UserName: {

        fontSize: 35,
        marginBottom:0,
    
        color:'#fff',
    
        fontFamily:'Mx437',
        
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',

        
    },

})

export default PfpUpload;
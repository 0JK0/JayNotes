import { Text, View,Pressable,Animated,StyleSheet } from 'react-native';
import { useState } from "react"

import Icon from 'react-native-vector-icons/Feather';

// 
const typesList = {
    video: { icon: 'video', color: '#e02b64' },
    audio: { icon: 'mic', color: '#5587d9' },
    text:  { icon: 'file-text', color: '#736270' },
};

const StatusIcon = ({type}) => {

    const {icon,color} = typesList[type] || typesList.text;

    return(

        <View style={[styles.IconCircle, { backgroundColor: color }]}>
            
            <Icon name={icon} size={18} color="white" />
        
        </View>

    )

}

  
const NoteCard = ({ Tittle, Date, NoteType, onPress }) => {

    const feather = require('feather-icons');

    const[scale] = useState(new Animated.Value(1));

    const shortTitle = Tittle.length > 15 ? Tittle.slice(0, 11) + '...' : Tittle;
    
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


    return(

        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}> 
            <Animated.View style={[
                
                styles.Card, {

                    transform: [{scale}]
                
                }
                
                ]}>

                <View>
                
                    <Text style={styles.Tittle}>{shortTitle} </Text>
                    <Text style={styles.Date}>{Date}</Text>
                    
                </View>



                <StatusIcon type={NoteType}/>

            </Animated.View >
        </Pressable>

    )



}

const styles = StyleSheet.create({

    Card: {

        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'space-between',

        width: 310,
        height: 75,

        margin: 5,

        backgroundColor: '#fff',

        borderRadius: 15,
        borderWidth:15,
        borderColor: '#fff',

    },

    TextColumn:{

        flexDirection: 'column',

    },

    Tittle:{

        fontFamily:'Mx437',
        fontSize: 30,

    },

    Date:{

        fontFamily:'Mx437',
        fontSize: 20,


    },

    IconCircle: {

        
        borderRadius: 100,

        width: 40,
        height: 40,

        alignItems: 'center',
        justifyContent: 'center',

    },


})

export default NoteCard;
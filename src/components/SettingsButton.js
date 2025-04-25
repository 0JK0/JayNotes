import { Pressable,Text,Animated,View,StyleSheet } from 'react-native';
import { useState } from "react"


const SettingsButton = ({onPress, buttonText}) => {

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

                borderColor: "#fff",
                borderWidth: 3,
                borderRadius: 20,

                margin: 10,
                height: 90,
                width: 350,

                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text
                style={{

                    fontFamily: "Mx437",
                    fontSize: 25,
                    color: "#fff",

                    textAlign: "center",


                }}
            >
               {buttonText}
            </Text>
        </Animated.View>
        </Pressable>


    )

};


export default SettingsButton;
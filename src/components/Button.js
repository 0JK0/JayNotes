import { Pressable,Text,Animated } from "react-native"
import { useState } from "react"

const CustomButton = ({ onPress,buttonText,altura,anchura,fontSize }) => {

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

                backgroundColor: "#fff",

                borderColor: "#fff",
                borderWidth: 2,
                borderRadius: 20,

                margin: 10,
                height: altura,
                width: anchura,

                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text
                style={{

                    fontFamily: "Mx437",
                    fontSize: fontSize,
                    color: "#000",

                    textAlign: "center",

                }}
            >
               {buttonText}
            </Text>
        </Animated.View>
        </Pressable>


    )

};

export default CustomButton;



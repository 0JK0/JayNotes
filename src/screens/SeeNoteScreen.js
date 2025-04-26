import { Text,View,ScrollView,Pressable,Animated,Alert  } from "react-native"
import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from "react"

import { useNavigation } from '@react-navigation/native';
import { useSQLiteContext } from "expo-sqlite";
import { Video } from 'expo-av';

import styles from "../Styles/SeeNotesStyle";
import {deleteNoteById} from '../Database/notesDb'

const CustomButton = ({ onPress}) => {

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

                backgroundColor: "#e02b64",

                borderColor: "#e02b64",
                borderWidth: 2,
                borderRadius: 20,

                margin: 10,
                height: 65,
                width: 150,

                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text
                style={{

                    fontFamily: "Mx437",
                    fontSize: 20,
                    color: "#fff",

                    textAlign: "center",

                }}
            >
               DELETE NOTE
            </Text>
        </Animated.View>
        </Pressable>


    )

};

export default function SeeNoteScreen() {
    
    const DB = useSQLiteContext();
    const navigation = useNavigation();

    const route = useRoute();
    const { note } = route.params;

    const [reloadData, setReloadData] = useState(false);
    const [videoUri, setVideoUri] = useState("");

    console.log(note)

    useEffect(() => {
        if (note.noteType == 'video') {

            setVideoUri(note.videoPath);
    
        }
    },[note]);


    const handleDelete = () => {
        Alert.alert(
          "Delete Note",
          "Are you sure you want to delete this note?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                await deleteNoteById(note.id, DB);
                setReloadData(true);
                navigation.reset({index: 0,routes: [{ name: 'Home' }],});
              }
            }
          ]
        );
      };
      

    return(

        <View style={styles.Container}>

            <Text style={styles.Title}>{note.title}</Text>
            <Text style={styles.Date}>{note.date}</Text>

            {videoUri && (
                    <Video
                        source={{ uri: videoUri }}
                        style={styles.videoPreview}
                        resizeMode="contain"
                        shouldPlay={true}
                        isMuted={false}
                        useNativeControls
                    />
            )}
    
            {!videoUri &&(

                <ScrollView style={styles.BodyWrapper} >

                <Text style={styles.NoteBody}>{note.body}</Text>
                </ScrollView>

            )}


            <CustomButton onPress={handleDelete} />

        </View>
        

    );

}
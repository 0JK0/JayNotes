import { KeyboardAvoidingView,ScrollView, SafeAreaView, View,TextInput } from 'react-native';
import { useState,useEffect } from 'react';

import {useNavigation,useRoute } from '@react-navigation/native';
import { useSQLiteContext } from "expo-sqlite";
import Icon from 'react-native-vector-icons/Feather';

import styles from '../Styles/NewNoteStyle';
import CustomButton from '../components/Button'

import { saveNewNote } from '../Database/notesDb';
import { getCurrentUser, } from '../Database/db';


export default function NewNoteScreen({  }) {

    const DB = useSQLiteContext();
    const navigation = useNavigation();

    const [title,setTitle] = useState ('');
    const [body,setBody] = useState ('');
    const [date,setDate] = useState('')
    const [noteType, setNoteType] = useState('text');

    const route = useRoute();
    const { calendarDate } = route.params ?? {};

    function getCurrentDate() {
        if (calendarDate) {
            console.log("CALENDAR DATE: ",calendarDate.dateString)
            return calendarDate.dateString; 
        } else {

            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;

        }
    }
        

    useEffect(() => {
        setDate(getCurrentDate());
    }, []);

    const handleSave = async () => {
        try{
            console.log("++ Getting session...");
            const session = await getCurrentUser();
            console.log(" Session result: ", session);
    
            if (!session) {
    
                console.log("No user session found.");
                return;
    
            } 
    
            const { userName, userId } = session;
            console.log("> Session unpacked", userName, userId);
    
            console.log(`==== DATE: ${date} == currentUser: ${userName} ==== UserID: ${userId} =====`);
    
            //TEMPORAL
            if(!noteType) {setNoteType('text')}
            console.log("> Preparing to save...");

            try{

                await saveNewNote(date,title,body,noteType,userId,DB);
    
            }catch(error){console.error("Handle Save --> saveNewNote Error: ",error)}
    
            console.log("> Navigating to Home...");
            navigation.reset({index: 0,routes: [{ name: 'Home' }],});

        } catch(error){

            console.error("first part of handleSave: ",error)

        }


    }
    
    const handleVideoNote = async () => {

        try{

            setNoteType('video')
            console.log("noteType = ",noteType)

        } catch {error} {

            console.error("handleVideoNote ERROR: ",error)

        }


    }

    const handleAudioNote = async () => {

        try{

            setNoteType('audio')
            console.log("noteType = ",noteType)


        } catch {error} {

            console.error("handleAudioNote ERROR: ",error)

        }


    }
   

    return(
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <KeyboardAvoidingView style={{ flex: 1 } }>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

            <View style={styles.Container}>

            <TextInput 

                style={styles.NoteTitle} 
                placeholder='Titulo..' 
                placeholderTextColor='#c6c3c3' 

                maxLength={20}

                value={title}
                onChangeText={setTitle}
                                
            />

            <TextInput 

                style={styles.NoteBody} 

                multiline={true}
                scrollEnabled={false}
                textAlignVertical="top"

                placeholder='' 
                placeholderTextColor='#c6c3c3' 

                value={body}

                onChangeText={setBody}

            />

            <View style={styles.ButtonZone}>

            <CustomButton 

                onPress={() => handleVideoNote()}
                buttonText={<Icon name={'video'} size={30} color="black" />} 
                altura={55} 
                anchura={70} 
                fontSize={25}

            />

            <CustomButton 

                onPress={() => handleSave()}
                buttonText="Guardar" 
                altura={60} 
                anchura={150} 
                fontSize={25}

            />


            <CustomButton 

                onPress={() => handleAudioNote()}
                buttonText={<Icon name={'mic'} size={30} color="black" />} 
                altura={55} 
                anchura={70} 
                fontSize={25}

            />

            </View>

            </View>

            </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>

    )


}
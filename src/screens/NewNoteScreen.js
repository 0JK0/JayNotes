import { KeyboardAvoidingView,ScrollView, SafeAreaView, View,TextInput,Text } from 'react-native';
import { useState,useEffect } from 'react';

import {useNavigation,useRoute } from '@react-navigation/native';
import { useSQLiteContext } from "expo-sqlite";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Video } from 'expo-av';

import Icon from 'react-native-vector-icons/Feather';

import styles from '../Styles/NewNoteStyle';
import CustomButton from '../components/Button';
import { AudioNoteComponent } from '../components/AudioNote';

import { saveNewNote } from '../Database/notesDb';
import { getCurrentUser, } from '../Database/db';


export default function NewNoteScreen({  }) {

    const DB = useSQLiteContext();
    const navigation = useNavigation();

    const [fileUri, setFileUri] = useState();
    const [audioUri, setAudioUri] = useState('');
    const [audioNote,setAudioNote] = useState(false);

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

                await saveNewNote(date,title,body,noteType,fileUri,userId,DB);
    
            }catch(error){console.error("Handle Save --> saveNewNote Error: ",error)}
    
            console.log("> Navigating to Home...");
            navigation.reset({index: 0,routes: [{ name: 'Home' }],});

        } catch(error){

            console.error("first part of handleSave: ",error)

        }


    }

    function generateRandom() {
                   
        const randomNumber = Math.floor(Math.random() * 9000) + 1000;
      
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let randomString = '';
        for (let i = 0; i < 3; i++) {
          randomString += letters.charAt(Math.floor(Math.random() * letters.length));
        }
      
        return randomNumber + randomString;
    }
      


    const handleVideoNote = async () => {
        
        try{

            setNoteType('video')
            console.log("noteType = ",noteType)


            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
                console.warn("Camera permission not granted");
                return;
            }
    
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['videos'],
                allowsEditing: false,
                quality: 1,
            });


            
            if (!result.canceled) {


                const uri = result.assets[0].uri;
                console.log("Captured video URI:", uri);

                console.log("++ Getting session...");
                const session = await getCurrentUser();
                console.log(" Session result: ", session);
        
                if (!session) {
        
                    console.log("No user session found.");
                    return;
        
                } 
        
                const { userName, userId } = session;
                console.log("> Session unpacked", userName, userId);

                const userVideoDir = `${FileSystem.documentDirectory}users/${userId}/videos/`;
                console.log("userDirectory is: ",userVideoDir)

                await FileSystem.makeDirectoryAsync(userVideoDir, { intermediates: true });


                let randomAddOn = generateRandom() // i know there is a library that is more fancy and cool, let em have some fun
                const filename = `video-${getCurrentDate()}-${randomAddOn}.mp4`;
                const newPath = userVideoDir + filename;

                await FileSystem.moveAsync({
                    from: uri,
                    to: newPath,
                });

                console.log("Moved video to persistent storage:", newPath);
                setFileUri(newPath)

            }

        } catch (error) {

            console.error("handleVideoNote ERROR: ",error)

        }


    }

    const handleAudioStop = async (uri) => {
        try{

            console.log('NewNoteScreen -- Audio URI received: ', uri);
            setAudioUri(uri);


            const session = await getCurrentUser();

            if (!session) {
                console.log("No user session found.");
                return;
            }

            const { userId } = session;

            const userAudioDir = `${FileSystem.documentDirectory}users/${userId}/audios/`;
            console.log("userAudioDir: ", userAudioDir);
    
            await FileSystem.makeDirectoryAsync(userAudioDir, { intermediates: true });

            const filename = `audio-${getCurrentDate()}-${generateRandom()}.m4a`; 
            const newPath = userAudioDir + filename;

            await FileSystem.moveAsync({
                from: uri,
                to: newPath,
            });

            console.log("Moved audio to persistent storage:", newPath);

            setFileUri(newPath);


        } catch(error){ console.error("handleAudioStop ERROR: ",error)}
 
    }

    const handleAudioNote = async () => {

        try{

            console.log("Audio Note Button Pressed");

            if(audioNote === false){
                setNoteType('audio')
                console.log("noteType = ",noteType)
    
                setAudioNote(true);    
            } else {

                setAudioNote(false)
                setNoteType('text')
                console.log("noteType = ",noteType)

            }


        } catch (error) {

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

            {(fileUri && noteType === 'video') && (
                <Video
                    source={{ uri: fileUri }}
                    style={styles.videoPreview}
                    resizeMode="contain"
                    shouldPlay={true}
                    isMuted={false}
                    useNativeControls
                />
            )}

            {(noteType !== 'video' && !audioNote) && (
                <TextInput
                    style={styles.NoteBody}
                    multiline={true}
                    scrollEnabled={false}
                    textAlignVertical="top"
                    placeholder=""
                    placeholderTextColor="#c6c3c3"
                    value={body}
                    onChangeText={setBody}
                />
            )}

            {(noteType === 'audio' && audioNote) && (
                <AudioNoteComponent onAudioStop={handleAudioStop} />
            )}


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
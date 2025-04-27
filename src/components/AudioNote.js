import { View,Text,StyleSheet,Button } from 'react-native';
import { useState,useEffect } from 'react';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/Feather';

import CustomButton from './Button';

export const AudioNoteComponent = ({onAudioStop}) => {
    const [recording, setRecording] = useState();
    const [recordingData, setRecordingData] = useState(null);
    const [audioUri, setAudioUri] = useState('');
    const [isPlaying, setIsPlaying] = useState(false); 
    const [remainingTime, setRemainingTime] = useState(null);
    const [intervalId, setIntervalId] = useState(null); 

    async function startRecording() {

        try{

            const permission = await Audio.requestPermissionsAsync();

            if (permission.status === "granted"){

                await Audio.setAudioModeAsync({

                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,

                });

                const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY);
                setRecording(recording);
                console.log('.......Recording started.....');

            }


        } catch(error){

            console.error("startRecording ERROR: ",error)

        }
    }

    async function stopRecording() {

        console.log('Stopping recording..');
        

        try{
        
            await recording.stopAndUnloadAsync(); 

            const uri = recording.getURI(); 
        
            const { sound, status } = await recording.createNewLoadedSoundAsync(); 
        
            
            setRecordingData({
                sound: sound,
                duration: status.durationMillis,
                file: uri,
            });
            
            setRemainingTime(status.durationMillis);
            setAudioUri(uri); 
            setRecording(undefined); 
        
            console.log('Recording stopped and stored at', uri);

            if (onAudioStop) {
                onAudioStop(uri);
            }

        } catch(error){

            console.error("stopRecording ERROR: ",error)

        }

    }

    function getDurationFormatted(milliseconds){

        const minutes = milliseconds / 1000 / 60;
        const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
        return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`

    }


    function clearRecording(){

        setRecordingData(null); 
        setIsPlaying(false);

        if (intervalId) {
            clearInterval(intervalId); 
        }

    }

    async function togglePlayback() {
        if (isPlaying) {
            
            await recordingData.sound.pauseAsync();

            if (intervalId) {
                clearInterval(intervalId); 
            }
        } else {
            
            await recordingData.sound.replayAsync();
            startTrackingTime();
        }

        
        setIsPlaying(!isPlaying);
    }

    function startTrackingTime() {
        const interval = setInterval(async () => {

            const status = await recordingData.sound.getStatusAsync();

            if (status.isPlaying) {

                const timeLeft = recordingData.duration - status.positionMillis;
                setRemainingTime(timeLeft);  

            } else {

                clearInterval(interval);
                setIntervalId(null);  
            }
        }, 1000);  
        setIntervalId(interval);  
    }


    return(

        <View style={styles.Container}>

            <CustomButton
                onPress={recording ? stopRecording : startRecording}
                buttonText={recording ? 'Stop Recording' : 'Start Recording'} 
                altura={50}
                anchura={180}
                fontSize={22}
            />

            {recordingData && (

                <View style={styles.Row}>

                    <Text style={styles.fill}>
                        AudioNote | Duration: {remainingTime !== null ? getDurationFormatted(remainingTime) : '00:00'}
                    </Text>

                    <CustomButton
                        onPress={togglePlayback}
                        buttonText={<Icon name={isPlaying ? 'pause' : 'play'} size={30} color="black"/>} 
                        altura={45}
                        anchura={45}
                        fontSize={20}
                    />

                </View>
            )}

            {recordingData && (

                <CustomButton
                    onPress={clearRecording}
                    buttonText={"Clear Recording"}
                    altura={50}
                    anchura={180}
                    fontSize={22}
                />
            )}

        </View>


    )


}

const styles = StyleSheet.create({

    Container:{

        width:'85%',
        height:300,

        margin:20,
        marginTop:10,

        flex:1,

        alignItems: 'center',
        justifyContent: 'center',

        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 15,




    },

    Row:{

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 40

    },

    Text:{

        color:'#fff',
        fontSize: 20,
        fontFamily:'Mx437',


    },

    fill: {
        flex: 1,
        margin: 15,
        color:'#fff',
        fontSize: 24,
        fontFamily:'Mx437',
    },


})


export const AudioPlayerComponent = ({ filePath }) => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(null);
    const [position, setPosition] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        loadSound();

        
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [filePath]);

    async function loadSound() {
        try {
            const { sound: newSound, status } = await Audio.Sound.createAsync(
                { uri: filePath },
                { shouldPlay: false }
            );
            setSound(newSound);
            setDuration(status.durationMillis);
        } catch (error) {
            console.error('Error loading sound:', error);
        }
    }

    async function togglePlayback() {
        if (!sound) return;

        if (isPlaying) {
            await sound.pauseAsync();
            clearInterval(intervalId);
        } else {
            await sound.playAsync();
            startTrackingPosition();
        }

        setIsPlaying(!isPlaying);
    }

    function startTrackingPosition() {
        const id = setInterval(async () => {
            if (sound) {
                const status = await sound.getStatusAsync();
                setPosition(status.positionMillis);

                if (status.didJustFinish) {
                    clearInterval(id);
                    setIsPlaying(false);
                    setPosition(0);
                }
            }
        }, 1000);
        setIntervalId(id);
    }

    function getFormattedTime(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    return (
        <View style={audioPlayerStyles.Container}>

            <View style={audioPlayerStyles.Row}>

                <Text style={audioPlayerStyles.Text}>

                    {getFormattedTime(position)} / {duration ? getFormattedTime(duration) : '00:00'}
                </Text>

                <CustomButton
                    onPress={togglePlayback}
                    buttonText={<Icon name={isPlaying ? 'pause' : 'play'} size={40} color="black" />}
                    altura={50}
                    anchura={50}
                    fontSize={20}
                />
            </View>

        </View>
    );
};

const audioPlayerStyles = StyleSheet.create({


    Container:{

        width:'80%',
        height:'50%',

        margin:20,
        alignItems: 'center',
        justifyContent: 'center',

        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 15,




    },

    Row:{

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15,
        marginRight: 10,

    },

    Text:{

        color:'#fff',
        fontSize: 30,
        fontFamily:'Mx437',


    },

    fill: {
        flex: 1,
        margin: 15,
        color:'#fff',
        fontSize: 24,
        fontFamily:'Mx437',
    },


})
import { Text, View, ScrollView } from 'react-native';
import React, { useState,useRef} from 'react';
import {useNavigation,useFocusEffect } from '@react-navigation/native';

import styles from '../Styles/HomeStyle';

import CustomButton from '../components/Button';
import CalendarComponent from '../components/Calendar';
import RecentNotes from '../components/NotasRecientes';


export default function HomeScreen({ route }) {

  const navigation = useNavigation();

  const [refresh, setRefresh] = useState(false);
  const hasFocusedOnce = useRef(false); // This ref tracks if screen has been focused

  useFocusEffect(() => {
    if (!hasFocusedOnce.current) {
      hasFocusedOnce.current = true;
      setRefresh(prev => !prev);  // Trigger refresh once
    }
    
    return () => {
      // Cleanup or reset state if needed
    };
  });
 
  return (

    <View style={styles.container}>

      <CalendarComponent />

      <RecentNotes Header={'NOTAS RECIENTES'} />

      <CustomButton onPress={() => navigation.navigate('NewNote')} buttonText="Nueva Nota" altura={55} anchura={200} fontSize={25}/>


    </View>
  );
}
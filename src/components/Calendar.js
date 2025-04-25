import { Text, View,StyleSheet } from 'react-native';
import { useCallback, useEffect,useState } from 'react';

import {Calendar, CalendarList, Agenda,LocaleConfig} from 'react-native-calendars';

import {useNavigation } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import { getCurrentUser } from '../Database/db';
import { getNotesFromUser } from '../Database/notesDb';


const CalendarComponent = ({  }) => {
  const DB = useSQLiteContext();
  const navigation = useNavigation();
  
  const [notesData, setNotesData] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
    
  
  useEffect(() => {
    const fetchNotes = async () => {
      const session = await getCurrentUser();
      const userId = session.userId;
  
      const notes = await getNotesFromUser(userId, DB);
      setNotesData(notes);
    };
  
    fetchNotes();
  }, []);

  useEffect(() => {

    const noteTypeColors = {

      video: '#e02b64',
      text: '#736270',
      audio: '#5587d9',

    };
  
    const marked = {};
  
    notesData.forEach(note => {

      marked[note.date] = {

        customStyles: {

          container: {
          
            backgroundColor: noteTypeColors[note.noteType] || 'gray',
          
          },

          text: {

            color: 'white',
            fontWeight: 'bold',

          },

        },
      };
    });
  
    setMarkedDates(marked);
  }, [notesData]);

  return(

  
    <View style={styles.container}>

      <Calendar 
        style={styles.Calendar}
        theme={styles.theme} 

        enableSwipeMonths={true}
        hideArrows= {true}
          
        onDayPress={day => {

          console.log('Selected Day',day);
          navigation.navigate('NewNote', {calendarDate: day});
          
        }}

        markingType={'custom'}

        markedDates={markedDates}

          
      />

    </View>



  );
}
const styles = StyleSheet.create({

    container: {

      
      backgroundColor: '#000',
  
      alignItems: 'center',
      justifyContent: 'center',

      width: '100%',
    },
  
    Text: {
  
      fontSize: 20,
  
      color:'#fff',
  
      fontFamily:'Mx437',
  
    },

    Calendar:{

        width: 370,   
        height: 320,

        color: '#fff',

        fontFamily:'Mx437',

        borderWidth: 3,
        borderColor: 'white',

        margin: 15,
        

    },

    theme: {

        textDayFontFamily: 'Mx437',
        textMonthFontFamily: 'Mx437',
        textDayHeaderFontFamily: 'Mx437',

        textDayFontSize: 19,
        textMonthFontSize: 22,
        textDayHeaderFontSize: 18,

        calendarBackground: '#000',
        dayTextColor: '#fff',
        monthTextColor: '#fff',
        
    },
  
  });



LocaleConfig.locales['Sp'] = {
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ],
  monthNamesShort: ['Ene.', 'Feb.', 'Marz.', 'Abr.', 'Mai', 'Jun.', 'Jul.', 'Ag.', 'Sept.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
  today: "Hoy"
};
LocaleConfig.defaultLocale = 'Sp';





export default CalendarComponent;
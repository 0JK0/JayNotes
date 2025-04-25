import { Text, ScrollView,StyleSheet,FlatList } from 'react-native';
import { useCallback, useEffect,useState } from 'react';
import { useSQLiteContext } from "expo-sqlite";
import { useNavigation } from '@react-navigation/native';

import NoteCard from './NoteCard';
import { getNotesFromUser } from '../Database/notesDb';
import { getCurrentUser } from '../Database/db';

const RecentNotes  = ({Header, reloadData}) => {
  const DB = useSQLiteContext();
  const navigation = useNavigation();

  const [notesData,setNotesData] = useState('');

  const loadData = async () => {

    const session = await getCurrentUser();
    const userId = session.userId;

    const notes = await getNotesFromUser(userId,DB);
    setNotesData(notes);
    
  };

  useEffect(() => {
      loadData();
      console.log("loadData Logs: ",notesData);
    }, []
  );
  
  useEffect(() => {
    if (reloadData) {
      loadData(); // Reload the data if reloadData is true
    }
  }, [reloadData]); 
  
  return(

    <FlatList style={styles.RecentNotes} contentContainerStyle={styles.RecentNotesContent} 
      ListHeaderComponent={<Text style={styles.Text}>{Header}</Text>}
      
      data={notesData}
      keyExtractor={(item) => item.id.toString()}

      renderItem={({ item }) => (

        <NoteCard

          Tittle={item.title}
          Date={item.date}
          NoteType={item.noteType}
          onPress={() => navigation.navigate("SeeNote", { note: item })}


        />

      )}
    />

  )


} 

const styles = StyleSheet.create({


    RecentNotes: {

        backgroundColor: '#000',
    
        borderWidth: 3,
        borderColor: '#fff',
        borderRadius: 15,
    
        width: '95%',
        margin: 10,
        marginBottom: 5,
    
        flexGrow: 0,
        maxHeight: 400,
    
    },
    
    RecentNotesContent: {
    
        padding: 5,
        alignItems: 'center',
        justifyContent: 'flex-start',
    
    },


  Text: {

    fontSize: 30,
    margin: 4,

    color:'#fff',

    fontFamily:'Mx437',

  },

  FlatList:{

    margin:0,
    padding: 0,

  

  },

  FlatListContent:{

    alignItems: 'center',   
    justifyContent: 'flex-start',

  }

})

export default RecentNotes;

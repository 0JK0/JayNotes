import { Text,StyleSheet,View,Pressable,Animated,FlatList,Image } from 'react-native';
import { useCallback, useEffect,useState } from 'react';
import { useSQLiteContext } from "expo-sqlite";
import { useNavigation } from '@react-navigation/native';


import {getRecentUsers,getProfilePicture, getUserId,addToRecentUsers,saveUserSession} from '../Database/db'



const RecentUsers = ({reloadData}) => {

    const DB = useSQLiteContext();
    const navigation = useNavigation();

    const [recentUsers,setRecentUsers] = useState([]);
    const [userPictures, setUserPictures] = useState({});

    const handleLogIn = async (userName) => {
        
        console.log("handleLogIn Recived: ", userName)

        try {

            const userId = await getUserId(userName, DB);

            if (userId === null) {
                console.log("User ID could not be retrieved.");
                return;
            }

            await saveUserSession(userName, userId);
            await addToRecentUsers(userId, userName);
            navigation.replace('Home', { name: userName });

        } catch (error) {
            console.error("Login Error:", error);
        }

    }


    const loadData = async () => {

        try{
            const recent = await getRecentUsers();
            console.log("recent.userName is :",recent.userName)
    
            const pictures = {};
    
            for (let user of recent) {
    
                console.log("user.userName is: ",user.userName)
    
                const userPic = await getProfilePicture(user.userName, DB);
                pictures[user.userName] = userPic;
            }
           
        
            setRecentUsers(recent);
            setUserPictures(pictures);

        } catch(error){

            console.error("LoadData ERROR: ",error)

        }


        
    };

  useEffect(() => {
      loadData();

    }, []
  );
  
  useEffect(() => {
    if (reloadData) {
      loadData(); 
    }
  }, [reloadData]); 
  
  useEffect(() => {
    console.log("Updated recentUsers:", recentUsers);
    console.log("Updated userPictures:", userPictures);
}, [recentUsers, userPictures]);

  return(

    <FlatList style={styles.RecentNotes} contentContainerStyle={styles.RecentNotesContent} 
      ListHeaderComponent={<Text style={styles.Text}>RECENT USERS</Text>}
      
      data={recentUsers}
      keyExtractor={(item) => item.userId.toString()}
      
      

      renderItem={({ item }) => (

        <UserCard

          userName={item.userName}
          userPicture={userPictures[item.userName]}
          onPress={() => (handleLogIn(item.userName))}


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
    
        width: '90%',
        margin: 10,
        marginBottom: 15,
    
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

const UserCard = ({ userName,userPicture, onPress }) => {

    console.log("UserCard Recived: ",userName,userPicture)

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


    return(

        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}> 
            <Animated.View style={[
                
                CardStyles.Card, {

                    transform: [{scale}]
                
                }
                
                ]}>

                <View style={CardStyles.Card}>
                
                    <Text style={CardStyles.Name}>{userName} </Text>
                    <Image style={CardStyles.Picture} source={ userPicture ? { uri: userPicture } : require('../../assets/images/user.png')}/>
                    
                </View>


            </Animated.View >
        </Pressable>

    )



}

const CardStyles = StyleSheet.create({

    Card: {

        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'space-between',

        width: 310,
        height: 75,

        margin: 5,
        marginRight: 20,

        backgroundColor: '#fff',

        borderRadius: 15,
        borderWidth:15,
        borderColor: '#fff',

    },

    TextColumn:{

        flexDirection: 'column',

    },

    Name:{

        fontFamily:'Mx437',
        fontSize: 35,

    },

    Date:{

        fontFamily:'Mx437',
        fontSize: 20,


    },

    Picture:{

        width:65,
        height: 65,

        alignItems: 'center',
        justifyContent: 'center',

        borderRadius: 100,

    }


})

export default RecentUsers;
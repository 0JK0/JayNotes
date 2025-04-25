import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({

    Container:{
        width:'100%',
        height:'100%',

        backgroundColor: '#000',
        


    },

    ContentContainer:{

        alignItems: 'center',
        justifyContent: 'center',
        
    },

    Text:{

        fontSize: 30,
        marginTop:15,
    
        color:'#fff',
    
        fontFamily:'Mx437',

    },

    ProfileZone: {
        
        flex:1,
        flexDirection: 'column',
        
        marginTop:20,
        width: 900,

        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',

    },

    UserPFP: {

        width: 150,
        height:150,
        
        borderRadius: 100,

        marginTop: 30,
        marginBottom: 20,

        backgroundColor: '#fff',

        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',

    },

    UserName: {

        fontSize: 35,
        marginBottom:20,
    
        color:'#fff',
    
        fontFamily:'Mx437',
        
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
    },



})

export default styles;
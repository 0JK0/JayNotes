import { ScrollView, StyleSheet } from 'react-native';

const styles = StyleSheet.create({

    Container:{

        flex:1,

        backgroundColor: '#000',

        alignItems: 'center',
        justifyContent: 'center',
    
        width:'100%',
        height:'100%',

        
    },

    Title:{

        fontSize: 30,
        margin: 5,
    
        color:'#fff',
    
        fontFamily:'Mx437',

    },

    Date: {

        fontSize: 25,
        marginBottom: 20,
    
        color:'#fff',
    
        fontFamily:'Mx437',

    },

    BodyWrapper: {
        
        width: '85%',
        maxHeight: '70%',

        borderWidth: 2,
        borderColor: '#fff',

        borderRadius: 15,
        margin:0,

    },

    videoPreview: {
        width: '80%',
        height: '60%', 
        backgroundColor: '#000',
    
        margin: 20,

    },


    NoteBody: {
        
        paddingHorizontal: 15,
        paddingVertical: 10,
        paddingLeft: 20,

        fontSize: 22,
        fontFamily: 'Mx437',

        lineHeight: 25, 
        
        color: '#fff',
        textAlignVertical: 'top',


    },

    ButtonZone: {

        flexDirection: 'row',

        justifyContent: 'space-between',
        textAlign: 'center',
        alignItems: 'center',

    },


})

export default styles;
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-web';


const styles = StyleSheet.create({

    Container:{

        backgroundColor: '#000',

        alignItems: 'center',
        justifyContent: 'center',
    
        width:'100%',
        height:'100%',

    },

    Text:{

        fontSize: 30,
        margin: 20,
    
        color:'#fff',
    
        fontFamily:'Mx437',

    },

    NoteTitle: {

        width: '90%',
        maxHeight: 60,
        minHeight: 55,

        flexShrink:1,

        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 15,
        
        padding: 10,
        paddingHorizontal: 0,
        paddingVertical: 10,
        paddingLeft: 20,

        marginTop: 45,
        marginBottom: 15,

        fontSize: 20,
        fontFamily:'Mx437',
        lineHeight: 18,
        color:'#fff'

    },

    NoteBody: {
        
        width: '85%',
        maxHeight: '70%',

        flex: 1,
        flexShrink:1,

        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 15,
        
        
        paddingHorizontal: 15,
        paddingVertical: 10,
        paddingLeft: 20,

        marginBottom: 15,

        fontSize: 22,
        fontFamily:'Mx437',
        lineHeight: 25, 
        color:'#fff',

        alignContent:'flex-start',
        justifyContent:'flex-start',
        textAlignVertical: 'top'


    },

    ButtonZone: {

        flexDirection: 'row',

        justifyContent: 'space-between',
        textAlign: 'center',
        alignItems: 'center',

    },


})

export default styles;
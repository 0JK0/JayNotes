//LoginStyle.js
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-web';
import { Button } from '@react-navigation/elements';
import CustomButton from '../components/Button';

const styles = StyleSheet.create({

  container: {
    flex: 1,
    position: 'relative',
    
    backgroundColor: '#000',

    alignItems: 'center',
    justifyContent: 'center',

    width:'100%',
    height:'100%',

  },

  Text: {

    fontSize: 50,
    marginBottom: 15,

    color:'#fff',

    fontFamily:'Mx437',

  },

  TextInput: {
        width: '70%',
        maxHeight: 60,

        flex: 1,
        flexShrink:1,

        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 15,
        
        padding: 10,
        paddingHorizontal: 0,
        paddingVertical: 10,
        paddingLeft: 20,

        marginBottom: 15,

        fontSize: 20,
        fontFamily:'Mx437',
        lineHeight: 18,
        color:'#fff'

        
    
  },

  CustomButton: {

    position: 'absolute',
    top: 50,
    right: 10,

    margin:0,
    padding:0,


  },




});

export default styles;
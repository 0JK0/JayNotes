//LoginStyle.js
import { StyleSheet } from 'react-native';
import PfpUpload from '../components/ImageInsert';

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
    marginBottom: 0,

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

    marginTop: 25,

    fontSize: 20,
    fontFamily:'Mx437',
    lineHeight: 18,
    color:'#fff'
  },

  ComfirmPass:{

    fontSize: 17,
    marginBottom: 5,

    color:'#fff',

    fontFamily:'Mx437',


  },

  CustomButton: {

    position: 'absolute',
    top: 25,
    right: 10,

    margin:0,
    padding:0,


  },

  PfpUploadLabel:{

    fontSize: 20,
    margin: 0,
    paddingTop: 10,

    color:'#fff',

    fontFamily:'Mx437',

    backgroundColor: '',

  },

  Toggle: {

    flexDirection: 'row',

    justifyContent: 'space-between',
    textAlign: 'center',
    alignItems: 'center',

    marginTop: 50,
    marginBottom: 15,


  
  },

  ToggleLabel: {


    fontSize: 25,
    margin: 5,
    marginRight: 15,

    color:'#fff',

    fontFamily:'Mx437',

  }






});

export default styles;
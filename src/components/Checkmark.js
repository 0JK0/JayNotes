import React, { useState } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';

const CustomSwitch = ({ onToggle }) => {
  const [isOn, setIsOn] = useState(false);
  const translateX = useState(new Animated.Value(0))[0];

  const toggleSwitch = () => {
    const newValue = !isOn;
    setIsOn(newValue);
    onToggle(newValue); 

    Animated.timing(translateX, {
      toValue: newValue ? 30 : 0, 
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggleSwitch}
      style={[
        styles.switchBackground,
        { backgroundColor: isOn ? '#2f3640' : '#fff',  },
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            transform: [{ translateX }],
            backgroundColor: isOn ? '#ffffff' : '#2f3640', },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchBackground: {
    width: 60,
    height: 30,
    borderRadius: 8,
    padding: 3,
    justifyContent: 'center',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 6,
    position: 'absolute',
  },
});

export default CustomSwitch;

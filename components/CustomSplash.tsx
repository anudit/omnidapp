import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { MotiView } from 'moti'

import designTokens from '../assets/designTokens.json';


const CustomSplash = ()=> {
  const size = 50;
  const scale = 20;

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <View>
        <MotiView
            from={{ 
              width: size, 
              height: size, 
              borderWidth: 0 ,
              shadowOpacity: 0.5,
              transform: [
                {scaleY: 2.5}
              ]
            }}
            animate={{
              width: size + scale, 
              height: size + scale, 
              borderRadius: (size+scale)/2,
              borderWidth: size/10,
              shadowOpacity: 1,
              shadowRadius: 4,
            }}
            transition={{
              type: 'timing',
              duration: 1000,
              loop: true
            }}
            style={{ 
              width: size, 
              height: size, 
              borderRadius: size/2, 
              borderWidth: size/10,
              borderColor: '#fff',
              shadowColor: '#fff',
              shadowOffset: {width: 0, height: 0},
              shadowOpacity: 1,
              shadowRadius: 2,
            }}
        />
        <MotiView
            from={{ 
              width: size, 
              height: size, 
              borderWidth: 0 ,
              shadowOpacity: 0.5,
              transform: [
                {scaleX: 2.5}
              ]
            }}
            animate={{
              width: size + scale, 
              height: size + scale, 
              borderRadius: (size+scale)/2,
              borderWidth: size/10,
              shadowOpacity: 1,
              shadowRadius: 4,
            }}
            transition={{
              type: 'timing',
              duration: 1000,
              loop: true
            }}
            style={{ 
              width: size, 
              height: size, 
              borderRadius: size/2, 
              borderWidth: size/10,
              borderColor: '#fff',
              shadowColor: '#fff',
              shadowOffset: {width: 0, height: 0},
              shadowOpacity: 1,
              shadowRadius: 2,
              position:'absolute',
              top: 20
            }}
        />
      </View>
    </View>
  );
}

export default CustomSplash;

const styles = StyleSheet.create({
  container: {
    display: 'flex', 
    flexDirection: 'column', 
    alignItems:'center', 
    justifyContent: 'center',
    width: '100%', 
    height: '100%',
    margin: 0,
    backgroundColor: designTokens.colors.background.level1
  }
});
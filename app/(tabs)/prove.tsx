import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { QrFrameIcon } from '../../components/icons';
import designTokens from '../../assets/designTokens.json';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Camera, FlashMode } from 'expo-camera';


export default function Prove() {

  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.off)
  const {width} = useWindowDimensions();
  const height = Math.round((width * 16) / 9);

  useEffect(() => {
    requestPermission();
  }, []);
  
  const handleQrScan = async ({ type, data }) => {

    try {
      let url = Linking.parse(data);
      // && url.queryParams && (url.scheme === 'exp://' || url.scheme === 'omnid://')
      console.log('qr: got', url);
      if (url.path === 'approve' ){
        console.log('opening', data)
        await Linking.openURL(data);
      }
    } catch (error) {
      console.error(error)
    }

  };

  if (!permission) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (!permission.granted) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <Camera
        ratio="16:9"
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          interval: 100,
        }}
        onBarCodeScanned={handleQrScan}
        style={{...StyleSheet.absoluteFillObject, 
          height: height,
          width: "100%"
        }}
        flashMode={flashMode}
      >
        <View style={styles.overlay} >
          <Text style={styles.text}>
            Scan to Prove
          </Text>
          <QrFrameIcon width={256} height={256} />
          <Pressable style={{...styles.roundButton, marginTop: 30}} onPress={()=>{
            if (flashMode == FlashMode.torch) setFlashMode(FlashMode.off)
            else setFlashMode(FlashMode.torch)
          }}>
            {({pressed})=><Ionicons 
              name={pressed || flashMode == FlashMode.torch ? 'flashlight' : "flashlight-outline"} 
              size={24} 
              color="white"
            /> }
          </Pressable>
        </View>
      </Camera>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    display: 'flex', 
    flexDirection: 'column', 
    alignItems:'center', 
    width: '100%', 
    height: '100%',
    margin: 0,
  },
  overlay: {
    position: 'absolute', 
    elevation: 2, 
    zIndex: 2, 
    display: 'flex',
    alignItems:'center',
    justifyContent: 'space-evenly',
    width: '100%', 
    height: '100%'
  },
  text: {
    color:  designTokens.colors.text.primary,
  },
  roundButton: {
    backgroundColor: designTokens.colors.background.level1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    height: 50,
    width: 50,
  }
});
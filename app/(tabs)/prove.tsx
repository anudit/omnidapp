import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { QrFrameIcon } from '../../components/icons';
import designTokens from '../../assets/designTokens.json';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

export default function Prove() {

  const [hasPermission, setHasPermission] = useState(null);
  const [scannedValue, setScannedValue] = useState("");

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {

    try {
      let url = Linking.parse(data);
      // && url.queryParams && (url.scheme === 'exp://' || url.scheme === 'omnid://')
      if (url.path === 'approve' ){
        console.log('opening', data)
        await Linking.openURL(data);
      }
    } catch (error) {
      console.error(error)
    }

    setScannedValue(data);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay} >
        <Text style={styles.text}>
          Scan to Prove
        </Text>
        <QrFrameIcon fill='white' width={256} height={256} />
        <Pressable style={{...styles.roundButton, marginTop: 30}}>
          {({pressed})=><Ionicons 
            name={pressed ? 'flashlight' : "flashlight-outline"} 
            size={24} 
            color="white"
          /> }
        </Pressable>
      </View>
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
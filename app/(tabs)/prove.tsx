import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { QrFrameIcon } from '../../components/icons';
import designTokens from '../../assets/designTokens.json';

export default function Prove() {

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedValue, setScannedValue] = useState("");

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    console.log('scanner', data)
    setScannedValue(data);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{display: 'flex', flexDirection: 'column', alignItems:'center', width: '100%', height: '100%' }}>
      <Text style={{color: designTokens.colors.text.primary}}>
        {scannedValue}
      </Text>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        style={{
            width: '100%',
            height: '100%'
        }}
      />
      <View style={styles.overlay} >
        <QrFrameIcon fill='#ffffff' width={256} height={256} />
      </View>
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );

}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', 
    elevation: 2, 
    zIndex: 2, 
    display: 'flex',
    alignItems:'center',
    justifyContent: 'center',
    width: '100%', 
    height: '100%'
  },
});
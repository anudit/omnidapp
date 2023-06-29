import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera, FlashMode } from 'expo-camera';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import designTokens from '../../assets/designTokens.json';
import { QrFrameIcon } from '../../components/icons';



export default function Prove() {

  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.off)
  const { height } = useWindowDimensions();
  const width = Math.round((height * 9) / 16);
  const router = useRouter();

  useEffect(() => {
    requestPermission();
  }, []);

  const handleQrScan = async ({ type, data }) => {

    try {
      const url = Linking.parse(data);
      if ((url.scheme === 'omnid' && url.hostname === 'approve') || (url.scheme === 'exp' && url.path === 'approve')) {
        const formattedParams = new URLSearchParams(JSON.parse(JSON.stringify(url.queryParams)))
        await router.push(`/approve?${formattedParams.toString()}`);
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
        style={{
          height: "100%",
          width,
        }}
        flashMode={flashMode}
      >
        <View style={styles.overlay} >
          <Text style={styles.text}>
            Scan to Prove
          </Text>
          <QrFrameIcon width={256} height={256} />
          <Pressable style={{ ...styles.roundButton, marginTop: 30 }} onPress={() => {
            if (flashMode === FlashMode.torch) setFlashMode(FlashMode.off)
            else setFlashMode(FlashMode.torch)
          }}>
            {({ pressed }) => <Ionicons
              name={pressed || flashMode === FlashMode.torch ? 'flashlight' : "flashlight-outline"}
              size={24}
              color="white"
            />}
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
    alignItems: 'center',
    width: '100%',
    height: '100%',
    margin: 0,
    backgroundColor: designTokens.colors.background.level1,
  },
  overlay: {
    position: 'absolute',
    elevation: 2,
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    height: '100%'
  },
  text: {
    color: designTokens.colors.text.primary,
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
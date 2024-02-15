import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera/next';
import * as Linking from 'expo-linking';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { FlashMode } from 'expo-camera';
import designTokens from '../../../assets/designTokens.json';
import { QrFrameIcon } from '../../../components/icons';

export default function Scanner() {

    const [permission, requestPermission] = useCameraPermissions();
    const [flashMode, setFlashMode] = useState<'on' | 'off'>(FlashMode.off)
    const { height } = useWindowDimensions();
    const width = Math.round((height * 9) / 16);
    const router = useRouter();
    const [mountCamera, setMountCamera] = useState(false);

    useEffect(() => {
        requestPermission();
    }, []);

    useFocusEffect(
        useCallback(() => {
            setMountCamera(true);

            return () => {
                setMountCamera(false);
            };
        }, [])
    );

    const handleQrScan = async ({ type, data }: { type: string, data: string }) => {

        try {
            const url = Linking.parse(data);
            if ((url.scheme === 'omnid' && url.hostname === 'approve') || (url.scheme === 'exp' && url.path === 'approve')) {
                const formattedParams = JSON.parse(JSON.stringify(url.queryParams))
                router.push({ pathname: `/approve`, params: formattedParams });
            }
            else if ((url.scheme === 'otpauth' && url.hostname === 'totp') || (url.scheme === 'exp' && url.path === 'totp')) {
                const formattedParams = JSON.parse(JSON.stringify(url.queryParams))
                router.push({ pathname: `/dev/totp`, params: formattedParams });
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
            {mountCamera && (<CameraView
                // ratio="16:9"
                barcodeScannerSettings={{
                    barCodeTypes: ['qr'],
                    interval: 100,
                }}
                onBarcodeScanned={handleQrScan}
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
                    <QrFrameIcon width={256} height={256} fill={designTokens.colors.background.level1} />
                    <Pressable style={{ ...styles.roundButton, marginTop: 30 }} onPress={() => {
                        if (flashMode === 'on') setFlashMode(FlashMode.off)
                        else setFlashMode(FlashMode.on)
                    }}>
                        {({ pressed }) => <Ionicons
                            name={pressed || flashMode === FlashMode.on ? 'flashlight' : "flashlight-outline"}
                            size={24}
                            color={designTokens.colors.background.level1}
                        />}
                    </Pressable>
                </View>
            </CameraView>)}
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
        backgroundColor: designTokens.colors.accent.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        height: 50,
        width: 50,
    }
});
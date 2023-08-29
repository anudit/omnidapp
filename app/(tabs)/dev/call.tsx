import CallDetectorManager from 'react-native-call-detection';

import { PermissionsAndroid, Pressable, SafeAreaView, StyleSheet, Text } from 'react-native';

import { useEffect } from 'react';
import designTokens from '../../../assets/designTokens.json';

export default function Connections() {

    useEffect(() => {

    }, [])

    const askPermission = async () => {
        try {
            const permissions = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
                PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
            ]);
            // logger.log("Permissions are:", permissions);
        } catch (err) {
            console.warn(err);
        }
    };

    return (
        <SafeAreaView style={[StyleSheet.absoluteFillObject, styles.container]}>
            <Text style={styles.text}>
                Call Demo
            </Text>

            <Pressable onPress={() => {
                let callDetector = new CallDetectorManager(console.log,
                    true, // if you want to read the phone number of the incoming call [ANDROID], otherwise false
                    console.error, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
                    {
                        title: 'Phone State Permission',
                        message: 'This app needs access to your phone state in order to react and/or to adapt to incoming calls.'
                    } // a custom permission request message to explain to your user, why you need the permission [recommended] - this is the default one
                )
            }}>
                <Text>Call Start</Text>

            </Pressable>

            <Pressable onPress={askPermission}>
                <Text>askPermission</Text>

            </Pressable>

        </SafeAreaView>
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
    text: {
        color: designTokens.colors.text.primary,
    }
});
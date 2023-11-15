import { SafeAreaView, StyleSheet, Text } from 'react-native';

import LorenzAttractor from '@/components/LorrenzAttractor';
import designTokens from '../../../assets/designTokens.json';

export default function Connections() {

    return (
        <SafeAreaView style={[StyleSheet.absoluteFillObject, styles.container]}>
            <Text style={styles.text}>
                Connections
            </Text>
            <LorenzAttractor txnHash='0xjsifhusfisudhfsdf' />
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
        backgroundColor: 'black',
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
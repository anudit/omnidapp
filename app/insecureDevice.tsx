import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

const InsecureDevice = () => {

    return (
        <View style={{ ...StyleSheet.absoluteFillObject, ...styles.container }}>
            <Ionicons name="ios-warning-outline" size={100} color="#ff6961" />
            <Text>You are running Omnid on an Insecure Device</Text>
        </View>
    )
}
export default InsecureDevice;


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        margin: 0,
    }
});
import { StyleSheet, Text, View } from 'react-native';


export default function Loc() {

    return (
        <View style={styles.container}>
            <Text>Cam</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 20,
    },
    paragraph: {
        fontSize: 18,
        textAlign: 'center',
    },
});

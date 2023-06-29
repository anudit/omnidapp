import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import designTokens from '../../assets/designTokens.json';
import { OmnidIcon } from '../../components/icons';

const List = () => {

    const router = useRouter()

    return (
        <SafeAreaView style={styles.container}>
            <Text>List</Text>
            <Pressable onPress={() => {
                router.push("/approve?scope=age%2Cnew&redirect_uri=https%3A%2F%2Fomnid.io%2F&state=publicAnnouceId&issuer=0xA73F022a256372837724b28EFbc7bc1876e833C8&issuerSig=0xe509d4480ae90e9df6044e9536b5384fe778e69cdd99d6ffeba421c5d3dbca96447ae13aaf233d546009deeb7b26945a3af2dbfeae21f1c52f3fabc86295974f1c")
            }} style={styles.button}>
                <OmnidIcon style={styles.buttonIcon} height={20} />
                <Text style={styles.buttonText}>Sign In with Omnid</Text>
            </Pressable>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: designTokens.colors.background.level1,
        color: designTokens.colors.text.primary,
        minHeight: '100%',
        width: '100%',
        paddingTop: 10,
        paddingHorizontal: 10
    },
    button: {
        marginVertical: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: designTokens.colors.background.level3,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonIcon: {
        marginRight: 10,
        fill: designTokens.colors.text.primary
    },
    buttonText: {
        color: designTokens.colors.text.primary,
    }
});


export default List;
import { Link, useRouter } from 'expo-router';
import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import designTokens from '../../assets/designTokens.json';

const List = () => {

    const router = useRouter()

    return (
        <SafeAreaView style={styles.container}>
            <Text>List</Text>
            <Link href="/profile/1">Profile 1</Link>
            <Link href="/profile/2">Profile 2</Link>
            <Link href="/profile/3">Profile 3</Link>
            <Pressable onPress={()=>{
                router.push("/approve?scope=age%2Cnew&redirect_uri=https%3A%2F%2Fomnid.io%2F&state=publicAnnouceId&issuer=0xA73F022a256372837724b28EFbc7bc1876e833C8&issuerSig=0xe509d4480ae90e9df6044e9536b5384fe778e69cdd99d6ffeba421c5d3dbca96447ae13aaf233d546009deeb7b26945a3af2dbfeae21f1c52f3fabc86295974f1c")
            }}>
                <Text>Sign In with Omnid</Text>
            </Pressable>
            <Pressable onPress={()=>{
                router.replace("/insecureDevice")
            }}>
                <Text>Insec</Text>
            </Pressable>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      color: designTokens.colors.text.primary,
      minHeight: 100,
      width: '100%',
      paddingTop: 10,
      paddingHorizontal: 10
    }
});


export default List;
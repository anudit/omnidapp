import { Link, useRouter } from 'expo-router';
import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import designTokens from '../../assets/designTokens.json';

const List = () => {

    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <Text>List</Text>
            <Link href="/profile/1">Profile 1</Link>
            <Link href="/profile/2">Profile 2</Link>
            <Link href="/profile/3">Profile 3</Link>
            <Pressable onPress={()=>{
                router.push("/approve?scope=age%2Cnew&redirect=https%3A%2F%2Fomnid.io%2F&state=publicAnnouceId&issuer=0x00AABBCC&issuerSig=0x000011110000")
            }}>
                <Text>Sign In with Omnid</Text>
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
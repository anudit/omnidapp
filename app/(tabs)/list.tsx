import { Link } from 'expo-router';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import designTokens from '../../assets/designTokens';

const List = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text>List</Text>
            <Link href="/profile/1">Profile 1</Link>
            <Link href="/profile/2">Profile 2</Link>
            <Link href="/profile/3">Profile 3</Link>
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
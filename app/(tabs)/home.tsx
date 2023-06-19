import React from 'react';
import { Link } from 'expo-router';
import {View, Text, Pressable} from 'react-native';

const Home = () => {
    return (
        <View>
            <Text>Home</Text>
            <Link href="/list">Go to List</Link>
            
        </View>
    )
}
export default Home;
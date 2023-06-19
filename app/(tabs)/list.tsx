import { Link } from 'expo-router';
import React from 'react';
import {View, Text} from 'react-native';

const List = () => {
    return (
        <View>
            <Text>List</Text>
            <Link href="/profile/1">Profile 1</Link>
            <Link href="/profile/2">Profile 2</Link>
            <Link href="/profile/3">Profile 3</Link>

        </View>
    )
}
export default List;
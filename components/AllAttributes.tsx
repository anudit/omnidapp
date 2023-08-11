import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import designTokens from '../assets/designTokens.json';
import { OmnidIcon } from './icons';

const mockData = [{
    title: '> 18',
    issuer: 'Omnid',
    description: 'Lorem Ipsum'
}, {
    title: 'Indian',
    issuer: 'Government of India',
    description: 'Lorem Ipsum'
}, {
    title: '> 18',
    issuer: 'Omnid',
    description: 'Lorem Ipsum'
}, {
    title: 'Indian',
    issuer: 'Government of India',
    description: 'Lorem Ipsum'
}, {
    title: '> 18',
    issuer: 'Omnid',
    description: 'Lorem Ipsum'
}, {
    title: 'Indian',
    issuer: 'Government of India',
    description: 'Lorem Ipsum'
}, {
    title: '> 18',
    issuer: 'Omnid',
    description: 'Lorem Ipsum'
}, {
    title: 'Indian',
    issuer: 'Government of India',
    description: 'Lorem Ipsum'
}, {
    title: '> 18',
    issuer: 'Omnid',
    description: 'Lorem Ipsum'
}, {
    title: 'Indian',
    issuer: 'Government of India',
    description: 'Lorem Ipsum'
}, {
    title: '> 18',
    issuer: 'Omnid',
    description: 'Lorem Ipsum'
}, {
    title: 'Indian',
    issuer: 'Government of India',
    description: 'Lorem Ipsum'
}, {
    title: 'Indian',
    issuer: 'Government of India',
    description: 'Lorem Ipsum'
}, {
    title: '> 18',
    issuer: 'Omnid',
    description: 'Lorem Ipsum'
}, {
    title: 'Indian',
    issuer: 'Government of India',
    description: 'Lorem Ipsum'
}, {
    title: '> 18',
    issuer: 'Omnid',
    description: 'Lorem Ipsum'
}, {
    title: 'Indian',
    issuer: 'Government of India',
    description: 'Lorem Ipsum'
}].map((data, id) => { return { ...data, id } })

const cardColors = [
    '#bd3b04',
    '#242f3d',
    designTokens.colors.brown,
]

const AllAttributes = () => {

    const [filterValue, setFilterValue] = useState<undefined | string>(undefined);

    return (
        <FlatList
            data={filterValue && filterValue.trim().length > 0 ? mockData.filter(e => e.description.includes(filterValue) || e.issuer.includes(filterValue) || e.title.includes(filterValue)) : mockData}
            horizontal={false}
            style={styles.grid}
            key={'allAttributes'}
            numColumns={2}
            keyboardShouldPersistTaps={'always'}
            ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
            ListHeaderComponent={
                <>
                    <View style={styles.hero}>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <OmnidIcon fill={designTokens.colors.text.primary} style={{ marginRight: 8 }} />
                            <Text style={styles.heading}>All Attributes</Text>
                        </View>
                        <Link href="/settings" asChild>
                            <Pressable>
                                {({ pressed }) => <Ionicons
                                    name={pressed ? 'settings' : "settings-outline"}
                                    size={24}
                                    color={designTokens.colors.text.primary}
                                />}
                            </Pressable>
                        </Link>
                    </View>
                    <TextInput
                        key="allAttributesSearch"
                        style={styles.input}
                        placeholder="Search Attributes"
                        placeholderTextColor={designTokens.colors.text.secondary}
                        value={filterValue}
                        onChangeText={text => setFilterValue(text)}
                    />
                </>
            }
            renderItem={({ item }) => (
                <Pressable style={{
                    ...styles.card,
                    backgroundColor: cardColors[Math.floor(Math.random() * cardColors.length)]
                }} >
                    <Text style={styles.cardHeading}>{item.title}</Text>
                    <Text style={styles.cardSubHeading}>{item.issuer}</Text>
                </Pressable>
            )}
            keyExtractor={item => String(item.id)}
        />
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: designTokens.colors.background.level1,
        color: designTokens.colors.text.primary,
        width: '100%',
        paddingTop: 10,
        paddingHorizontal: 20
    },
    hero: {
        paddingVertical: 6,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    input: {
        height: 40,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: designTokens.colors.text.secondary,
        color: designTokens.colors.text.primary,
        borderRadius: 20,
        padding: 12,
    },
    heading: {
        fontFamily: designTokens.typography.bold,
        color: designTokens.colors.text.primary,
        fontSize: 20
    },
    grid: {
        width: '100%',
        minHeight: '100%'
    },
    card: {
        width: '49%',
        height: 100,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginHorizontal: 2,
        borderRadius: 20,
        fontFamily: designTokens.typography.regular,
    },
    cardHeading: {
        fontSize: 20
    },
    cardSubHeading: {
        fontSize: 10,
        color: designTokens.colors.text.inverse,
    }
});

export default AllAttributes;
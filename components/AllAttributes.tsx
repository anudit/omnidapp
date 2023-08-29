import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import designTokens from '../assets/designTokens.json';
import { GovIcon, MoreIcon, OmnidIcon } from './icons';

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

const AllAttributes = () => {

    const [filterValue, setFilterValue] = useState<undefined | string>(undefined);
    const insets = useSafeAreaInsets();

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
                <View style={{
                    backgroundColor: designTokens.colors.accent.primary,
                    marginBottom: 8,
                    paddingTop: Math.max(insets.top, 20),
                    paddingHorizontal: 20,
                    borderBottomRightRadius: 20,
                    borderBottomLeftRadius: 20,
                }}>
                    <View style={styles.hero}>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <Text style={styles.heading}>Home</Text>
                        </View>
                        <Link href="/settings" asChild>
                            <Pressable>
                                {({ pressed }) => <Ionicons
                                    name={pressed ? 'settings' : "settings-outline"}
                                    size={24}
                                    color={designTokens.colors.primary[300]}
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
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', height: 80 }}>
                        <Pressable style={{ alignItems: 'center', justifyContent: 'center' }} >
                            <View style={{
                                borderRadius: 100,
                                backgroundColor: designTokens.colors.background.level2,
                                padding: 10
                            }}>
                                <OmnidIcon style={styles.topRowIcon} height={24} fill={designTokens.colors.accent.primary + 'aa'} />
                            </View>
                            <Text style={styles.topRowSubheading}>Omnid</Text>
                        </Pressable>

                        <Pressable style={{ alignItems: 'center', justifyContent: 'center' }} >
                            <View style={{
                                borderRadius: 100,
                                backgroundColor: designTokens.colors.background.level2,
                                padding: 10
                            }}>
                                <GovIcon height={25} fill={designTokens.colors.accent.primary + 'aa'} />
                            </View>
                            <Text style={styles.topRowSubheading}>Gov</Text>
                        </Pressable>

                        <Pressable style={{ alignItems: 'center', justifyContent: 'center' }} >
                            <View style={{
                                borderRadius: 100,
                                backgroundColor: designTokens.colors.background.level2,
                                padding: 10
                            }}>
                                <Ionicons name="people" size={24} color={designTokens.colors.accent.primary + 'aa'} />
                            </View>
                            <Text style={styles.topRowSubheading}>Social</Text>
                        </Pressable>

                        <Pressable style={{ alignItems: 'center', justifyContent: 'center' }} >
                            <View style={{
                                borderRadius: 100,
                                backgroundColor: designTokens.colors.background.level2,
                                padding: 10
                            }}>
                                <MoreIcon height={25} fill={designTokens.colors.accent.primary} fillOpacity={0.6} />
                            </View>
                            <Text style={styles.topRowSubheading}>More</Text>
                        </Pressable>

                    </View>
                </View>
            }
            renderItem={({ item }) => (
                <Pressable style={{
                    ...styles.card,
                    backgroundColor: designTokens.colors.background.level2
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
    hero: {
        paddingVertical: 6,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    input: {
        height: 40,
        marginVertical: 8,
        borderWidth: 1,
        backgroundColor: designTokens.colors.background.level2,
        borderColor: designTokens.colors.text.secondary,
        color: designTokens.colors.accent.primary,
        borderRadius: 20,
        padding: 12,
    },
    heading: {
        fontFamily: designTokens.typography.bold,
        color: designTokens.colors.primary[300],
        fontSize: 20
    },
    grid: {
        width: '100%',
        minHeight: '100%',
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
    },
    topRowIcon: {
        borderRadius: 100,
        backgroundColor: designTokens.colors.background.level2,
        padding: 10
    },
    topRowSubheading: {
        fontSize: 10,
        paddingTop: 4,
        color: designTokens.colors.background.level2,
    },
});

export default AllAttributes;
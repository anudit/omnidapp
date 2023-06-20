import React, { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import {View, Text, StyleSheet, ScrollView, Pressable, TextInput, FlatList} from 'react-native';
import * as Linking from 'expo-linking';
import { SafeAreaView } from 'react-native-safe-area-context';
import designTokens from '../../assets/designTokens';

const mockData = [{
  title: '> 18',
  issuer: 'Omnid',
  description: 'Lorem Ipsum'
},{
  title: 'Indian',
  issuer: 'Government of India',
  description: 'Lorem Ipsum'
},{
  title: '> 18',
  issuer: 'Omnid',
  description: 'Lorem Ipsum'
},{
  title: 'Indian',
  issuer: 'Government of India',
  description: 'Lorem Ipsum'
},{
  title: '> 18',
  issuer: 'Omnid',
  description: 'Lorem Ipsum'
},{
  title: 'Indian',
  issuer: 'Government of India',
  description: 'Lorem Ipsum'
},{
  title: '> 18',
  issuer: 'Omnid',
  description: 'Lorem Ipsum'
},{
  title: 'Indian',
  issuer: 'Government of India',
  description: 'Lorem Ipsum'
},{
  title: '> 18',
  issuer: 'Omnid',
  description: 'Lorem Ipsum'
},{
  title: 'Indian',
  issuer: 'Government of India',
  description: 'Lorem Ipsum'
},{
  title: '> 18',
  issuer: 'Omnid',
  description: 'Lorem Ipsum'
},{
  title: 'Indian',
  issuer: 'Government of India',
  description: 'Lorem Ipsum'
},{
  title: 'Indian',
  issuer: 'Government of India',
  description: 'Lorem Ipsum'
},{
  title: '> 18',
  issuer: 'Omnid',
  description: 'Lorem Ipsum'
},{
  title: 'Indian',
  issuer: 'Government of India',
  description: 'Lorem Ipsum'
},{
  title: '> 18',
  issuer: 'Omnid',
  description: 'Lorem Ipsum'
},{
  title: 'Indian',
  issuer: 'Government of India',
  description: 'Lorem Ipsum'
}].map((data, id)=>{return {...data, id}})

const cardColors = [
  designTokens.colors.teal['400'],
  designTokens.colors.green['400'],
  designTokens.colors.brown['400'],
]

const Home = () => {

    const [dlData, setDlData] = useState(false);

    useEffect(() => {
        const handleDeepLink = async (event) => {
            if (event.url) {
              // Parse the deep link URL
              const { path, queryParams } = Linking.parse(event.url);
        
              // Check if the deep link is valid
              if (path === 'home') {
                setDlData(event.url);
              }
            }
        };
    
        Linking.addEventListener('url', handleDeepLink);
    }, [])

    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={mockData}
          style={styles.grid} 
          key={'connectedProofs'}
          numColumns={2}
          ItemSeparatorComponent={() => <View style={{height: 5}} />}
          ListHeaderComponent={()=>(
            <>
              <View style={styles.hero}>
                <Text style={styles.heading}>My</Text>
                <Text style={styles.heading}>Omnid</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Find Proofs"
              />
            </>
          )}
          renderItem={({item}) => (
            <Pressable style={{
              ...styles.card, 
              backgroundColor: cardColors[Math.floor(Math.random()*cardColors.length)]
            }} >
              <Text style={styles.cardHeading}>{item.title}</Text>
              <Text style={styles.cardSubHeading}>{item.issuer}</Text>
            </Pressable>
          )}
          ListFooterComponent={()=>(
            <Text>{dlData || 'No Deeplink Data'}</Text>
          )}
          keyExtractor={item => String(item.id)}
        />
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      backgroundColor: designTokens.colors.background,
      color: designTokens.colors.text.primary,
      minHeight: 100,
      width: '100%',
      paddingTop: 10,
      paddingHorizontal: 10
    },
    hero: {
      paddingVertical: 2,
    },
    input: {
      height: 40,
      marginVertical: 8,
      borderWidth: 1,
      borderRadius: 20,
      padding: 12,
    },
    heading: {
      fontFamily: designTokens.typography.bold, 
      fontSize: 50
    },
    grid: {
      width: '100%',
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
      color: designTokens.colors.text.secondary,
    }
});

export default Home;
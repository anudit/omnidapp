import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import '@ethersproject/shims/dist/index';
import { ethers } from 'ethers';
import { NativeBaseProvider, Button } from "native-base";
import * as SecureStore from 'expo-secure-store';


async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key, {
    requireAuthentication: true
  });
  if (result) {
    alert("🔐 Here's your value 🔐 \n" + result);
  } else {
    alert('No values stored under that key.');
  }
}

export default function App() {

  const [isLoading, setIsLoading] = useState(false);

  const store = async () => {
    setIsLoading(true);

    const w = ethers.Wallet.createRandom();
    await SecureStore.setItemAsync('ETH_KEY', w.privateKey, {
      requireAuthentication: true
    });
    console.log({ add: w.address, pk:  w.privateKey});

    setTimeout(()=>{
      setIsLoading(false);
    }, 4000)
  };

  useEffect(()=>{
    console.info('isLoading now', isLoading);
  },[isLoading])

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <Text>Enclave Test</Text>
        <Button _loading={{
            bg: "green.400:alpha.70",
            _text: {
              color: "coolGray.700"
            }
          }} onPress={store} isLoading={isLoading} disabled={isLoading} isLoadingText="Storing" _spinner={{
            color: "white"
          }}>Store</Button>
          <Button onPress={()=>{
            getValueFor('ETH_KEY')
          }}>
            Get
          </Button>
        <StatusBar style="auto" />
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  buttonPressed: {
    backgroundColor: '#0D47A1',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

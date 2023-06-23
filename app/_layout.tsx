import { Stack, Tabs } from 'expo-router';
import { SplashScreen, Slot } from "expo-router";
import { useFonts, DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// import "react-native-get-random-values"
// import "@ethersproject/shims"

import { useEffect, useState } from 'react';

const StackLayout = () => {

    let [fontsLoaded] = useFonts({
        DMSans_400Regular, DMSans_500Medium, DMSans_700Bold
    });

    let [loading, setLoading] = useState(true);

    useEffect(()=>{
        setTimeout(()=>{
            setLoading(false)
        }, 3000)
    }, [])

    if (loading === true) {
        return  <SplashScreen/>;
    }

    return (
        <SafeAreaProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen name="approve" options={{headerShown: false, presentation: 'modal'}}/>
            </Stack>
        </SafeAreaProvider>
    )
}
export default StackLayout;
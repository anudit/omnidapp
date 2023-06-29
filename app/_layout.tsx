import { useEffect, useState } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { useFonts, DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootSiblingParent } from 'react-native-root-siblings';
import * as Device from 'expo-device';

// ethers
import "react-native-get-random-values"
import "@ethersproject/shims"

import designTokens from '../assets/designTokens.json';
import { useSettingsStore } from '../stores/settings';
import { useAccountStore } from '../stores/accountStore';
import InsecureDevice from './insecureDevice';

const StackLayout = () => {

    let [fontsLoaded] = useFonts({
        DMSans_400Regular, DMSans_500Medium, DMSans_700Bold
    });

    const [integrityCheck, setIntergrityCheck] = useState<null | boolean>(null);

    const {hasHydrated} = useSettingsStore();
    const {hasHydrated: hasHydratedAccounts} = useAccountStore();

    useEffect(()=>{
        async function runIntegrityChecks(){
            if (integrityCheck === null){
                let isRooted = await Device.isRootedExperimentalAsync();
                let isDevice = Device.isDevice;
                if (__DEV__) isDevice = true
                setIntergrityCheck(!isRooted && isDevice)
            }
        }
        runIntegrityChecks();
    }, [])

    if (fontsLoaded && hasHydrated && hasHydratedAccounts && integrityCheck != null) {
        if (integrityCheck === true){
            return (
                <RootSiblingParent>
                    <SafeAreaProvider>
                        <Stack>
                            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                            <Stack.Screen name="approve" options={{
                                headerShown: true, 
                                presentation: 'modal',
                                headerTintColor: designTokens.colors.text.primary,
                                headerTitle: 'Approve Request',
                                headerBlurEffect: 'light',
                                headerStyle: {
                                    backgroundColor: designTokens.colors.background.level3
                                },
                            }}/>
                            <Stack.Screen name="settings" options={{
                                headerShown: true,
                                headerTintColor: designTokens.colors.text.primary,
                                headerTitle: 'Settings',
                                headerBlurEffect: 'light',
                                headerStyle: {
                                    backgroundColor: designTokens.colors.background.level3
                                },
                            }}/>
                            <Stack.Screen name="insecureDevice" options={{
                                headerShown: false
                            }}/>
                        </Stack>
                    </SafeAreaProvider>
                </RootSiblingParent>
            )
        }
        else {
            return (
                <InsecureDevice />
            )
        }
    }
    else {
        return  <SplashScreen/>;
    }

    
}
export default StackLayout;
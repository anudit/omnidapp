import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold, useFonts } from '@expo-google-fonts/dm-sans';
import * as Device from 'expo-device';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// ethers
import "@ethersproject/shims";
import "react-native-get-random-values";

import designTokens from '../assets/designTokens.json';
import { useAccountStore } from '../stores/accountStore';
import { useSettingsStore } from '../stores/settings';
import InsecureDevice from './insecureDevice';

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: 'home',
};

SplashScreen.preventAutoHideAsync();


const StackLayout = () => {

    const [fontsLoaded] = useFonts({
        DMSans_400Regular, DMSans_500Medium, DMSans_700Bold
    });

    const [integrityCheck, setIntegrityCheck] = useState<null | boolean>(null);

    const { hasHydrated } = useSettingsStore();
    const { hasHydrated: hasHydratedAccounts } = useAccountStore();

    useEffect(() => {
        async function runIntegrityChecks() {
            if (integrityCheck === null) {
                const isRooted = await Device.isRootedExperimentalAsync();
                let isDevice = Device.isDevice;
                if (__DEV__) isDevice = true
                setIntegrityCheck(!isRooted && isDevice)
            }
        }
        runIntegrityChecks();
    }, [])


    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded && hasHydrated && hasHydratedAccounts && integrityCheck != null) {
            // This tells the splash screen to hide immediately! If we call this after
            // `integrityCheck`, then we may see a blank screen while the app is
            // loading its initial state and rendering its first pixels. So instead,
            // we hide the splash screen once we know the root view has already
            // performed layout.
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, hasHydrated, hasHydratedAccounts, integrityCheck]);

    if ((fontsLoaded && hasHydrated && hasHydratedAccounts && integrityCheck != null) === false) {
        return null;
    }

    if (integrityCheck === true) {
        return (
            <RootSiblingParent>
                <SafeAreaProvider>
                    <Stack onLayout={onLayoutRootView}>
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="approve" options={{
                            headerShown: true,
                            presentation: 'modal',
                            headerTintColor: designTokens.colors.text.primary,
                            headerTitle: 'Approve Request',
                            headerBlurEffect: 'light',
                            headerStyle: {
                                backgroundColor: designTokens.colors.background.level3
                            },
                        }} />
                        <Stack.Screen name="settings" options={{ headerShown: false }} />
                        <Stack.Screen name="insecureDevice" options={{
                            headerShown: false
                        }} />
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
export default StackLayout;
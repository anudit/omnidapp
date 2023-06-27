import { Stack, Tabs } from 'expo-router';
import { SplashScreen, Slot } from "expo-router";
import { useFonts, DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import designTokens from '../assets/designTokens.json';
import { RootSiblingParent } from 'react-native-root-siblings';

import "react-native-get-random-values"
import "@ethersproject/shims"

import { useSettingsStore } from '../stores/settings';
import { useAccountStore } from '../stores/accountStore';

const StackLayout = () => {

    let [fontsLoaded] = useFonts({
        DMSans_400Regular, DMSans_500Medium, DMSans_700Bold
    });

    const {hasHydrated} = useSettingsStore();
    const {hasHydrated: hasHydratedAccounts, basePubKey, setupBase} = useAccountStore();

    if (fontsLoaded && hasHydrated && hasHydratedAccounts) {
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
                    </Stack>
                </SafeAreaProvider>
            </RootSiblingParent>
        )
    }
    else {
        return  <SplashScreen/>;
    }

    
}
export default StackLayout;
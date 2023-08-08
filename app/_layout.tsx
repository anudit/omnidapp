import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold, useFonts } from '@expo-google-fonts/dm-sans';
import * as Device from 'expo-device';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAccountStore } from '@/stores/accountStore';
import { useSettingsStore } from '@/stores/settings';
import designTokens from '../assets/designTokens.json';
import InsecureDevice from '../components/insecureDevice';

const StackLayout = () => {

  const [fontsLoaded] = useFonts({
    DMSans_400Regular, DMSans_500Medium, DMSans_700Bold
  });

  const [integrityCheck, setIntergrityCheck] = useState<null | boolean>(null);

  const { hasHydrated } = useSettingsStore();
  const { hasHydrated: hasHydratedAccounts } = useAccountStore();

  useEffect(() => {
    async function runIntegrityChecks() {
      if (integrityCheck === null) {
        const isRooted = await Device.isRootedExperimentalAsync();
        let isDevice = Device.isDevice;
        if (__DEV__) isDevice = true
        setIntergrityCheck(!isRooted && isDevice)
      }
    }
    runIntegrityChecks();
  }, [])

  if (fontsLoaded && hasHydrated && hasHydratedAccounts && integrityCheck != null) {
    if (integrityCheck === true) {
      return (
        <RootSiblingParent>
          <SafeAreaProvider>
            <Stack>
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
    return null;
  }


}
export default StackLayout;
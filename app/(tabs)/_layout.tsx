import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import designTokens from '../../assets/designTokens';
import { Pressable } from 'react-native';

const TabBar = () => {

    return (
        <Tabs screenOptions={({ route }) => ({
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarStyle: {
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                height: 55,
                paddingBottom: 5,
                backgroundColor: `#FFFFFFBB`,
                border: 'none',
                position: 'absolute',
                width:'100%',
                maxHeight: 100,
                bottom: 0,
                elevation: 0
            },
            tabBarShowLabel: false,
            tabBarIcon: ({ size, color }) => {
                let iconName;

                if (route.name === 'home') iconName = 'home';
                else if (route.name === 'list') iconName = 'list-ul';
                else if (route.name === 'prove') iconName = 'qrcode';

                return <FontAwesome name={iconName} size={size} color={color} />;
            }
        })}>
            <Tabs.Screen name="home" options={{
                tabBarLabel: 'Home'
            }}/>
            <Tabs.Screen name="prove" options={{
                tabBarLabel: 'Prove',
                tabBarIconStyle: {
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    backgroundColor: designTokens.colors.green['500'],
                }
            }}/>
            <Tabs.Screen name="list" options={{
                tabBarLabel: 'List'
            }}/>
        </Tabs>
    )
}
export default TabBar;

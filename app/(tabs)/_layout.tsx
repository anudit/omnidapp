import { Tabs } from 'expo-router';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import designTokens from '../../assets/designTokens.json';

const TabBar = () => {

    return (
        <Tabs screenOptions={({ route }) => ({
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarActiveTintColor: designTokens.colors.text.primary,
            tabBarStyle: styles.tabBarStyle,
            tabBarShowLabel: true,
            tabBarIcon: ({ size, color, focused }) => {
                let iconName;

                if (route.name === 'home') return focused ? <Ionicons name="home" size={size} color={color} /> : <Ionicons name="home-outline" size={size} color={color} />;
                else if (route.name === 'list') iconName = 'list-ul';
                else if (route.name === 'prove') return focused? <Ionicons name="qr-code" size={size} color={color} /> : <Ionicons name="qr-code-outline" size={size} color={color} />  ;

                return <FontAwesome name={iconName} size={size} color={color} />;
            }
        })}>
            <Tabs.Screen name="home" options={{
                tabBarLabel: 'My Omnid',
            }}/>
            <Tabs.Screen name="prove" options={{
                tabBarLabel: 'Prove',
                tabBarLabelStyle: {
                    display: 'none'
                },
                tabBarIconStyle: {
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    backgroundColor: designTokens.colors.background.level3,
                }
            }}/>
            <Tabs.Screen name="list" options={{
                tabBarLabel: 'List'
            }}/>
        </Tabs>
    )
}
const styles = StyleSheet.create({
    tabBarStyle: {
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        height: 55,
        paddingBottom: 5,
        backgroundColor: designTokens.colors.background.level2,
        border: 'none',
        position: 'absolute',
        width:'100%',
        maxHeight: 100,
        bottom: 0,
        elevation: 0
    }
})
export default TabBar;

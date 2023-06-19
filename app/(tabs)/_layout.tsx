import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons'; 

const TabBar = () => {

    return (
        <Tabs screenOptions={({ route }) => ({
            headerShown: true,
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
            <Tabs.Screen name="list" options={{
                tabBarLabel: 'List'
            }}/>
            <Tabs.Screen name="prove" options={{
                tabBarLabel: 'Prove'
            }}/>
        </Tabs>
    )
}
export default TabBar;

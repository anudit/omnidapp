import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from 'expo-router';
import { StyleSheet, useColorScheme } from 'react-native';
import designTokens from "../../assets/designTokens.json";
/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: designTokens.colors.text.primary,
        tabBarStyle: styles.tabBarStyle,
        tabBarShowLabel: false,
        tabBarIcon: ({ size, color, focused }) => {
          if (route.name === "index")
            return focused ? (
              <Ionicons name="home" size={size} color={color} />
            ) : (
              <Ionicons name="home-outline" size={size} color={color} />
            );
          else if (route.name === 'dev/index')
            return focused ? (
              <Ionicons name="color-wand" size={size} color={color} />
            ) : (
              <Ionicons
                name="color-wand-outline"
                size={size}
                color={color}
              />
            );
          else if (route.name === "scan/index")
            return focused ? (
              <Ionicons name="qr-code" size={size} color={color} />
            ) : (
              <Ionicons name="qr-code-outline" size={size} color={color} />
            );
          else if (route.name === "connections/index")
            return focused ? (
              <MaterialCommunityIcons name="handshake" size={size} color={color} />
            ) : (
              <MaterialCommunityIcons name="handshake-outline" size={size} color={color} />
            );

          return <FontAwesome name="question" size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "My Omnid",
        }}
      />

      <Tabs.Screen
        name="dev/index"
        options={{
          title: 'Dev Page'
        }}
      />
      <Tabs.Screen
        name="dev/totp"
        options={{
          headerShown: true,
          headerTitle: 'TOTP',
          href: null
        }}
      />
      <Tabs.Screen
        name="connections/index"
        options={{
          tabBarLabel: "Connections",
        }}
      />
      <Tabs.Screen
        name="scan/index"
        options={{
          tabBarLabel: "Scanner",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    borderRadius: 100,
    height: 55,
    paddingBottom: 0,
    borderWidth: 2,
    borderColor: designTokens.colors.background.level3,
    backgroundColor: designTokens.colors.background.level2 + "EF",
    border: "none",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    width: "70%",
    maxHeight: 100,
    bottom: 20,
    left: 60,
    elevation: 0,
  },
});
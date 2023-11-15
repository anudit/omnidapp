import { HomeIcon, HomeOutlineIcon } from "@/components/icons";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Link, Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import designTokens from "../../assets/designTokens.json";

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: designTokens.colors.background.level1,
        tabBarInactiveTintColor: designTokens.colors.background.level2 + "88",
        tabBarStyle: styles.tabBarStyle,
        tabBarShowLabel: false,
        tabBarIcon: ({ size, color, focused }) => {
          if (route.name === "index")
            return focused ? (<HomeIcon height={size} fill={color} />) : (<HomeOutlineIcon height={size} fill={color} />);
          else if (route.name === 'dev/index')
            return (<Ionicons name={focused ? "color-wand" : "color-wand-outline"} size={size} color={color} />);
          else if (route.name === "scan/index")
            return (<Ionicons name={focused ? "qr-code" : "qr-code-outline"} size={size} color={color} />);
          else if (route.name === "connections/index")
            return (<MaterialCommunityIcons name={focused ? "handshake" : "handshake-outline"} size={size} color={color} />);
          else return <FontAwesome name="question" size={size} color={color} />;
        },

      })}
      tabBar={(props) =>
        Platform.OS === "ios" ? (
          <BlurView
            style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
            intensity={100}
          >
            <BottomTabBar {...props} />
          </BlurView>
        ) : (
          <BottomTabBar {...props} />
        )
      }
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
          headerStyle: {
            backgroundColor: designTokens.colors.background.level2
          },
          href: null,
          headerRight(props) {
            return (
              <Link href="/scan" asChild>
                <Ionicons name="md-add-outline" size={24} color="black" style={{ paddingHorizontal: 5 }} />
              </Link>
            )
          },
        }}
      />
      <Tabs.Screen
        name="dev/splash"
        options={{
          title: 'Splash',
          href: null,
        }}
      />
      <Tabs.Screen
        name="dev/loc"
        options={{
          title: 'Location',
          href: null,
        }}
      />
      <Tabs.Screen
        name="dev/cam"
        options={{
          title: 'Camera',
          href: null,
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
    borderWidth: 0,
    borderColor: designTokens.colors.background.level3,
    backgroundColor: designTokens.colors.accent.primary + "EF",
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
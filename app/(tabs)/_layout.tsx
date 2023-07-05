import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

import designTokens from "../../assets/designTokens.json";

const TabBar = () => {
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
                    else if (route.name === "list")
                        return focused ? (
                            <Ionicons name="add-circle" size={size + 8} color={color} />
                        ) : (
                            <Ionicons
                                name="add-circle-outline"
                                size={size + 8}
                                color={color}
                            />
                        );
                    else if (route.name === "prove")
                        return focused ? (
                            <Ionicons name="qr-code" size={size} color={color} />
                        ) : (
                            <Ionicons name="qr-code-outline" size={size} color={color} />
                        );

                    return <FontAwesome name="home" size={size} color={color} />;
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
                name="prove"
                options={{
                    tabBarLabel: "Prove",
                    tabBarIconStyle: {
                        width: 55,
                        height: 55,
                        borderRadius: 100,
                        backgroundColor: designTokens.colors.background.level3,
                    },
                }}
            />
            <Tabs.Screen
                name="list"
                options={{
                    tabBarLabel: "List",
                }}
            />
        </Tabs>
    );
};
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
        width: "60%",
        maxHeight: 100,
        bottom: 20,
        left: 80,
        elevation: 0,
    },
});
export default TabBar;

import { init, trackEvent } from "@aptabase/react-native";
import "./utils/shims";

if (!__DEV__) {
    init("A-EU-3012727470");
    trackEvent("app_started");
}

import "expo-router/entry";

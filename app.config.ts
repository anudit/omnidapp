import withAppleSettings, {
  ChildPane,
  Group,
  Switch,
  Title,
} from "@config-plugins/apple-settings";
import { ConfigContext, ExpoConfig } from "expo/config";


module.exports = ({ config }: ConfigContext): Partial<ExpoConfig> => {
  if (!config.plugins) config.plugins = [];


  config = withAppleSettings(config as ExpoConfig, {
    // The name of the .plist file to generate. Root is the default and must be provided.
    Root: {
      // The page object is required. It will be used to generate the .plist file.
      // The contents will be converted directly to plist.
      page: {
        // The `PreferenceSpecifiers` defines the UI elements to generate.
        PreferenceSpecifiers: [
          // Child panes can be used to create nested pages.

          Switch({
            title: "Music and Sounds ♫",
            key: "p_inapp_audio",
            value: true,
          }),

          Group({
            title: "About",
            footerText: "Powered by Omnid",
          }),
          Title({
            title: "Version",
            value: "",
            key: "p_app_version",
          }),
          ChildPane({
            title: "Licenses",
            file: "Licenses",
          }),
          ChildPane({
            title: "Developer Info",
            file: "Developer",
          }),
          ChildPane({
            title: "Runtime",
            file: "Runtime",
          }),
        ],
      },
    },
    // Build-time info
    Developer: {
      page: {
        PreferenceSpecifiers: [
          Title({
            title: "Bundle Identifier",
            value: config.ios?.bundleIdentifier!,
            key: "info_1_pref",
          }),
          Title({
            title: "Expo SDK",
            value: config.sdkVersion ?? "???",
            key: "info_2_pref",
          }),
          Title({
            title: "Scheme",
            value: Array.isArray(config.scheme)
              ? config.scheme.join(", ")
              : config.scheme!,
            key: "info_3_pref",
          }),
        ],
      },
    }
  });

  return config;
};
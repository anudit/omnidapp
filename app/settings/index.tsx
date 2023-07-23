import { AntDesign, Entypo, FontAwesome5 } from '@expo/vector-icons';
import * as Application from 'expo-application';
import * as Clipboard from 'expo-clipboard';
import * as Device from 'expo-device';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import Toast from 'react-native-root-toast';

import designTokens from '../../assets/designTokens.json';
import { HiddenIcon } from '../../components/icons';
import { useAccountStore } from '../../stores/accountStore';
import { useSettingsStore } from '../../stores/settings';

export const copy = async (data: string) => {
    await Clipboard.setStringAsync(data);

    Toast.show('Copied', {
        duration: Toast.durations.LONG,
    });

}

const Settings = () => {

    const { basePubKey } = useAccountStore();
    const { shakeToCancel, toggleShakeToCancel, toggleDeveloperMode, developerMode } = useSettingsStore();
    const router = useRouter();


    return (
        <View style={styles.container}>

            <Text style={styles.settingsHeading}>General</Text>
            <View style={styles?.settingsSection}>
                <View style={styles.settingsRow}>

                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.icon}>
                            <AntDesign name="shake" size={18} color={designTokens.colors.text.primary} />
                        </View>
                        <Text style={styles.settingTitle}>
                            Shake to Cancel
                        </Text>
                    </View>

                    <Switch
                        onValueChange={toggleShakeToCancel}
                        value={shakeToCancel}
                    />

                </View>

                <View style={styles.seperator2} />

                <View style={styles.settingsRow}>

                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[styles.icon, styles.iconBlue]}>
                            <Entypo name="tools" size={18} color={designTokens.colors.text.primary} />
                        </View>
                        <Text style={styles.settingTitle}>
                            Developer Mode
                        </Text>
                    </View>

                    <Switch
                        onValueChange={toggleDeveloperMode}
                        value={developerMode}
                    />

                </View>

            </View>

            <Text style={styles.settingsHeading}>Account Info</Text>
            <View style={styles?.settingsSection}>
                <View style={styles.settingsRow}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.icon}>
                            <FontAwesome5 name="ethereum" size={18} color={designTokens.colors.text.primary} />
                        </View>
                        <Text style={styles.settingTitle}>
                            Address
                        </Text>
                    </View>

                    <Text style={styles.settingValue} onPress={async () => {
                        await copy(basePubKey);
                    }}>
                        {basePubKey.slice(0, 6)}...{basePubKey.slice(basePubKey.length - 4, basePubKey.length)}
                    </Text>
                </View>

                <View style={styles.seperator2} />

                <View style={styles.settingsRow}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[styles.icon, styles.iconBrown]}>
                            <HiddenIcon height={18} fill={designTokens.colors.text.primary} />
                        </View>
                        <Text style={styles.settingTitle}>
                            ZK Id
                        </Text>
                    </View>

                    <Pressable onPress={() => {
                        router.push('/settings/zk');
                    }}>
                        <View style={styles.settingValue} >
                            <Text style={{ fontSize: 18, color: designTokens.colors.text.secondary, marginRight: 6 }}  >Do not Share</Text>
                            <AntDesign name="right" size={15} style={styles.settingValueIcon} />
                        </View>
                    </Pressable>
                </View>
            </View>

            <Text style={styles.settingsHeading}>App Info</Text>
            <View style={styles?.settingsSection}>
                <View style={styles.settingsRow}>
                    <Text style={styles.settingTitle}>
                        Version
                    </Text>

                    <Text style={styles.settingValue} onPress={async () => {
                        await copy(Application.nativeBuildVersion);
                    }}>v{Application.nativeBuildVersion}</Text>
                </View>

                <View style={styles.seperator} />

                <View style={styles.settingsRow}>
                    <Text style={styles.settingTitle}>
                        Device
                    </Text>

                    <Text style={styles.settingValue} onPress={async () => {
                        await copy(`${Device.manufacturer}: ${Device.modelName}`);
                    }}>{Device.manufacturer}: {Device.modelName}</Text>
                </View>
            </View>
        </View>
    )
}

export const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: designTokens.colors.background.level1,
        minHeight: '100%',
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    settingsHeading: {
        color: designTokens.colors.text.secondary,
        textTransform: 'uppercase',
        fontSize: 12,
        marginTop: 12,
        paddingLeft: 25
    },
    settingsBottomDetails: {
        color: designTokens.colors.text.secondary,
        fontSize: 12,
        marginTop: 4,
        paddingLeft: 25
    },
    settingsSection: {
        backgroundColor: designTokens.colors.background.level3,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginVertical: 4,
        borderRadius: 10,
    },
    settingsRow: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        height: 45,
        alignItems: 'center',
        borderBottomRadius: 10,
        paddingHorizontal: 25,
    },
    settingTitle: {
        fontSize: 18,
        color: designTokens.colors.text.primary,
    },
    settingValue: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 18,
        color: designTokens.colors.text.secondary,
    },
    settingValueIcon: {
        color: designTokens.colors.text.secondary,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: designTokens.colors.text.secondary + '44',
    },
    seperator: {
        borderBottomWidth: 1,
        borderBottomColor: designTokens.colors.text.secondary + '22',
        marginStart: 20
    },
    seperator2: {
        borderBottomWidth: 1,
        borderBottomColor: designTokens.colors.text.secondary + '22',
        marginStart: 70
    },
    icon: {
        color: designTokens.colors.text.primary,
        backgroundColor: designTokens.colors.teal[700],
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        borderRadius: 6,
        marginRight: 16,
        height: 30,
        width: 30
    },
    iconBrown: {
        backgroundColor: designTokens.colors.brown[700],
    },
    iconBlue: {
        backgroundColor: '#0096FF',
    }
});

export default Settings;
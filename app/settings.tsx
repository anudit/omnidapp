import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, Switch } from 'react-native';
import * as Linking from 'expo-linking';
import { useAccountStore } from '../stores/accountStore';
import designTokens from '../assets/designTokens.json';
import { useSettingsStore } from '../stores/settings';
import { AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons';
import * as Application from 'expo-application';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';

const Settings = () => {

    const { basePubKey } = useAccountStore();
    const { shakeToCancel, toggleShakeToCancel } = useSettingsStore();

    async function copy(data: string){
        await Clipboard.setStringAsync(data);

        Toast.show('Copied', {
            duration: Toast.durations.LONG,
        });
          
    }

    return (
        <View style={styles.container}>

            <Text style={styles.settingsHeading}>General</Text>
            <View style={styles?.settingsSection}>
                <View style={{...styles.settingsRow, borderBottomWidth: 0}}>

                    <View style={{display: 'flex', flexDirection: 'row', alignItems:'center'}}>
                        <AntDesign name="shake" size={16} color={designTokens.colors.text.primary} style={{marginRight: 8}}/>
                        <Text style={styles.settingTitle}>
                            Shake to Cancel
                        </Text>
                    </View>
                    
                    <Switch
                        // trackColor={{false: '#767577', true: '#81b0ff'}}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleShakeToCancel}
                        value={shakeToCancel}
                    />
                    
                </View>
                
            </View>

            <Text style={styles.settingsHeading}>Account Info</Text>
            <View style={styles?.settingsSection}>
                <View style={{...styles.settingsRow, borderBottomWidth: 0}}>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems:'center'}}>
                        <FontAwesome5 name="ethereum" size={16} color={designTokens.colors.text.primary} style={{marginRight: 8}} />
                        <Text style={styles.settingTitle}>
                            Ethereum Address
                        </Text>
                    </View>

                    <Text style={styles.settingValue} onPress={async ()=>{
                        await copy(basePubKey);
                    }}>
                        {basePubKey.slice(0, 6)}...{basePubKey.slice(basePubKey.length-4, basePubKey.length)}
                    </Text>
                </View>
            </View>

            <Text style={styles.settingsHeading}>App Info</Text>
            <View style={styles?.settingsSection}>
                <View style={{...styles.settingsRow, borderBottomWidth: 0}}>
                
                    <Text style={styles.settingTitle}>
                        Version
                    </Text>

                    <Text style={styles.settingValue} onPress={async ()=>{
                        await copy(Application.nativeBuildVersion);
                    }}>v{Application.nativeBuildVersion}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      backgroundColor: designTokens.colors.background.level1,
      minHeight: '100%',
      width: '100%',
      paddingTop: 10,
      paddingHorizontal: 10
    },
    settingsHeading: {
        color: designTokens.colors.text.secondary,
        marginTop: 12,
        paddingLeft: 12
    },
    settingsSection: {
        backgroundColor: designTokens.colors.background.level3,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: designTokens.colors.text.secondary+'44',
    },
    settingsRow: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        height: 55,
        alignItems:'center',
        borderBottomRadius: 10,
        borderBottomWidth: 1,
        borderBottomColor: designTokens.colors.text.secondary+'44',
        paddingHorizontal: 16,
    },
    settingTitle: {
        fontSize: 18,
        color: designTokens.colors.text.primary,
    },
    settingValue: {
        fontSize: 18,
        color: designTokens.colors.text.secondary,
    }

});

export default Settings;
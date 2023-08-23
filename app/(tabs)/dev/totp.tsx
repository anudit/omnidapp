import { useAccountStore } from '@/stores/accountStore';
import { copy, trimmed } from '@/utils/stringUtils';
import { useLocalSearchParams } from 'expo-router';
import { encode } from 'hi-base32';
import * as OTPAuth from "otpauth";
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Animated, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Swipeable } from 'react-native-gesture-handler';
import designTokens from '../../../assets/designTokens.json';

export type OtpConfig = {
    issuer: string;
    label?: string;
    secret: string;
    algorithm?: string;
    digits?: number;
    period?: number;
}

export default function Prove() {

    const { totpAccounts, addTotpAccount, signMessage, basePubKey } = useAccountStore();
    const [omnidTotpSecret, setOmnidTotpSecret] = useState<false | string>(false);
    const routeParams = useLocalSearchParams();

    useEffect(() => {
        if (routeParams) {
            if (Object.keys(routeParams).includes('issuer') && Object.keys(routeParams).includes('secret')) {
                let possibleNewAccount = JSON.parse(JSON.stringify(routeParams)) as OtpConfig;
                addTotpAccount(possibleNewAccount)
            }
        }
    }, [routeParams])

    useEffect(() => {
        signMessage(JSON.stringify({
            issuer: "Omnid",
            label: basePubKey,
            algorithm: "SHA512",
            digits: 6,
            period: 30,
        })).then((signature) => {
            setOmnidTotpSecret(encode(signature));
        })
    }, [])

    return (
        <SafeAreaView style={[StyleSheet.absoluteFillObject, styles.container]}>
            {
                omnidTotpSecret == false ? <ActivityIndicator size="small" color={designTokens.colors.text.primary} /> : (
                    <OtpCard config={{
                        issuer: "Omnid",
                        label: trimmed(basePubKey as string),
                        algorithm: "SHA512",
                        digits: 6,
                        period: 30,
                        secret: omnidTotpSecret,
                    }} key='omnid-totp' />
                )
            }
            {
                totpAccounts?.length > 0 && totpAccounts.map((e, id) => {
                    return (<OtpCard config={e} key={id} />)
                })
            }
        </SafeAreaView>
    );

}

const OtpCard = ({ config, ...props }: { config: OtpConfig }) => {

    let [totp, setTotp] = useState<string | null>(null);
    let [loading, setLoading] = useState<string>("omnid");
    const { removeTotpAccount } = useAccountStore();

    useEffect(() => {

        setInterval(() => {
            let totpInstance = new OTPAuth.TOTP(config);
            let now = Date.now();
            let localTotp = totpInstance.generate({ timestamp: now });

            if (totp === null || totp != localTotp) { // otp not set or new otp time
                setTotp(localTotp);
            }

        }, 500)

    }, [])

    useEffect(() => {
        setLoading(Date.now().toString());
    }, [totp])

    const renderRightActions = (
        progress: Animated.AnimatedInterpolation<string>,
        dragX: Animated.AnimatedInterpolation<string>,
    ) => {
        const opacity = dragX.interpolate({
            inputRange: [-150, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View style={[styles.deleteButton, { opacity }]}>
                <TouchableOpacity onPress={() => {
                    if (config.issuer !== 'Omnid') {
                        Alert.alert(`Remove ${config.issuer} ${config?.label ? " - " + config?.label : ""}?`, `Are you sure? This process is irrecoverable.`, [
                            {
                                text: 'Cancel',
                                style: 'cancel',
                            },
                            {
                                text: 'Remove',
                                onPress: () => removeTotpAccount(config.secret),
                                style: 'destructive'
                            },
                        ]);
                    }
                }}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    };


    return (
        <Swipeable renderRightActions={renderRightActions} containerStyle={{
            width: '100%'
        }}>
            <View style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginVertical: 12, paddingHorizontal: 12 }} >

                <View style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                    <Text style={{ color: designTokens.colors.text.secondary, fontSize: 16 }} onPress={() => {
                        copy(config.label || "")
                    }}>{config.issuer} — {config.label}</Text>
                </View>

                <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} >
                    {totp != null ? (
                        <>
                            <Text style={{ color: designTokens.colors.accent.primary, fontSize: 30, fontWeight: 600 }} onPress={() => {
                                copy(totp || "")
                            }}>
                                {totp.slice(0, 2) + " " + totp.slice(2, 4) + " " + totp.slice(4)}
                            </Text>
                            <CountdownCircleTimer
                                isPlaying
                                key={loading}
                                duration={30}
                                size={30}
                                strokeWidth={15}
                                strokeLinecap='butt'
                                trailColor='#00000000'
                                colors={[designTokens.colors.accent.secondary as `#${string}`, '#F7B801', '#A30000', '#A30000']}
                                colorsTime={[7, 5, 2, 0]}
                            />
                        </>
                    ) : (
                        <ActivityIndicator size="small" color={designTokens.colors.text.primary} />
                    )}
                </View>

            </View>

        </Swipeable>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        margin: 0,
        backgroundColor: designTokens.colors.background.level1,
    },
    text: {
        color: designTokens.colors.text.primary,
    },
    deleteButton: {
        backgroundColor: '#b60000',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
    },
    deleteButtonText: {
        color: '#fcfcfc',
        fontWeight: 'bold',
        paddingHorizontal: 8,
    },
});

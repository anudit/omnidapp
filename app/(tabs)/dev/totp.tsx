import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { copy } from '@/utils/stringUtils';
import * as OTPAuth from "otpauth";
import { useEffect, useState } from 'react';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import designTokens from '../../../assets/designTokens.json';

type OtpConfig = {
    issuer?: string | undefined;
    label?: string | undefined;
    secret?: string | undefined;
    algorithm?: string | undefined;
    digits?: number | undefined;
    period?: number | undefined;
}

export default function Prove() {

    const configs: OtpConfig[] = [{
        issuer: "ACME",
        label: "AzureDiamond",
        algorithm: "SHA512",
        digits: 6,
        period: 30,
        secret: "NB2W45DFOIZA",
    },
    {
        issuer: "Github",
        label: "email@demo.com",
        algorithm: "SHA512",
        digits: 6,
        period: 30,
        secret: "BB2X45DAOIZA",
    }
    ];

    return (
        <SafeAreaView style={[StyleSheet.absoluteFillObject, styles.container]}>
            {
                configs.map((e, id) => {
                    return (<OtpCard config={e} key={id} />)
                })
            }
        </SafeAreaView>
    );

}

const OtpCard = ({ config, ...props }: { config: OtpConfig }) => {

    let [totp, setTotp] = useState<string | null>(null);
    let [loading, setLoading] = useState<string>("omnid");

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

    return (
        <View style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginVertical: 12, marginHorizontal: 8 }} >

            <View style={{ width: '94%', display: 'flex', flexDirection: 'row' }}>
                <Text style={{ color: designTokens.colors.text.secondary, fontSize: 16 }}>{config.issuer} — {config.label}</Text>
            </View>

            <View style={{ width: '94%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} >
                {totp != null ? (
                    <>
                        <Text style={{ color: designTokens.colors.text.primary, fontSize: 30 }} onPress={() => {
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
    }
});
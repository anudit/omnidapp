import { useAccountStore } from '@/stores/accountStore';
import { StyleSheet, Text, View } from 'react-native';
import designTokens from '../../../assets/designTokens.json';
import CustomButton from '../../../components/Button';

import { customParse } from '@/utils/stringUtils';
import { OmnidContext, OmnidContextType } from '@omnid/react-native';
import { useAssets } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { useContext, useEffect, useState } from 'react';

// function hash(message: string) {
//     let data = keccak256('0x' + BigInt(message).toString(16).padStart(32, '0') as `0x${string}`);
//     return BigInt(data) >> BigInt(8);
// }

export default function Splash() {

    const { getSignInParams, getZkId } = useAccountStore();
    const [assets, error] = useAssets([require('@/assets/semaphore20.zkey'), require('@/assets/semaphore20wasm.wasm')]);
    const [timetaken, setTimetaken] = useState<null | string>(null);
    const { calculateWitness, makeProof } = useContext<OmnidContextType>(OmnidContext);

    useEffect(() => {
        console.log('assets', assets);
    }, [assets])

    async function newprove() {

        if (assets) {

            const zkey_b64: string = await FileSystem.readAsStringAsync(
                assets[0].localUri as string,
                {
                    encoding: 'base64',
                });
            const wasm_b64: string = await FileSystem.readAsStringAsync(
                assets[1].localUri as string,
                {
                    encoding: 'base64',
                });

            const inputs = `{
                "secret":"4637505213860527644677471401163827442169413584000678379355924621899285121313",
                "merkleProofLength":0,
                "merkleProofIndices":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                "merkleProofSiblings":[{"type":"bigint","value":"0"},{"type":"bigint","value":"0"},{"type":"bigint","value":"0"},{"type":"bigint","value":"0"},{"type":"bigint","value":"0"},{"type":"bigint","value":"0"},{"type":"bigint","value":"0"},{"type":"bigint","value":"0"},{"type":"bigint","value":"0"},{"type":"bigint","value":"0"},{"type":"bigint","value":"0"},{"type":"bigint","value":"0"},{"type":"bigint","value":"0"},{"type":"bigint","value":"0"},{"type":"bigint","value":"0"},{"type":"bigint","value":"0"},{"type":"bigint","value":"0"},{"type":"bigint","value":"0"},{"type":"bigint","value":"0"},{"type":"bigint","value":"0"}],
                "scope":{"type":"bigint","value":"381991507470523043981536760298699211324388782897715347961370496096313610818"},
                "message":{"type":"bigint","value":"399238958547074346153252979109550161048897131470228685258686791810759620296"}
            }`;
            const finalInputs = customParse(inputs);

            let st1 = Date.now();
            const wtnsBase64 = await calculateWitness(Buffer.from(wasm_b64, 'base64'), finalInputs);
            // const wtns = await witnessCalculationNative(new Uint8Array(
            //     Buffer.from(wasm_b64, 'base64')
            // ),
            //     finalInputs
            // );\
            let end1 = Date.now();

            let st = Date.now();
            const { proof, publicSignals } = await makeProof(zkey_b64, wtnsBase64);
            let end = Date.now();
            console.log({ proof, publicSignals });
            setTimetaken(`wtns: ${end1 - st1}ms, prove:${end - st}ms`);
        }
        else {
            alert('Assets not loaded');
        }

    }
    return (<View style={styles.container}>
        <CustomButton
            title="New Prove"
            onPress={newprove}
        />
        <Text>{timetaken ? timetaken : 'Click prove'}</Text>

    </View>)
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: designTokens.colors.background.level1,
        color: designTokens.colors.text.primary,
        minHeight: '100%',
        width: '100%',
        paddingTop: 100,
        paddingHorizontal: 10
    },
    button: {
        marginVertical: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: designTokens.colors.background.level3,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonIcon: {
        marginRight: 10,
        color: designTokens.colors.text.primary
    },
    buttonText: {
        color: designTokens.colors.text.primary,
    }
});

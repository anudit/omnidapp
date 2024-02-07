import { useAccountStore } from '@/stores/accountStore';
import { StyleSheet, Text, View } from 'react-native';
import designTokens from '../../../assets/designTokens.json';
import CustomButton from '../../../components/Button';

import { OmnidContext, OmnidContextType } from '@/contexts/OmnidProvider';
import { customParse } from '@/utils/stringUtils';
import { useAssets } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { useContext, useEffect, useState } from 'react';

// function hash(message: string) {
//     let data = keccak256('0x' + BigInt(message).toString(16).padStart(32, '0') as `0x${string}`);
//     return BigInt(data) >> BigInt(8);
// }

export default function Splash() {

    const { getSignInParams, getZkId } = useAccountStore();
    const [assets, error] = useAssets([require('@/assets/semaphore20.zkey'), require('@/assets/semaphore20.wasm')]);
    const [timetaken, setTimetaken] = useState<null | number>(null);
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
                "identityTrapdoor":"10493889280776160598735183227836681719142754444365750280242886208123809342207",
                "identityNullifier":"12519882754656241677915614486023660123232569718248015913939115130169437063179",
                "treePathIndices":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                "treeSiblings":[{"type":"bigint","value":"72536837793382353857766664600029564596379343648020771091641483823512744933"},{"type":"bigint","value":"11599423870540728895045676983082282148702704454476470330059414722641033697566"},{"type":"bigint","value":"1127520796881217343987681885215210990166711812208894874276851058120732281105"},{"type":"bigint","value":"2711571884751886055531469890957513778707143058393092148099307560576108559244"},{"type":"bigint","value":"1789388906732912109524066314513258655060081764011840746171519014836876772218"},{"type":"bigint","value":"582964291693045403936709592343560876020366787402753543236478101614352958252"},{"type":"bigint","value":"11807717547964046244064709391787792000461338536272439284715955728419525580659"},{"type":"bigint","value":"2618630034848387376205875317462171941117533864938459881381670827265210678824"},{"type":"bigint","value":"21788894002785300424317994620212112042063431426028919421405981678525536220148"},{"type":"bigint","value":"20267468033604064348191693405892554554516887987993735630079373192529765683381"},{"type":"bigint","value":"21293443394674032174194404458995023860759205298576815130824632401112019426558"},{"type":"bigint","value":"1596446600402602634917363894010436935282352400144922352882876639641333866108"},{"type":"bigint","value":"6936350102176258626811821283233242768841799757529748889508302992679059925357"},{"type":"bigint","value":"18798072398960416633789351877096808918864386833403640230453169121327931578546"},{"type":"bigint","value":"5346284295180628014688042959644292163328207787600154829977251752708200408371"},{"type":"bigint","value":"18940072850614243109943038885675314906659100070336172634303614229451343702425"},{"type":"bigint","value":"15780300262861168060558856835698353723222268065687479197141681695858463599226"},{"type":"bigint","value":"2217668277589842727243322117061624603092131353058845218921642417787922188024"},{"type":"bigint","value":"13666232878702307089799293078027105292040095780466265084877807836900202894778"},{"type":"bigint","value":"10489507655578435438967951959486478747913401831101658574977874696240522651825"}],
                "externalNullifier":{"type":"bigint","value":"19294337688111215638762259118342779263845159822340624178332770327294449608"},
                "signalHash":{"type":"bigint","value":"314150433780107863330007685576672190099936159311573437744142218768842406803"}
            }`;
            const finalInputs = customParse(inputs);

            const wtnsBase64 = await calculateWitness(Buffer.from(wasm_b64, 'base64'), finalInputs);
            let st = Date.now();
            const { proof, publicSignals } = await makeProof(zkey_b64, wtnsBase64);
            let end = Date.now();
            console.log({ proof, publicSignals });
            setTimetaken(end - st);
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
        <Text>{timetaken ? timetaken + 'ms' : 'Click prove'}</Text>

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
        paddingTop: 30,
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

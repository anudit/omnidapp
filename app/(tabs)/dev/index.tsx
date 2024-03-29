import { AuthRequestConfig, exchangeCodeAsync, useAuthRequest } from 'expo-auth-session';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import designTokens from '../../../assets/designTokens.json';
import { OmnidIcon, XIcon } from '../../../components/icons';

import { gql, useQuery } from '@apollo/client';
import * as Notifications from 'expo-notifications';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import type { types as TwitterTypes } from "twitter-api-sdk";
import CustomButton from '../../../components/Button';
import { useAccountStore } from '../../../stores/accountStore';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

WebBrowser.maybeCompleteAuthSession();

const userInfoUrl = `https://api.twitter.com/2/users/me?user.fields=${['created_at', 'id', 'name', 'username', 'verified', 'url', 'public_metrics', 'verified_type'].toString()}`;
type userInfoType = TwitterTypes.paths['/2/users/me']['get']['responses']['200']['content']['application/json'];

const discovery = {
    authorizationEndpoint: "https://twitter.com/i/oauth2/authorize",
    tokenEndpoint: "https://api.twitter.com/2/oauth2/token",
    revocationEndpoint: "https://api.twitter.com/2/oauth2/revoke",
};

const twitterConfig: AuthRequestConfig = {
    clientId: 'SmhldjlKRzV0TzBFdmlXVElQLWg6MTpjaQ',
    redirectUri: 'https://deeplinktest.anuditnagar.repl.co/redirectLocal.html',
    usePKCE: true,
    scopes: [
        "users.read",   // to get the profile data
        "tweet.read",   // to get the profile data
        "follows.read", // to get the public metrics data
    ],
}

function replacer(key: any, value: any) {
    if (typeof value === 'bigint') {
        return {
            type: 'bigint',
            value: value.toString()
        };
    } else {
        return value;
    }
}

type BigNumberish = string | bigint;
type FullProof = {
    merkleTreeRoot: BigNumberish;
    signal: BigNumberish;
    nullifierHash: BigNumberish;
    externalNullifier: BigNumberish;
    proof: Proof;
};
type Proof = [
    BigNumberish,
    BigNumberish,
    BigNumberish,
    BigNumberish,
    BigNumberish,
    BigNumberish,
    BigNumberish,
    BigNumberish
];


const GET_GROUPS = gql`
{
    groups(first: 5) {
      id
      merkleTree {
        root
        depth
      }
      members {
        index
        identityCommitment
      }
      verifiedProofs {
        signal
        timestamp
      }
      timestamp
      admin
    }
}
`;


export default function List() {

    const [user, setUser] = useState<userInfoType['data'] | null>(null);
    const [forgingProof, setForgingProof] = useState<boolean>(false);
    const { getSignInParams, getZkId } = useAccountStore();
    const router = useRouter();

    const [request, response, promptAsync] = useAuthRequest({
        ...twitterConfig,
        state: getZkId().commitment.toString()
    }, discovery);

    const { loading, error, data } = useQuery(GET_GROUPS);

    const getCurrentUser = async (accessToken: string): Promise<userInfoType> => {
        const response = await fetch(userInfoUrl, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        return response.json()
    }


    useEffect(() => {
        if (response?.type === 'success') {

            const { code } = response.params;
            exchangeCodeAsync(
                {
                    clientId: twitterConfig.clientId,
                    scopes: twitterConfig.scopes,
                    redirectUri: twitterConfig.redirectUri,
                    code,
                    extraParams: { code_verifier: request?.codeVerifier || '' },
                },
                discovery
            ).then(resp => {
                getCurrentUser(resp.accessToken).then(e => e?.data).then(setUser);
            }).catch(console.warn);

        }
    }, [response]);

    const webviewRef = useRef<null | WebView>(null);

    function getInjectableJSMessage(message) {
        return `
          (function() {
            document.dispatchEvent(new MessageEvent('message', {
              data: ${JSON.stringify(message)}
            }));
          })();
        `;
    }

    function sendDataToWebView() {

        setForgingProof(true)

        getSignInParams().then(({ signalHash, extNullifier, commitment, merkleProof }) => {

            const trapdoor = getZkId().trapdoor.toString()
            const nullifier = getZkId().nullifier.toString()

            const payload = {
                trapdoor, nullifier, commitment,
                merkleProofPathIndices: merkleProof.pathIndices,
                merkleProofSiblings: JSON.stringify(merkleProof.siblings, replacer),
                extNullifier,
                signal: signalHash,
            }

            // Clipboard.setStringAsync(JSON.stringify(payload))

            if (webviewRef?.current) webviewRef.current.injectJavaScript(
                getInjectableJSMessage(payload)
            );

        });

    }

    function onMessage(data: WebViewMessageEvent) {
        const eventData = data.nativeEvent.data;
        if (eventData.slice(0, 5) === 'error') {
            alert('Error ' + eventData)
        }
        else {
            try {
                const resp = JSON.parse(data.nativeEvent.data) as FullProof;
                alert(resp['signal'])
            } catch {
                alert(data.nativeEvent.data)
            }
        }
        setForgingProof(false)
    }

    async function reg() {
        // let token = await generatePushNotificationsToken();
        // alert(token);
        // Notifications.scheduleNotificationAsync({
        //     content: {
        //         title: "You've got mail! 📬",
        //         body: 'Here is the notification body',
        //         data: { data: 'goes here' },
        //     },
        //     trigger: null,
        // });
    }


    const html = `
      <html>
        <head>
            <title>Gen proof</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>

      <body>

        <button onclick="yolo()">yolo</button>
        <p>Registered Handle: <span id="reghand"></span></p><br/>
        <br/>

        <script src="https://cdn.jsdelivr.net/npm/snarkjs@0.7.2/build/snarkjs.min.js" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js" crossorigin="anonymous"></script>
        <script>

            function reviver(key, value) {
                if (value && value.type == 'bigint') return BigInt(value.value);
                return value;
            }

            function sendToApp(obj) {
                window.ReactNativeWebView.postMessage(obj);
            };

            function onMessage(message) {
                // alert(Object.keys(message.data))
                const parsed = message.data;

                generateProof(
                    {trapdoor: parsed.trapdoor, nullifier: parsed.nullifier, commitment: parsed.commitment},
                    parsed.merkleProofPathIndices,
                    JSON.parse(parsed.merkleProofSiblings, reviver),
                    parsed.extNullifier,
                    parsed.signal
                ).then(resp=>{
                    sendToApp(
                        JSON.stringify(resp)
                    );
                }).catch(e=>{
                    sendToApp('error '+e.message) 
                })

            }

            function yolo(){
                sendToApp('yo');
            }

            function hash(message) {
                message = ethers.BigNumber.from(message).toTwos(256).toHexString()
                message = ethers.utils.zeroPad(message, 32)
            
                return BigInt(ethers.utils.keccak256(message)) >> BigInt(8)
            }
            
            async function generateProof(
                {trapdoor, nullifier, commitment},
                merkleProofPathIndices,
                merkleProofSiblings,
                externalNullifier,
                signal
            ) {
                const finalInputs = {
                    identityTrapdoor: trapdoor,
                    identityNullifier: nullifier,
                    treePathIndices: merkleProofPathIndices,
                    treeSiblings: merkleProofSiblings,
                    externalNullifier: hash(externalNullifier),
                    signalHash: hash(signal)
                };
                console.log('prepost', {
                    pexternalNullifier: externalNullifier,
                    psignalHash: signal,
                    externalNullifier: hash(externalNullifier),
                    signalHash: hash(signal)
                });
                console.log('finalInputs', finalInputs);
                let st = Date.now();
                const { proof, publicSignals } = await snarkjs.groth16.fullProve(
                    finalInputs,
                    'https://res.cloudinary.com/anudit/raw/upload/v1692450767/semaphore_e5uhuw.wasm',
                    'https://res.cloudinary.com/anudit/raw/upload/v1692450780/semaphore_pkyemk.zkey'
                )
                console.log('proof time', Date.now() - st, 'ms');
            
                return {
                    merkleTreeRoot: publicSignals[0],
                    nullifierHash: publicSignals[1],
                    signal: ethers.BigNumber.from(signal).toString(),
                    externalNullifier: ethers.BigNumber.from(externalNullifier).toString(),
                    proof: [
                        proof.pi_a[0],
                        proof.pi_a[1],
                        proof.pi_b[0][1],
                        proof.pi_b[0][0],
                        proof.pi_b[1][1],
                        proof.pi_b[1][0],
                        proof.pi_c[0],
                        proof.pi_c[1]
                    ]
                }
            }

            document.addEventListener("DOMContentLoaded", () => {
                window.addEventListener("message", (message)=>{
                    document.getElementById('reghand').innerText = 'wind reg'
                    onMessage(message)
                }, true);
            });
            </script>
        </body>
        </html>
    `;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.buttonText}>Dev</Text>

            {/* <Text style={styles.buttonText}>req: {request?.url?.toString()}</Text> */}
            <Text style={styles.buttonText}>user: {JSON.stringify(user)}</Text>

            <View style={{ marginVertical: 5, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }} >

                <CustomButton
                    title="Settle"
                    iconLeft={<OmnidIcon style={styles.buttonIcon} fill={designTokens.colors.text.primary} height={18} />}
                    onPress={() => {
                        router.push('/settle?scope=age%2Cnew&redirect_uri=https%3A%2F%2Fomnid.io%2F&state=publicAnnouceId&issuer=0xA73F022a256372837724b28EFbc7bc1876e833C8&issuerSig=0xe509d4480ae90e9df6044e9536b5384fe778e69cdd99d6ffeba421c5d3dbca96447ae13aaf233d546009deeb7b26945a3af2dbfeae21f1c52f3fabc86295974f1c')
                    }}
                />

                <CustomButton
                    title="Make a Proof"
                    iconLeft={<OmnidIcon style={styles.buttonIcon} fill={designTokens.colors.text.primary} height={20} />}
                    onPress={() => {
                        sendDataToWebView()
                    }}
                    isLoading={forgingProof}
                />

                <CustomButton
                    title="TOTP"
                    iconLeft={<OmnidIcon style={styles.buttonIcon} fill={designTokens.colors.text.primary} height={18} />}
                    onPress={() => {
                        router.push('/dev/totp')
                    }}
                />

            </View>

            <View style={{ marginVertical: 5, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }} >

                <CustomButton
                    disabled={!request}
                    title="Connect Twitter"
                    iconLeft={<XIcon fill={designTokens.colors.text.primary} height={18} />}
                    onPress={() => {
                        promptAsync();
                    }}
                />

                <CustomButton
                    isLoading={loading}
                    title="Run Gql"
                    iconLeft={<OmnidIcon style={styles.buttonIcon} fill={designTokens.colors.text.primary} height={18} />}
                    onPress={() => {
                        alert(JSON.stringify(data['groups']))
                    }}
                />

                <CustomButton
                    title="Cam"
                    iconLeft={<OmnidIcon style={styles.buttonIcon} fill={designTokens.colors.text.primary} height={18} />}
                    onPress={() => {
                        router.push('/dev/cam')
                    }}
                />

            </View>


            <View style={{ marginVertical: 5, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }} >
                <CustomButton
                    title="Splash"
                    iconLeft={<OmnidIcon style={styles.buttonIcon} fill={designTokens.colors.text.primary} height={18} />}
                    onPress={() => {
                        router.push('/dev/splash')
                    }}
                />

                <CustomButton
                    title="Notifs"
                    iconLeft={<OmnidIcon style={styles.buttonIcon} fill={designTokens.colors.text.primary} height={18} />}
                    onPress={() => {
                        reg();

                    }}
                />
                <CustomButton
                    title="Location"
                    iconLeft={<OmnidIcon style={styles.buttonIcon} fill={designTokens.colors.text.primary} height={18} />}
                    onPress={() => {
                        router.push('/dev/loc')
                    }}
                />
            </View>

            <View style={{ marginVertical: 5, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }} >

                <CustomButton
                    title="NFC"
                    iconLeft={<OmnidIcon style={styles.buttonIcon} fill={designTokens.colors.text.primary} height={18} />}
                    onPress={() => {
                        router.push('/dev/nfc')
                    }}
                />
                <CustomButton
                    title="rapidsnark"
                    iconLeft={<OmnidIcon style={styles.buttonIcon} fill={designTokens.colors.text.primary} height={18} />}
                    onPress={() => {
                        router.push('/dev/rapidsnark')
                    }}
                />
            </View>


            <View style={{ flex: 1, borderWidth: 1, borderColor: 'red', width: '100%', height: 32, display: 'flex' }}>
                <WebView
                    ref={webviewRef}
                    mixedContentMode="compatibility"
                    originWhitelist={['*']}

                    allowFileAccessFromFileURLs={true}
                    allowUniversalAccessFromFileURLs={true}
                    allowFileAccess={true}

                    javaScriptEnabled={true}
                    scalesPageToFit={true}
                    onMessage={onMessage}
                    domStorageEnabled={true}
                    source={{ html }}
                    cacheEnabled={true}
                    cacheMode='LOAD_CACHE_ELSE_NETWORK'
                />
            </View>


        </SafeAreaView>
    )
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
        paddingTop: 10,
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

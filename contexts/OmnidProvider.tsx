import { customStringify } from "@/utils/stringUtils";
import { createContext, useEffect, useRef } from "react";
import { View } from "react-native";

import { groth16Prove } from "@iden3/react-native-rapidsnark";
import { fromByteArray } from "react-native-quick-base64";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { CircuitSignals, Groth16Proof, PublicSignals } from "snarkjs";
import { witnessStr } from "./witness";

export type OmnidContextType = {
    calculateWitness: (binary: Uint8Array, inputs: CircuitSignals) => Promise<string>,
    makeProof: (zkey_base64: string, witness_base64: string) => Promise<{ proof: Groth16Proof, publicSignals: PublicSignals }>
}

export const OmnidContext = createContext<OmnidContextType>({} as OmnidContextType);

export const OmnidProvider = (props: any) => {
    const webViewRef = useRef<WebView>();
    let resolveMethod: any;

    useEffect(() => {
        ping();
    }, []);

    const ping = () => {
        webViewRef?.current?.postMessage(
            customStringify({
                event: 'echo',
                data: "ping"
            }),
        );
    }

    const eventHandler = (event: WebViewMessageEvent) => {
        if (event.nativeEvent.data != 'undefined') {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('Got from webview', data.event);

            if (!resolveMethod) return;
            if (data.event === 'witnessComplete') {
                resolveMethod(data.data);
            }
        }
        else {
            alert('Webview return undefined');
        }
    }

    const calculateWitness = async (binary: Uint8Array, inputs: any): Promise<string> => {
        webViewRef?.current?.postMessage(
            customStringify({
                event: 'makeWitness',
                binary: fromByteArray(binary),
                inputs
            }),
        );

        console.log("sent to webView");
        return await new Promise((resolve, reject) => {
            resolveMethod = resolve;
        });
    };

    const makeProof = async (zkey_base64: string, witness_base64: string) => {
        const { proof, pub_signals } = await groth16Prove(zkey_base64, witness_base64);
        return {
            proof: JSON.parse(proof) as Groth16Proof,
            publicSignals: JSON.parse(pub_signals) as PublicSignals,
        }
    }

    return (
        <OmnidContext.Provider value={{
            calculateWitness,
            makeProof
        }}>
            <View style={{ flex: 0 }}>
                <WebView
                    ref={webViewRef}
                    style={{ display: 'none', height: 0, width: 0 }}
                    source={{
                        html: ` 
                        <html>
                        <head>
                            <title>Gen Witness</title>
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                        </head>
                
                        <body>
                        <br/><br/><br/><br/>
                        <p>Registered Handle: <span id="reghand"></span></p><br/>
                        <br/>
                        <script>
                        ${witnessStr}
                        </script>
                        <script>
                
                            function reviver(key, value) {
                                if (value && value.type == 'bigint') return BigInt(value.value);
                                return value;
                            }
                
                            function sendToApp(obj) {
                                window.ReactNativeWebView.postMessage(JSON.stringify(obj));
                            };
                
                            async function onMessage(message) {
                                const input = JSON.parse(message.data, reviver);
                                if (input.event == "makeWitness"){
                                    const wasmBuffer = base64ToArrayBuffer(input.binary);
                                    const calculator = await builder(wasmBuffer);
                                    const buff = await calculator.calculateWTNSBin(input.inputs, 0);
                                    const buffB64 = arrayBufferToBase64(buff);
                                    sendToApp({
                                        event: 'witnessComplete',
                                        data: buffB64
                                    })
                                }
                                else {
                                    sendToApp({
                                        event: 'echo',
                                        data: input
                                    })
                                }
                            }

                            document.addEventListener("DOMContentLoaded", () => {
                                window.addEventListener("message", (message)=>{
                                    document.getElementById('reghand').innerText = 'wind reg'
                                    onMessage(message);
                                }, true);
                            });
                            </script>
                        </body>
                        </html>      
                        `,
                    }}

                    // injectedJavaScriptBeforeContentLoaded={witnessStr}
                    onMessage={eventHandler}
                    javaScriptEnabled={true}
                    scalesPageToFit={true}
                    domStorageEnabled={true}
                    cacheEnabled={true}
                    cacheMode='LOAD_CACHE_ELSE_NETWORK'
                    onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        console.warn('WebView error: ', nativeEvent);
                    }}
                />
            </View>
            {props.children}
        </OmnidContext.Provider>
    );

}
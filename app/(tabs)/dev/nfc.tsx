import Button from '@/components/Button';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';

export default function Loc() {

    const [data, setData] = useState();

    const encodeTextRecord = (message: string) => Ndef.encodeMessage([Ndef.textRecord(message)]);

    async function read() {

        try {
            // register for the NFC tag with NDEF in it
            await NfcManager.requestTechnology(NfcTech.Ndef);
            // the resolved tag object will contain `ndefMessage` property
            const tag = await NfcManager.getTag();
            setData(tag)
            console.warn('Tag found', tag);
        } catch (ex) {
            console.warn('Oops!', JSON.stringify(ex));
        } finally {
            // stop the nfc scanning
            NfcManager.cancelTechnologyRequest();
        }
    }

    async function send() {

        try {
            // register for the NFC tag with NDEF in it
            await NfcManager.requestTechnology(NfcTech.Ndef);
            const data = await NfcManager.ndefHandler.writeNdefMessage(encodeTextRecord('hello from omnid!'));

            console.log('sent', data);
        } catch (ex) {
            console.warn('Oops!', JSON.stringify(ex));
        } finally {
            // stop the nfc scanning
            NfcManager.cancelTechnologyRequest();
        }
    }

    async function cancel() {

        NfcManager.cancelTechnologyRequest();
    }

    useEffect(() => {
    }, []);

    return (
        <View style={styles.container}>

            <Text>{data && JSON.stringify(data)}</Text>

            <View style={{ marginVertical: 5, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }} >

                <Button title='Send NFC' onPress={send} />
                <Button title='Read NFC' onPress={read} />
                <Button title='Cancel NFC' onPress={cancel} />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 20,
    },
    paragraph: {
        fontSize: 18,
        textAlign: 'center',
    },
});

import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';

export const trimmed = (str: string, start = 6, end = 4) => {
    return str.slice(0, start) + '...' + str.slice(str.length - end, str.length);
}

export const copy = async (data: string) => {
    await Clipboard.setStringAsync(data);

    Toast.show('Copied', {
        duration: Toast.durations.LONG,
    });

}

export const customStringify = (data: any) => {
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
    return JSON.stringify(data, replacer);
}

export const customParse = (data: string) => {
    function reviver(key: any, value: any) {
        if (value && value.type == 'bigint') return BigInt(value.value);
        return value;
    }
    return JSON.parse(data, reviver);
}
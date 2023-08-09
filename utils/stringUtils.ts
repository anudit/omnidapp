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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Text, View } from 'react-native';

import { Link } from 'expo-router';
import { useAccountStore } from '../../stores/accountStore';
import { trimmed } from '../../utils/stringUtils';
import { copy, styles } from './index';

const List = () => {

    const { getZkId } = useAccountStore();

    return (
        <View style={styles.container}>

            <Text style={styles.settingsHeading}>Semaphore Details</Text>
            <View style={styles?.settingsSection}>
                <View style={styles.settingsRow}>

                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.settingTitle}>
                            Commitment
                        </Text>
                    </View>

                    <Text style={styles.settingValue} onPress={async () => {
                        await copy(getZkId().commitment.toString());
                    }}>
                        {trimmed(getZkId().commitment.toString(), 5, 5)}
                    </Text>

                </View>

                <View style={styles.seperator} />

                <View style={styles.settingsRow}>
                    <Button
                        title="Check the Chain"
                    />
                    {/* <Text style={{ ...styles.settingValue, color: '#0096FF' }}>Check the Chain</Text> */}
                </View>

                <View style={styles.seperator} />

                <Link href={'/(tabs)'}>
                    <View style={{ ...styles.settingsRow, justifyContent: 'center' }}>
                        <MaterialCommunityIcons name="export" size={24} color={'#ff6961'} style={{ marginRight: 5 }} />
                        <Text style={{ ...styles.settingValue, color: '#ff6961' }}>Export</Text>
                    </View>
                </Link>

            </View>
            <Text style={styles.settingsBottomDetails}>
                This is extremly private data that can compromise your Identity. Tread Carefully.
            </Text>

        </View>
    )
}

export default List;
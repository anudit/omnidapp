import { Stack, useGlobalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

const Profile = () => {

    const { profileId } = useGlobalSearchParams();

    return (
        <View>
            <Stack.Screen options={{ headerTitle: `Details of ${profileId}` }} />
            <Text>Profile #{profileId}</Text>
        </View>
    )
}
export default Profile;
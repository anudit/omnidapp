import { Stack, useSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

const Profile = () => {

    const { profileId } = useSearchParams();

    return (
        <View>
            <Stack.Screen options={{ headerTitle: `Details of ${profileId}` }} />
            <Text>Profile #{profileId}</Text>
        </View>
    )
}
export default Profile;
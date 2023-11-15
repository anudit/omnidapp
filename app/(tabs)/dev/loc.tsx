import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const toRadians = (degrees: number) => degrees * Math.PI / 180;

function calculateDistance(lat1: number, lon1: number, alt1: number, lat2: number, lon2: number, alt2: number) {
    const R = 6377830.272;

    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const deltaPhi = toRadians(lat2 - lat1);
    const deltaLambda = toRadians(lon2 - lon1);

    // Calculate the distance on the Earth's surface using the Haversine formula
    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    let distance = R * c;

    // Adjust for altitude differences
    const altDiff = alt1 - alt2;
    distance = Math.sqrt(distance * distance + altDiff * altDiff);

    return distance; // returns distance in meters
}

const locations = {
    'rameshwaram': {
        lat: 12.9703,
        long: 77.6445
    }
}
const headAccEnum: { [key: number]: string } = {
    3: "high accuracy", 2: "medium accuracy", 1: "low accuracy"
}


export default function Loc() {
    const [location, setLocation] = useState<null | Location.LocationObject>(null);
    const [heading, setHeading] = useState<null | Location.LocationHeadingObject>(null);

    async function getLocation() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({ accuracy: Location.LocationAccuracy.BestForNavigation });
        setLocation(location);
    }

    async function getHeading() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access location was denied');
            return;
        }

        let head = await Location.getHeadingAsync();
        setHeading(head);
    }

    useEffect(() => {
        setInterval(() => {
            getLocation()
            getHeading()
        }, 4000)
    }, []);

    return (
        <View style={styles.container}>
            {location != null ? (
                <>
                    <Text style={styles.paragraph}>lat: {location.coords.latitude}</Text>
                    <Text style={styles.paragraph}>lang: {location.coords.longitude}</Text>
                    <Text style={styles.paragraph}>acc: +-{location.coords.accuracy?.toFixed(2)}m</Text>
                    <View style={{ marginTop: 10 }} />
                    <Text style={styles.paragraph}>altitude: {location.coords.altitude?.toFixed(2)} m +- {location.coords.altitudeAccuracy?.toFixed(2)} m</Text>
                    <View style={{ marginTop: 10 }} />
                    <Text style={styles.paragraph}>speed: {location.coords.speed?.toFixed(3)} m/s</Text>
                    <View style={{ marginTop: 10 }} />
                    <Text style={styles.paragraph}>fake: {JSON.stringify(location.mocked)}</Text>
                    <Text style={styles.paragraph}>timestamp: {new Date(location.timestamp).toLocaleString()}</Text>
                    <View style={{ marginTop: 10 }} />
                    <Text style={styles.paragraph}>Dist from Rameshwaram:{calculateDistance(
                        location.coords.latitude,
                        location.coords.longitude,
                        location.coords.altitude as number,
                        locations.rameshwaram.lat,
                        locations.rameshwaram.long,
                        location.coords.altitude as number - 10,
                    ).toFixed(3)} m</Text>
                </>
            ) : (<></>)}
            {heading != null ? (
                <>
                    <Text style={styles.paragraph}>headingAcc: {headAccEnum[heading.accuracy]}</Text>
                    <Text style={styles.paragraph}>magHeading: {heading.magHeading.toFixed(2)} deg</Text>
                    <Text style={styles.paragraph}>trueHeading: {heading.trueHeading.toFixed(2)} deg</Text>
                </>
            ) : (<></>)}
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

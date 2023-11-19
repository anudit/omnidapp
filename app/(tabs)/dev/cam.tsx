
import modelPath from '@/assets/iphone.glb';
import { useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { Camera, CameraType } from 'expo-camera';
import { useFocusEffect } from 'expo-router';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SensorType, useAnimatedSensor } from 'react-native-reanimated';

function Model({ animatedSensor }) {

    const gltf = useGLTF(modelPath);
    const mesh = useRef();

    useFrame((state, delta) => {
        let { x, y, z } = animatedSensor.sensor.value;
        x = ~~(x * 100) / 5000;
        y = ~~(y * 100) / 5000;
        mesh.current.rotation.x += x;
        mesh.current.rotation.y += y;
    });

    return (
        <mesh ref={mesh} rotation={[0, 0, 0]} scale={0.5}>
            <primitive object={gltf.scene} />
        </mesh>
    );
}

export default function Loc() {

    const animatedSensor = useAnimatedSensor(SensorType.GYROSCOPE, {
        interval: 100,
    });

    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [mountCamera, setMountCamera] = useState(false);
    useEffect(() => {
        requestPermission()
    }, [])
    const { height } = useWindowDimensions();
    const width = Math.ceil((height * 9) / 16);

    useFocusEffect(
        useCallback(() => {
            setMountCamera(true);

            return () => {
                setMountCamera(false);
            };
        }, [])
    );

    if (mountCamera) {
        return (<Camera ratio="16:9" style={{
            height: "100%",
            width: width + (0.1 * width)
        }} type={CameraType.back} >
            <Canvas shadows >
                <ambientLight />
                <Suspense fallback={null}>
                    <Model animatedSensor={animatedSensor} />
                </Suspense>
            </Canvas>
        </Camera>)
    }
    else {

        return (
            <View style={{ flex: 1 }}>
                <Text>Loading</Text>
            </View>
        )
    }

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

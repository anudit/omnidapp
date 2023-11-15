import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedProps,
    useSharedValue,
} from 'react-native-reanimated';
import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const LorenzAttractor = ({ txnHash }: { txnHash: string }) => {
    // const { width, height } = Dimensions.get('window');
    const width = 400;
    const height = 400;
    const points = useRef([]);
    const svgRef = useRef(null);

    const animatedPath = useSharedValue('');

    useEffect(() => {
        // Define the Lorenz Attractor parameters
        const a = 10;
        const b = 28;
        const c = 8 / 3;
        const dt = 0.01;
        let x = 0.1;
        let y = 0;
        let z = 0;

        const updatePath = () => {
            const dx = a * (y - x) * dt;
            const dy = (x * (b - z) - y) * dt;
            const dz = (x * y - c * z) * dt;
            x += dx;
            y += dy;
            z += dz;

            // Scale the x and y coordinates to fit inside the 400x400 box
            const scaledX = (x + 30) * (width / 60); // Adjust scaling factors as needed
            const scaledY = (z + 5) * (height / 80); // Adjust scaling factors as needed

            points.current.push([scaledX, scaledY]);
            animatedPath.value = points.current
                .map((point) => `L ${point[0]} ${point[1]}`)
                .join(' ');
        };

        const animation = () => {
            updatePath();
            requestAnimationFrame(animation);
        };

        animation();
    }, []);

    const animatedPathProps = useAnimatedProps(() => {
        return {
            d: `M ${width / 2} ${height / 2} ${animatedPath.value}`,
        };
    });

    return (
        <View>
            <Svg ref={svgRef} width={width} height={height}>
                <Defs>
                    <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="white" />
                        <Stop offset="100%" stopColor="gray" />
                    </LinearGradient>
                </Defs>
                <AnimatedPath
                    animatedProps={animatedPathProps}
                    fill="none"
                    stroke="url(#gradient)" // Apply the gradient to the stroke
                    strokeWidth={2}
                />
            </Svg>
        </View>
    );
};

export default LorenzAttractor;

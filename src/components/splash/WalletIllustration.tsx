import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Rect, G } from 'react-native-svg';
import Animated, { 
  useAnimatedProps, 
  SharedValue, 
  interpolate 
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
  progress: SharedValue<number>;
  color: string;
  size?: number;
}

export const WalletIllustration: React.FC<Props> = ({ progress, color, size = 120 }) => {
  // Simple "opening" effect by manipulating the top flap path or rotation
  // Here we'll animate a flap using a custom path
  
  const flapAnimatedProps = useAnimatedProps(() => {
    // Animate the top edge of the flap to simulate "opening"
    // At 0: closed, At 1: open
    const yOffset = interpolate(progress.value, [0, 1], [0, -20]);
    
    return {
      transform: [
        { translateY: yOffset },
        { rotateX: `${interpolate(progress.value, [0, 1], [0, -30])}deg` }
      ]
    };
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {/* Wallet Body (Back) */}
        <Rect x="15" y="40" width="70" height="45" rx="8" fill={color} opacity="0.2" />
        
        {/* Wallet Main Content (Cards) */}
        <G opacity={progress}>
           <Rect x="25" y="30" width="50" height="30" rx="4" fill={color} opacity="0.4" />
           <Rect x="20" y="35" width="60" height="30" rx="4" fill={color} opacity="0.6" />
        </G>

        {/* Wallet Front Body */}
        <Rect x="15" y="45" width="70" height="40" rx="8" fill={color} />
        
        {/* Flap/Latch */}
        <Animated.View animatedProps={flapAnimatedProps as any}>
           <Path 
             d="M15 45 C 15 35, 85 35, 85 45 L 85 55 L 15 55 Z" 
             fill={color} 
             opacity="0.8"
           />
           <Rect x="70" y="48" width="15" height="8" rx="2" fill="#fff" opacity="0.3" />
        </Animated.View>
      </Svg>
    </View>
  );
};

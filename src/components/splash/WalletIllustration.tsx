import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Rect, G } from 'react-native-svg';
import Animated, { 
  useAnimatedProps, 
  SharedValue, 
  interpolate 
} from 'react-native-reanimated';

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
  progress: SharedValue<number>;
  color: string;
  size?: number;
}

export const WalletIllustration: React.FC<Props> = ({ progress, color, size = 120 }) => {
  
  const contentAnimatedProps = useAnimatedProps(() => {
    return {
      opacity: progress.value,
      transform: [
        { translateY: interpolate(progress.value, [0, 1], [10, 0]) }
      ]
    };
  });

  const flapAnimatedProps = useAnimatedProps(() => {
    // Simulate flap opening with scaleY and translateY
    // ScaleY goes from 1 (closed) to -0.5 (flipped up/open)
    const scaleY = interpolate(progress.value, [0, 1], [1, -0.6]);
    const translateY = interpolate(progress.value, [0, 1], [0, 35]); // Adjust to keep pivot at top
    
    return {
      transform: [
        { translateY },
        { scaleY }
      ]
    };
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {/* Wallet Body (Back) */}
        <Rect x="15" y="40" width="70" height="45" rx="8" fill={color} opacity={0.2} />
        
        {/* Wallet Main Content (Cards) - Now properly animated */}
        <AnimatedG animatedProps={contentAnimatedProps}>
           <Rect x="25" y="30" width="50" height="30" rx="4" fill={color} opacity={0.4} />
           <Rect x="20" y="35" width="60" height="30" rx="4" fill={color} opacity={0.6} />
        </AnimatedG>

        {/* Wallet Front Body */}
        <Rect x="15" y="45" width="70" height="40" rx="8" fill={color} />
        
        {/* Flap/Latch - Using AnimatedG with pivot-simulated scaleY */}
        <AnimatedG animatedProps={flapAnimatedProps}>
           <Path 
             d="M15 45 C 15 35, 85 35, 85 45 L 85 55 L 15 55 Z" 
             fill={color} 
             opacity={0.8}
           />
           <Rect x="70" y="48" width="15" height="8" rx="2" fill="#fff" opacity={0.3} />
        </AnimatedG>
      </Svg>
    </View>
  );
};


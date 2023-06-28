import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const OmnidIcon = (props:SvgProps)=> {
  return (
    <Svg width={24} height={24} viewBox="0 0 512 512" {...props}>
        <Path d="M262.2 498.2C92.8 486 91.4 43.9 253.1 13.8c169.6 9.7 169.1 460.3 9.1 484.4zM338.9 256c4.3-52.2-28.1-295.4-114.3-206.1-64.5 109.3-62.9 302.5 0 412.2 87.2 89.6 118.1-154.2 114.3-206.1z"/>
        <Path d="M501.3 314.7v6h-1.5v9c-50.5 112.8-453 116.7-484.4-9 12.2-132.7 460.5-132.8 484.4-6h1.5zM257.6 253c-68.3 1.1-140.6 8.5-203.1 37.6-28.2 22.8-31 31.4 0 54.2 53.6 46.9 451.9 59.3 427.2-37.6-47.5-49.8-157.3-51.9-224.1-54.2z"/>
    </Svg>
  );
}

export const QrFrameIcon = (props:SvgProps)=> {
  return (
    <Svg width={24} height={24} viewBox="0 0 273 273" {...props}>
        <Path fill='#fff' d="M88 273H46c-12 0-22-5-30-13S3 241 3 229v-44h17v44a27 27 0 0 0 27 27h41v17zm182-88v44a43 43 0 0 1-43 44h-42v-17h41a27 27 0 0 0 28-27v-44h16zM185 0h41c12 0 23 5 31 13s13 19 13 31v44h-17V44a27 27 0 0 0-27-28h-41V0zM46 0h42v17H46a27 27 0 0 0-27 27v44H2V44A44 44 0 0 1 46 0z"/>    
    </Svg>
  );
}
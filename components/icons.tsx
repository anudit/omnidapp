import Svg, { Path, SvgProps } from 'react-native-svg';

export const OmnidIcon = (props: SvgProps) => {
  return (
    <Svg width={24} height={24} viewBox="0 0 512 512" {...props}>
      <Path d="M262.2 498.2C92.8 486 91.4 43.9 253.1 13.8c169.6 9.7 169.1 460.3 9.1 484.4zM338.9 256c4.3-52.2-28.1-295.4-114.3-206.1-64.5 109.3-62.9 302.5 0 412.2 87.2 89.6 118.1-154.2 114.3-206.1z" />
      <Path d="M501.3 314.7v6h-1.5v9c-50.5 112.8-453 116.7-484.4-9 12.2-132.7 460.5-132.8 484.4-6h1.5zM257.6 253c-68.3 1.1-140.6 8.5-203.1 37.6-28.2 22.8-31 31.4 0 54.2 53.6 46.9 451.9 59.3 427.2-37.6-47.5-49.8-157.3-51.9-224.1-54.2z" />
    </Svg>
  );
}

export const QrFrameIcon = (props: SvgProps) => {
  return (
    <Svg width={24} height={24} viewBox="0 0 352 352" {...props}>
      <Path fill='#ffffff' d="M343 8c-6-5-13-8-22-8h-29v12h29c10 0 19 8 19 18v30h12V29c0-7-3-15-9-21ZM9 8c-6 6-9 14-9 21v31h11V29c0-4 3-9 6-12 4-4 9-6 14-6h29V0H31C22 0 15 3 9 8Zm332 315c0 10-9 18-19 18h-29v11h29c9 0 16-3 22-8 6-6 9-13 9-21v-31h-12v31ZM17 335c-3-3-5-8-5-13v-30H0v31c0 7 4 15 9 21 6 5 14 8 22 8h29v-12H31c-5 0-10-2-14-5Z" />
    </Svg>
  );
}
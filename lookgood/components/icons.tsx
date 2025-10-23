import React from 'react';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const SunIcon = ({ size = 24, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    <Line x1="128" y1="40" x2="128" y2="32" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <Circle cx="128" cy="128" r="56" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <Line x1="64" y1="64" x2="56" y2="56" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <Line x1="64" y1="192" x2="56" y2="200" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <Line x1="192" y1="64" x2="200" y2="56" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <Line x1="192" y1="192" x2="200" y2="200" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <Line x1="40" y1="128" x2="32" y2="128" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <Line x1="128" y1="216" x2="128" y2="224" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <Line x1="216" y1="128" x2="224" y2="128" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </Svg>
);

export const MoonIcon = ({ size = 24, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    <Line x1="208" y1="120" x2="208" y2="72" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <Line x1="232" y1="96" x2="184" y2="96" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <Line x1="160" y1="32" x2="160" y2="64" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <Line x1="176" y1="48" x2="144" y2="48" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <Path 
      d="M210.69,158.18A96.78,96.78,0,0,1,192,160,96.08,96.08,0,0,1,97.82,45.31,88,88,0,1,0,210.69,158.18Z" 
      stroke={color} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="16"
    />
  </Svg>
);


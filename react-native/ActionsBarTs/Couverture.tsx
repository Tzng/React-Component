/**
 * @author tangbin
 * @date 2019/3/30-16:06
 * @descriptions: 遮罩层
 */
import React from 'react';
import { Dimensions, View } from 'react-native';
import ZlTouchable from './ZlTouchable';

interface IProps {
  /**
   * 显示还是隐藏
   */
  isShow: boolean;
  /**
   * 透明度
   */
  opacity?: number;
  /**
   * 点击回调
   */
  onPress?: () => void;
  /**
   * 层级
   */
  zIndex?: number;
}

export default function ({ isShow, opacity, onPress, zIndex }: IProps) {
  const { height } = Dimensions.get('window');
  if (isShow) {
    return (
      <ZlTouchable
        onPress={onPress}
        activeOpacity={1}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          height,
          zIndex: zIndex || 1000
        }}
      >
        <View style={{ opacity, backgroundColor: 'black', flex: 1 }}/>
      </ZlTouchable>
    );
  }
  return null;
}

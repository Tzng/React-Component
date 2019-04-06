/**
 * @author allahbin
 * @date 2019/3/30-16:06
 * @descriptions: 遮罩层
 */
import React from 'react';
import {Animated, Dimensions, StyleSheet, View} from 'react-native';
import ZlTouchable from '../../../components/show/ZlTouchable';

export default function ({ isShow, opacity, onPress, zIndex }) {
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
                    zIndex: zIndex || 200
                }}
            >
                <Animated.View
                    style={{ opacity, backgroundColor: 'black', flex: 1 }}
                >
                    <View />
                </Animated.View>
            </ZlTouchable>
        );
    }
    return null;
}

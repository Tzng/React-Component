import React from 'react';
import { TouchableOpacity } from 'react-native';

class ZlTouchable extends React.Component {
  constructor(props) {
    super(props);
    this.lastClickTime = 0;
  }

  onPress() {
    const { onPress } = this.props;
    const clickTime = Date.now();
    if (!this.lastClickTime || Math.abs(this.lastClickTime - clickTime) > 300) { // 350的时间可以延长，根据需要改变
      this.lastClickTime = clickTime;
      if (onPress) {
        onPress();
      } else {
        return '';
      }
    }
    return '';
  }

  render() {

    const { activeOpacity, style, disabled, children } = this.props;

    return (
      <TouchableOpacity
        onPress={() => this.onPress()}
        activeOpacity={activeOpacity || 0.85}
        style={style}
        disabled={disabled}
      >
        {children}
      </TouchableOpacity>);
  }
}

export default ZlTouchable;

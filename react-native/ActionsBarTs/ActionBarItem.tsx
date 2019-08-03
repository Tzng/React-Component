/**
 *
 * 皓天
 * @memberOf ActionBar
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  StyleSheet, Dimensions, BackHandler
} from 'react-native';
// @ts-ignore
import AntDesign from 'react-native-vector-icons/AntDesign';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import { itemData } from './testData';
import ZlTouchable from './ZlTouchable';
import Couverture from './Couverture';

/**
 * 由id和text组成的选项
 */
export interface IOptions2 {
  /**
   * 文本
   */
  text: any;
  /**
   * 值
   */
  id: any;
}

const { width } = Dimensions.get('window');

export interface IActionBarItemProps {
  /**
     * 传递进来的对象
     */
  data: {
    title: string;
    items: IOptions2[];
  };
  /**
     * 弹窗的高度
     */
  maxHeight: number;
  /**
     * 主题颜色
     */
  themeColor: string;
  /**
     * 确认按钮的回调
     */
  handleSubmit: (data: IOptions2[], type: string) => void;
  /**
     * 点击的回调
     */
  bannerAction: (flag: boolean) => void;
  /**
     * 是否展开
     */
  isActive: boolean;
  /**
     * 单选还是多选
     */
  isSelect: boolean;
}

interface IState {
  // 展开还是收起
  isActive: boolean;
  // 下标数组
  selectKeys: IOptions2[];
  // 被选中的项
  selectItems: IOptions2[];
  rotationAnim: any;
}

class ActionBarItem extends Component<IActionBarItemProps, IState> {

  static defaultProps = {
    themeColor: '#ff8f26',
    maxHeight: 300,
    handleSubmit: (obj: any) => console.log(obj),
    bannerAction: (obj: any) => console.log(obj),
    data: itemData,
    isActive: false,
    isSelect: true
  };

  // 是否展示遮罩层
  isShowCouver: boolean = false;

  constructor(props: IActionBarItemProps) {
    super(props);
    this.state = {
      // 展开还是收起
      isActive: false,
      // 下标数组
      selectKeys: [],
      // 被选中的项
      selectItems: [],
      rotationAnim: new Animated.Value(0),
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  shouldComponentUpdate(nextProps: IActionBarItemProps) {
    const { isActive } = nextProps;
    // 如果要关闭
    if (!isActive) {
      if (this.isShowCouver) {
        this.closePanel();
      }
    } else if (!this.isShowCouver) {
      this.openPanel();
    }
    return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  // 安卓返回键关闭APP
  onBackPress = () => {
    const { isActive, bannerAction } = this.props;
    if (isActive) {
      bannerAction(false);
      return true;
    }
    return false;
  };

  // 渲染每一项
  renderChcek = (item: IOptions2, themeColor: string) => {

    const { selectKeys } = this.state;

    let itemIndex = -1;

    if (selectKeys) {
      // 获取对应的标识
      itemIndex = selectKeys.indexOf(item.id);
    }
    // 获取对应的icon
    return (
      <React.Fragment>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 15,
            flexDirection: 'row',
          }}
        >
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <View style={{ opacity: 1, width: 16, height: 16, marginRight: 5, }} />
            <Text>{item.text}</Text>
          </View>
          {itemIndex > -1 && (
            <AntDesign
              name="check"
              size={16}
              style={{
                marginRight: 10,
                alignSelf: 'center',
                color: themeColor,
              }}
            />
          )}
        </View>
        { itemIndex > -1 && (
          <View style={{ ...styles.line, backgroundColor: themeColor }} />
        )}
      </React.Fragment>
    );
  };

  // 提交操作
  handleSubmit = (type: string) => {
    // 关闭
    this.openOrClosePanel();
    const { handleSubmit } = this.props;
    const { selectItems } = this.state;
    handleSubmit(selectItems, type);
  };

  /**
     * 说明：生成下拉菜单
     * @author tangbin
     * @date 2019/3/29
     * @time 11:04
     */
  renderActivityPanel = () => {

    // 得到数据
    const { data: { items } } = this.props;

    // 得到最大高度
    const { maxHeight, themeColor } = this.props;

    const { rotationAnim } = this.state;

    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 38, // 决定了弹窗距离顶部的距离
          bottom: 0
        }}
      >
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: -(maxHeight + 50),
            width,
            zIndex: 20,
            transform: [
              { translateY: rotationAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, maxHeight + 50]
              }) },
            ]
          }}
        >
          <View style={{ height: maxHeight }}>
            <ScrollView
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'white',
              }}
            >
              {items.map(item => (
                <ZlTouchable
                  key={item.id}
                  style={{ flex: 1, height: 39 }}
                  onPress={() => this.itemOnPress(item)}
                >
                  {this.renderChcek(item, themeColor)}
                </ZlTouchable>
              ))}
            </ScrollView>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <ZlTouchable style={styles.cancel_button} onPress={() => this.handleSubmit('cancel')}>
              <View style={styles.button_text_view}>
                <Text style={styles.cancel_button_text}>取消</Text>
              </View>
            </ZlTouchable>
            <ZlTouchable style={styles.warning_button} onPress={this.handleSubmit}>
              <View style={styles.button_text_view}>
                <Text style={styles.warning_button_text}>确定</Text>
              </View>
            </ZlTouchable>
          </View>
          <View style={styles.line} />
        </Animated.View>
      </View>
    );
  };

  openPanel = () => {
    const { rotationAnim } = this.state;
    this.isShowCouver = true;
    rotationAnim.setValue(0);
    // 使用宽松函数让数值随时间动起来。
    Animated.spring( // 随时间变化而执行动画
      rotationAnim, // 动画中的变量值
      {
        toValue: 1, // 透明度最终变为1，即完全不透明
        useNativeDriver: true // <-- 加上这一行
      }
    ).start();
  };

  // 关闭动画
  closePanel = () => {
    const { rotationAnim } = this.state;
    this.isShowCouver = false;
    rotationAnim.setValue(1);
    // 这里只执行弹窗的动画，是因为遮罩层组件在切换的时候，已经被卸载了
    Animated.spring(
      rotationAnim,
      {
        toValue: 0,
        useNativeDriver: true // <-- 加上这一行
      }
    ).start();
  };

  // 格式化字符串
  split = (data: string) => (data.length > 4 ? data.substring(0, 4) + '...' : data);

  // 对应的项点击
  itemOnPress = (item: IOptions2) => {
    const { selectItems, selectKeys } = this.state;
    const { isSelect } = this.props;
    if (isSelect) {
      // 点击之后，我们判断是否是被选中了的
      if (selectKeys.indexOf(item.id) > -1) {
        // 被选中了 取消选中
        const itemIndex = selectKeys.indexOf(item.id);
        // 移除这一项
        selectItems.splice(itemIndex, 1);
        selectKeys.splice(itemIndex, 1);
      } else {
        // 没有选中，就选中它
        selectItems.push(item);
        selectKeys.push(item.id);
      }
    } else if (selectKeys.indexOf(item.id) > -1) {
      // 如果当前被选中了，取消
      // 点击之后，我们判断是否是被选中了的
      // 移除这一项
      selectItems.length = 0;
      selectKeys.length = 0;
    } else {
      // 没有选中，就选中它
      selectItems.push(item);
      selectKeys.push(item.id);
    }
    // 更新数据
    this.setState({
      selectItems,
      selectKeys
    });
  };

  /**
     * 说明：展开或者收起列表
     * @param flag 展开还是收起
     * @author tangbin
     * @date 2019/3/29
     * @time 13:39
     */
  openOrClosePanel = (flag?: string | boolean) => {
    const { bannerAction } = this.props;
    if (flag === 'close') {
      // 关闭
      bannerAction(true);
      return;
    }
    bannerAction(false);
  };

  render() {

    const { data, children, themeColor, isActive } = this.props;
    const { selectItems } = this.state;

    // 选中的文字
    let itemNames = '';
    selectItems.forEach((item) => { itemNames += item.text; });

    return (
      <React.Fragment>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#e2e2e2',
              zIndex: 30,
              height: 40
            }}
          >
            <ZlTouchable
              onPress={this.openOrClosePanel}
              style={{
                flex: 1,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: themeColor
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={[
                    styles.title_style,
                    {
                      color: '#4a4a4a'
                    }
                  ]}
                >
                  {/* 结果的展示 */}
                  {selectItems.length === 0 ? data.title : this.split(itemNames) + '(' + selectItems.length + ')'}
                </Text>
                <Ionicons
                  name={isActive ? 'ios-arrow-up' : 'ios-arrow-down'}
                  size={16}
                  style={{
                    marginRight: 10,
                    alignSelf: 'center',
                    color: '#4a4a4a',
                  }}
                />
              </View>
            </ZlTouchable>
          </View>
          {children}
        </View>
        {this.renderActivityPanel()}
        {/* 遮罩 */}
        <Couverture
          onPress={() => this.openOrClosePanel('close')}
          isShow={isActive}
          opacity={0.2}
          zIndex={5}
        />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  title_style: {
    fontSize: 16,
    paddingLeft: 5,
    paddingRight: 5
  },
  item_text_style: {
    color: '#333333',
    fontSize: 16
  },
  item_button_style: {

  },
  warning_button: {
    flex: 1,
    backgroundColor: '#ff4428',
    height: 50,
  },
  cancel_button: {
    flex: 1,
    backgroundColor: '#fff',
    height: 50,
  },
  warning_button_text: {
    color: '#fff',
    fontSize: 18,
  },
  cancel_button_text: {
    color: '#848484',
    fontSize: 18,
  },
  button_text_view: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 40,
    right: 40,
    top: 0,
    bottom: 0
  },
  line: {
    height: 0.5,
    opacity: 0.5,
    backgroundColor: 'darkgray',
  },
});

export default ActionBarItem;

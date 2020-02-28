import React from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Text,
  Image,
  ImageBackground,
  View,
  Animated,
  Dimensions,
  StyleSheet
} from 'react-native';

import { NavigationActions } from 'react-navigation';

import Icon from 'react-native-vector-icons/SimpleLineIcons';

import {
  FlingGestureHandler,
  Directions,
  State,
} from 'react-native-gesture-handler';

import style from './style';

import Calendar from './Calendar';
import MoonPhase from './MoonPhase';

const windowWidth = Dimensions.get('window').width;

export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      lastFocusDate: new Date()
    }
    this._touchX = new Animated.Value(windowWidth / 2);
    this._touchX.addListener(function(x) {
      if (x.value > windowWidth) {
        this.fetchData(-1);
        this._touchX.setValue(windowWidth / 2);
      } else if (x.value < 0) {
        this.fetchData(1);
        this._touchX.setValue(windowWidth / 2);
      }
    }.bind(this));
    this._translateX = Animated.add(this._touchX, new Animated.Value(-windowWidth / 2));
    this._translateY = new Animated.Value(0);
  }

  onSwipe(nativeEvent, offset) {
    if (nativeEvent.state === State.ACTIVE) {
      Animated.spring(this._touchX, {
        toValue: this._touchX._value + ((windowWidth / 2) * offset),
        useNativeDriver: true
      }).start();
    }
  }

  componentDidMount() {
    this.fetchData();
    this.focusListener = this.props.navigation.addListener(
      'didFocus',
      () => {
        lastFocusDate = new Date();
        if (this.state.lastFocusDate.getDate() < lastFocusDate.getDate()) {
          // a new day has come since last focused, so reload
          this.fetchData();
        }
        this.setState({
          lastFocusDate: lastFocusDate
        });
      });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  refreshing() {
    return this.state.isLoading;
  }

  render() {
    if (this.refreshing()) {
      return (
        <SafeAreaView>
          <ImageBackground
            resizeMode='stretch'
            style={{width: '100%', height: '100%'}}
            source={require('./assets/images/space.jpg')}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <ActivityIndicator size='large' />
            </View>
          </ImageBackground>
        </SafeAreaView>
      )
    }
    return(
      <SafeAreaView>
        <ImageBackground
            resizeMode='stretch'
            style={{width: '100%', height: '100%'}}
            source={require('./assets/images/space.jpg')}>
          <Icon name='arrow-left' color='grey' size={30} style={{position:'absolute', left:0, top:140, zIndex:1}} />
          <Icon name='arrow-right' color='grey' size={30} style={{position:'absolute', left:windowWidth - 30, top:140, zIndex:1}} />
          <FlingGestureHandler
            direction={Directions.RIGHT}
            onHandlerStateChange={({nativeEvent}) => this.onSwipe(nativeEvent, 1)}>
          <FlingGestureHandler
            direction={Directions.LEFT}
            onHandlerStateChange={({nativeEvent}) => this.onSwipe(nativeEvent, -1)}>
            <Animated.View
              style={{ transform: [
                { translateX: this._translateX },
                { translateY: this._translateY }]
            }}>
            <ScrollView
              refreshControl={
                <RefreshControl tintColor='transparent' refreshing={this.refreshing()} onRefresh={this.fetchData.bind(this)} />
              }
            >
            {this.state.error ?
              <View style={{ height: 600, paddingTop:10 }}>
                <Text style={style.text}>{this.state.error.message}</Text>
              </View>
            :
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={[style.header2, {color: this.state.data.day.color }]}>{this.state.data.day.moon.name.toUpperCase()} MOON {this.state.data.day.moon.number}</Text>
                <Text style={style.header2}>{ this.state.data.day.moon.words.join(' * ')}</Text>
                <Image
                  style={{ width: 160, height: 76 }}
                  source={this.loadToneImage(this.state.data.day.tone.number, this.state.data.day.tone.color)} />
                <Image
                  style={{ width: 160, height: 160 }}
                  source={this.loadTribeImage(this.state.data.day.tribe.number)} />
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <Text style={[style.header2, {color: this.state.data.day.color, paddingRight:8 }]}>{this.state.data.day.glyph}</Text>
                  <Text style={style.header}>{this.state.data.day.moon.name.toUpperCase()} {this.state.data.day.moon.day}</Text>
                </View>
                <Text style={style.header}>{this.state.data.day.date}</Text>
                <Text style={[style.header, { fontSize: 24, color: this.state.data.day.color}]}>{this.state.data.day.name}</Text>
                <Text style={style.text}>Guided by {this.state.data.day.guide}</Text>
                <Text style={[style.header2, { color: this.state.data.day.color}]}>Kin {this.state.data.day.kinNumber}</Text>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <Image
                    style={{ width: 110, height: 110 }}
                    source={this.loadMoonImage(this.state.data.moon.name)} />
                  <View style={{justifyContent:'center'}}>
                    <Text style={style.header}>{this.state.data.moon.name}</Text>
                    <Text style={style.header}>{this.state.data.moon.illuminated}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', flex: 1, paddingTop:10 }}>
                  <View style={{borderRightWidth: 1, borderRightColor: 'white', paddingRight:10}}>
                    <Text style={[style.header2, { color: this.state.data.day.color}]}>Tone: {this.state.data.day.tone.number} {this.state.data.day.tone.name}</Text>
                    <Text style={style.text}>* { this.state.data.day.tone.words.join('\n* ')}</Text>
                  </View>
                  <View style={{paddingLeft:10}}>
                    <Text style={[style.header2, { color: this.state.data.day.color}]}>Tribe: {this.state.data.day.tribe.number} {this.state.data.day.tribe.name}</Text>
                    <Text style={style.text}>* { this.state.data.day.tribe.words.join('\n* ')}</Text>
                  </View>
                </View>
                <Text style={[style.header2, { color: this.state.data.day.color}]}>Affirmation</Text>
                <Text style={[style.text, { textAlign: 'center' }]}>{this.state.data.readings.affirmation.join('\n')}</Text>
              </View>
            }
            </ScrollView>
            </Animated.View>
          </FlingGestureHandler>
          </FlingGestureHandler>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  fetchData(dayOffset=0) {
    this.setState({
      isLoading: true
    });
    now = new Date();
    if (dayOffset != 0) {
      now = new Date(Date.parse(this.state.data.day.date));
      now.setDate(now.getDate() + dayOffset);
    }
    
    try {

      var day = new Calendar().calculateDay(now);
      if (day.error) {
        throw new Error(day.error);
      }
      var data = {
        day: day,
        moon: new MoonPhase().phase(now),
        readings: this.loadReadings(day)
      };

      this.setState({
        isLoading: false,
        data: data,
        error: null
      }, function() {
        // callback
        this.props.navigation.dangerouslyGetParent().dispatch(NavigationActions.setParams({
          key: 'Reading',
          params: {
            data: this.state.data,
            error: null
          }
        }));
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        data: {
          day: {
            date: now.toString().split(' ')[0] + ' ' + now.toString().split(' ')[1] + ' ' + now.toString().split(' ')[2] + ', ' + now.toString().split(' ')[3]
          }
        },
        error: error
      }, function() {
        // callback
        this.props.navigation.dangerouslyGetParent().dispatch(NavigationActions.setParams({
          key: 'Reading',
          params: {
            error: error
          }
        }));
      });
    }
  }

  loadReadings(day) {
    switch (day.kinNumber) {
      case 1: return require('./assets/data/dailykin_1.json');
      case 2: return require('./assets/data/dailykin_2.json');
      case 3: return require('./assets/data/dailykin_3.json');
      case 4: return require('./assets/data/dailykin_4.json');
      case 5: return require('./assets/data/dailykin_5.json');
      case 6: return require('./assets/data/dailykin_6.json');
      case 7: return require('./assets/data/dailykin_7.json');
      case 8: return require('./assets/data/dailykin_8.json');
      case 9: return require('./assets/data/dailykin_9.json');
      case 10: return require('./assets/data/dailykin_10.json');
      case 11: return require('./assets/data/dailykin_11.json');
      case 12: return require('./assets/data/dailykin_12.json');
      case 13: return require('./assets/data/dailykin_13.json');
      case 14: return require('./assets/data/dailykin_14.json');
      case 15: return require('./assets/data/dailykin_15.json');
      case 16: return require('./assets/data/dailykin_16.json');
      case 17: return require('./assets/data/dailykin_17.json');
      case 18: return require('./assets/data/dailykin_18.json');
      case 19: return require('./assets/data/dailykin_19.json');
      case 20: return require('./assets/data/dailykin_20.json');
      case 21: return require('./assets/data/dailykin_21.json');
      case 22: return require('./assets/data/dailykin_22.json');
      case 23: return require('./assets/data/dailykin_23.json');
      case 24: return require('./assets/data/dailykin_24.json');
      case 25: return require('./assets/data/dailykin_25.json');
      case 26: return require('./assets/data/dailykin_26.json');
      case 27: return require('./assets/data/dailykin_27.json');
      case 28: return require('./assets/data/dailykin_28.json');
      case 29: return require('./assets/data/dailykin_29.json');
      case 30: return require('./assets/data/dailykin_30.json');
      case 31: return require('./assets/data/dailykin_31.json');
      case 32: return require('./assets/data/dailykin_32.json');
      case 33: return require('./assets/data/dailykin_33.json');
      case 34: return require('./assets/data/dailykin_34.json');
      case 35: return require('./assets/data/dailykin_35.json');
      case 36: return require('./assets/data/dailykin_36.json');
      case 37: return require('./assets/data/dailykin_37.json');
      case 38: return require('./assets/data/dailykin_38.json');
      case 39: return require('./assets/data/dailykin_39.json');
      case 40: return require('./assets/data/dailykin_40.json');
      case 41: return require('./assets/data/dailykin_41.json');
      case 42: return require('./assets/data/dailykin_42.json');
      case 43: return require('./assets/data/dailykin_43.json');
      case 44: return require('./assets/data/dailykin_44.json');
      case 45: return require('./assets/data/dailykin_45.json');
      case 46: return require('./assets/data/dailykin_46.json');
      case 47: return require('./assets/data/dailykin_47.json');
      case 48: return require('./assets/data/dailykin_48.json');
      case 49: return require('./assets/data/dailykin_49.json');
      case 50: return require('./assets/data/dailykin_50.json');
      case 51: return require('./assets/data/dailykin_51.json');
      case 52: return require('./assets/data/dailykin_52.json');
      case 53: return require('./assets/data/dailykin_53.json');
      case 54: return require('./assets/data/dailykin_54.json');
      case 55: return require('./assets/data/dailykin_55.json');
      case 56: return require('./assets/data/dailykin_56.json');
      case 57: return require('./assets/data/dailykin_57.json');
      case 58: return require('./assets/data/dailykin_58.json');
      case 59: return require('./assets/data/dailykin_59.json');
      case 60: return require('./assets/data/dailykin_60.json');
      case 61: return require('./assets/data/dailykin_61.json');
      case 62: return require('./assets/data/dailykin_62.json');
      case 63: return require('./assets/data/dailykin_63.json');
      case 64: return require('./assets/data/dailykin_64.json');
      case 65: return require('./assets/data/dailykin_65.json');
      case 66: return require('./assets/data/dailykin_66.json');
      case 67: return require('./assets/data/dailykin_67.json');
      case 68: return require('./assets/data/dailykin_68.json');
      case 69: return require('./assets/data/dailykin_69.json');
      case 70: return require('./assets/data/dailykin_70.json');
      case 71: return require('./assets/data/dailykin_71.json');
      case 72: return require('./assets/data/dailykin_72.json');
      case 73: return require('./assets/data/dailykin_73.json');
      case 74: return require('./assets/data/dailykin_74.json');
      case 75: return require('./assets/data/dailykin_75.json');
      case 76: return require('./assets/data/dailykin_76.json');
      case 77: return require('./assets/data/dailykin_77.json');
      case 78: return require('./assets/data/dailykin_78.json');
      case 79: return require('./assets/data/dailykin_79.json');
      case 80: return require('./assets/data/dailykin_80.json');
      case 81: return require('./assets/data/dailykin_81.json');
      case 82: return require('./assets/data/dailykin_82.json');
      case 83: return require('./assets/data/dailykin_83.json');
      case 84: return require('./assets/data/dailykin_84.json');
      case 85: return require('./assets/data/dailykin_85.json');
      case 86: return require('./assets/data/dailykin_86.json');
      case 87: return require('./assets/data/dailykin_87.json');
      case 88: return require('./assets/data/dailykin_88.json');
      case 89: return require('./assets/data/dailykin_89.json');
      case 90: return require('./assets/data/dailykin_90.json');
      case 91: return require('./assets/data/dailykin_91.json');
      case 92: return require('./assets/data/dailykin_92.json');
      case 93: return require('./assets/data/dailykin_93.json');
      case 94: return require('./assets/data/dailykin_94.json');
      case 95: return require('./assets/data/dailykin_95.json');
      case 96: return require('./assets/data/dailykin_96.json');
      case 97: return require('./assets/data/dailykin_97.json');
      case 98: return require('./assets/data/dailykin_98.json');
      case 99: return require('./assets/data/dailykin_99.json');
      case 100: return require('./assets/data/dailykin_100.json');
      case 101: return require('./assets/data/dailykin_101.json');
      case 102: return require('./assets/data/dailykin_102.json');
      case 103: return require('./assets/data/dailykin_103.json');
      case 104: return require('./assets/data/dailykin_104.json');
      case 105: return require('./assets/data/dailykin_105.json');
      case 106: return require('./assets/data/dailykin_106.json');
      case 107: return require('./assets/data/dailykin_107.json');
      case 108: return require('./assets/data/dailykin_108.json');
      case 109: return require('./assets/data/dailykin_109.json');
      case 110: return require('./assets/data/dailykin_110.json');
      case 111: return require('./assets/data/dailykin_111.json');
      case 112: return require('./assets/data/dailykin_112.json');
      case 113: return require('./assets/data/dailykin_113.json');
      case 114: return require('./assets/data/dailykin_114.json');
      case 115: return require('./assets/data/dailykin_115.json');
      case 116: return require('./assets/data/dailykin_116.json');
      case 117: return require('./assets/data/dailykin_117.json');
      case 118: return require('./assets/data/dailykin_118.json');
      case 119: return require('./assets/data/dailykin_119.json');
      case 120: return require('./assets/data/dailykin_120.json');
      case 121: return require('./assets/data/dailykin_121.json');
      case 122: return require('./assets/data/dailykin_122.json');
      case 123: return require('./assets/data/dailykin_123.json');
      case 124: return require('./assets/data/dailykin_124.json');
      case 125: return require('./assets/data/dailykin_125.json');
      case 126: return require('./assets/data/dailykin_126.json');
      case 127: return require('./assets/data/dailykin_127.json');
      case 128: return require('./assets/data/dailykin_128.json');
      case 129: return require('./assets/data/dailykin_129.json');
      case 130: return require('./assets/data/dailykin_130.json');
      case 131: return require('./assets/data/dailykin_131.json');
      case 132: return require('./assets/data/dailykin_132.json');
      case 133: return require('./assets/data/dailykin_133.json');
      case 134: return require('./assets/data/dailykin_134.json');
      case 135: return require('./assets/data/dailykin_135.json');
      case 136: return require('./assets/data/dailykin_136.json');
      case 137: return require('./assets/data/dailykin_137.json');
      case 138: return require('./assets/data/dailykin_138.json');
      case 139: return require('./assets/data/dailykin_139.json');
      case 140: return require('./assets/data/dailykin_140.json');
      case 141: return require('./assets/data/dailykin_141.json');
      case 142: return require('./assets/data/dailykin_142.json');
      case 143: return require('./assets/data/dailykin_143.json');
      case 144: return require('./assets/data/dailykin_144.json');
      case 145: return require('./assets/data/dailykin_145.json');
      case 146: return require('./assets/data/dailykin_146.json');
      case 147: return require('./assets/data/dailykin_147.json');
      case 148: return require('./assets/data/dailykin_148.json');
      case 149: return require('./assets/data/dailykin_149.json');
      case 150: return require('./assets/data/dailykin_150.json');
      case 151: return require('./assets/data/dailykin_151.json');
      case 152: return require('./assets/data/dailykin_152.json');
      case 153: return require('./assets/data/dailykin_153.json');
      case 154: return require('./assets/data/dailykin_154.json');
      case 155: return require('./assets/data/dailykin_155.json');
      case 156: return require('./assets/data/dailykin_156.json');
      case 157: return require('./assets/data/dailykin_157.json');
      case 158: return require('./assets/data/dailykin_158.json');
      case 159: return require('./assets/data/dailykin_159.json');
      case 160: return require('./assets/data/dailykin_160.json');
      case 161: return require('./assets/data/dailykin_161.json');
      case 162: return require('./assets/data/dailykin_162.json');
      case 163: return require('./assets/data/dailykin_163.json');
      case 164: return require('./assets/data/dailykin_164.json');
      case 165: return require('./assets/data/dailykin_165.json');
      case 166: return require('./assets/data/dailykin_166.json');
      case 167: return require('./assets/data/dailykin_167.json');
      case 168: return require('./assets/data/dailykin_168.json');
      case 169: return require('./assets/data/dailykin_169.json');
      case 170: return require('./assets/data/dailykin_170.json');
      case 171: return require('./assets/data/dailykin_171.json');
      case 172: return require('./assets/data/dailykin_172.json');
      case 173: return require('./assets/data/dailykin_173.json');
      case 174: return require('./assets/data/dailykin_174.json');
      case 175: return require('./assets/data/dailykin_175.json');
      case 176: return require('./assets/data/dailykin_176.json');
      case 177: return require('./assets/data/dailykin_177.json');
      case 178: return require('./assets/data/dailykin_178.json');
      case 179: return require('./assets/data/dailykin_179.json');
      case 180: return require('./assets/data/dailykin_180.json');
      case 181: return require('./assets/data/dailykin_181.json');
      case 182: return require('./assets/data/dailykin_182.json');
      case 183: return require('./assets/data/dailykin_183.json');
      case 184: return require('./assets/data/dailykin_184.json');
      case 185: return require('./assets/data/dailykin_185.json');
      case 186: return require('./assets/data/dailykin_186.json');
      case 187: return require('./assets/data/dailykin_187.json');
      case 188: return require('./assets/data/dailykin_188.json');
      case 189: return require('./assets/data/dailykin_189.json');
      case 190: return require('./assets/data/dailykin_190.json');
      case 191: return require('./assets/data/dailykin_191.json');
      case 192: return require('./assets/data/dailykin_192.json');
      case 193: return require('./assets/data/dailykin_193.json');
      case 194: return require('./assets/data/dailykin_194.json');
      case 195: return require('./assets/data/dailykin_195.json');
      case 196: return require('./assets/data/dailykin_196.json');
      case 197: return require('./assets/data/dailykin_197.json');
      case 198: return require('./assets/data/dailykin_198.json');
      case 199: return require('./assets/data/dailykin_199.json');
      case 200: return require('./assets/data/dailykin_200.json');
      case 201: return require('./assets/data/dailykin_201.json');
      case 202: return require('./assets/data/dailykin_202.json');
      case 203: return require('./assets/data/dailykin_203.json');
      case 204: return require('./assets/data/dailykin_204.json');
      case 205: return require('./assets/data/dailykin_205.json');
      case 206: return require('./assets/data/dailykin_206.json');
      case 207: return require('./assets/data/dailykin_207.json');
      case 208: return require('./assets/data/dailykin_208.json');
      case 209: return require('./assets/data/dailykin_209.json');
      case 210: return require('./assets/data/dailykin_210.json');
      case 211: return require('./assets/data/dailykin_211.json');
      case 212: return require('./assets/data/dailykin_212.json');
      case 213: return require('./assets/data/dailykin_213.json');
      case 214: return require('./assets/data/dailykin_214.json');
      case 215: return require('./assets/data/dailykin_215.json');
      case 216: return require('./assets/data/dailykin_216.json');
      case 217: return require('./assets/data/dailykin_217.json');
      case 218: return require('./assets/data/dailykin_218.json');
      case 219: return require('./assets/data/dailykin_219.json');
      case 220: return require('./assets/data/dailykin_220.json');
      case 221: return require('./assets/data/dailykin_221.json');
      case 222: return require('./assets/data/dailykin_222.json');
      case 223: return require('./assets/data/dailykin_223.json');
      case 224: return require('./assets/data/dailykin_224.json');
      case 225: return require('./assets/data/dailykin_225.json');
      case 226: return require('./assets/data/dailykin_226.json');
      case 227: return require('./assets/data/dailykin_227.json');
      case 228: return require('./assets/data/dailykin_228.json');
      case 229: return require('./assets/data/dailykin_229.json');
      case 230: return require('./assets/data/dailykin_230.json');
      case 231: return require('./assets/data/dailykin_231.json');
      case 232: return require('./assets/data/dailykin_232.json');
      case 233: return require('./assets/data/dailykin_233.json');
      case 234: return require('./assets/data/dailykin_234.json');
      case 235: return require('./assets/data/dailykin_235.json');
      case 236: return require('./assets/data/dailykin_236.json');
      case 237: return require('./assets/data/dailykin_237.json');
      case 238: return require('./assets/data/dailykin_238.json');
      case 239: return require('./assets/data/dailykin_239.json');
      case 240: return require('./assets/data/dailykin_240.json');
      case 241: return require('./assets/data/dailykin_241.json');
      case 242: return require('./assets/data/dailykin_242.json');
      case 243: return require('./assets/data/dailykin_243.json');
      case 244: return require('./assets/data/dailykin_244.json');
      case 245: return require('./assets/data/dailykin_245.json');
      case 246: return require('./assets/data/dailykin_246.json');
      case 247: return require('./assets/data/dailykin_247.json');
      case 248: return require('./assets/data/dailykin_248.json');
      case 249: return require('./assets/data/dailykin_249.json');
      case 250: return require('./assets/data/dailykin_250.json');
      case 251: return require('./assets/data/dailykin_251.json');
      case 252: return require('./assets/data/dailykin_252.json');
      case 253: return require('./assets/data/dailykin_253.json');
      case 254: return require('./assets/data/dailykin_254.json');
      case 255: return require('./assets/data/dailykin_255.json');
      case 256: return require('./assets/data/dailykin_256.json');
      case 257: return require('./assets/data/dailykin_257.json');
      case 258: return require('./assets/data/dailykin_258.json');
      case 259: return require('./assets/data/dailykin_259.json');
      case 260: return require('./assets/data/dailykin_260.json');
      default: throw new Error('Could not load ' + (day.date.getMonth() + 1) + '/' + day.date.getDate() + '/' + day.date.getFullYear());
    }
  }

  loadMoonImage(name) {
    switch (name) {
      case 'Waxing Gibbous': return require('./assets/images/moons/moon_waxg.png');
      case 'Waxing Crescent': return require('./assets/images/moons/moon_waxc.png');
      case 'Waning Gibbous': return require('./assets/images/moons/moon_wang.png');
      case 'Waning Crescent': return require('./assets/images/moons/moon_wanc.png');
      case 'New Moon': return require('./assets/images/moons/moon_new.png');
      case 'Last Quarter': return require('./assets/images/moons/moon_lq.png');
      case 'Full Moon': return require('./assets/images/moons/moon_full.png');
      case 'First Quarter': return require('./assets/images/moons/moon_fq.png');
      default: throw new Error('Could not load moon image ' + name);
    }
  }

  loadToneImage(number, color) {
    numberColor = number + '|' + color;
    switch (numberColor) {
      case '1|silver': return require('./assets/images/tones/1s.png');
      case '1|gold': return require('./assets/images/tones/1g.png');
      case '2|silver': return require('./assets/images/tones/2s.png');
      case '2|gold': return require('./assets/images/tones/2g.png');
      case '3|silver': return require('./assets/images/tones/3s.png');
      case '3|gold': return require('./assets/images/tones/3g.png');
      case '4|silver': return require('./assets/images/tones/4s.png');
      case '4|gold': return require('./assets/images/tones/4g.png');
      case '5|silver': return require('./assets/images/tones/5s.png');
      case '5|gold': return require('./assets/images/tones/5g.png');
      case '6|silver': return require('./assets/images/tones/6s.png');
      case '6|gold': return require('./assets/images/tones/6g.png');
      case '7|silver': return require('./assets/images/tones/7s.png');
      case '7|gold': return require('./assets/images/tones/7g.png');
      case '8|silver': return require('./assets/images/tones/8s.png');
      case '8|gold': return require('./assets/images/tones/8g.png');
      case '9|silver': return require('./assets/images/tones/9s.png');
      case '9|gold': return require('./assets/images/tones/9g.png');
      case '10|silver': return require('./assets/images/tones/10s.png');
      case '10|gold': return require('./assets/images/tones/10g.png');
      case '11|silver': return require('./assets/images/tones/11s.png');
      case '11|gold': return require('./assets/images/tones/11g.png');
      case '12|silver': return require('./assets/images/tones/12s.png');
      case '12|gold': return require('./assets/images/tones/12g.png');
      case '13|silver': return require('./assets/images/tones/13s.png');
      case '13|gold': return require('./assets/images/tones/13g.png');
      default: throw new Error('Could not load tone image ' + number);
    }
  }

  loadTribeImage(number) {
    switch (number) {
      case 1: return require('./assets/images/tribes/01.png');
      case 2: return require('./assets/images/tribes/02.png');
      case 3: return require('./assets/images/tribes/03.png');
      case 4: return require('./assets/images/tribes/04.png');
      case 5: return require('./assets/images/tribes/05.png');
      case 6: return require('./assets/images/tribes/06.png');
      case 7: return require('./assets/images/tribes/07.png');
      case 8: return require('./assets/images/tribes/08.png');
      case 9: return require('./assets/images/tribes/09.png');
      case 10: return require('./assets/images/tribes/10.png');
      case 11: return require('./assets/images/tribes/11.png');
      case 12: return require('./assets/images/tribes/12.png');
      case 13: return require('./assets/images/tribes/13.png');
      case 14: return require('./assets/images/tribes/14.png');
      case 15: return require('./assets/images/tribes/15.png');
      case 16: return require('./assets/images/tribes/16.png');
      case 17: return require('./assets/images/tribes/17.png');
      case 18: return require('./assets/images/tribes/18.png');
      case 19: return require('./assets/images/tribes/19.png');
      case 20: return require('./assets/images/tribes/20.png');
      default: throw new Error('Could not load tribe image ' + number);
    }
  }

}

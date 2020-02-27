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
                <Image
                  style={{ width: 160, height: 76 }}
                  source={{ uri: this.state.data.dailykin.tone.image }} />
                <Image
                  style={{ width: 160, height: 160 }}
                  source={{ uri: this.state.data.dailykin.tribe.image }} />
                <Text style={style.header}>{this.state.data.dailykin.day}</Text>
                <Text style={[style.header, { fontSize: 24, color: this.state.data.dailykin.color}]}>{this.state.data.dailykin.name}</Text>
                <Text style={style.text}>Guided by {this.state.data.calendar.guided}</Text>
                <Text style={[style.header2, { color: this.state.data.dailykin.color}]}>Kin {this.state.data.dailykin.kinNumber}</Text>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <Image
                    style={{ width: 110, height: 110 }}
                    source={this.loadMoon(this.state.data.moon.name)} />
                  <View style={{justifyContent:'center'}}>
                    <Text style={style.header}>{this.state.data.moon.name}</Text>
                    <Text style={style.header}>{this.state.data.moon.illuminated}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', flex: 1, paddingTop:10 }}>
                  <View style={{borderRightWidth: 1, borderRightColor: 'white', paddingRight:10}}>
                    <Text style={[style.header2, { color: this.state.data.dailykin.color}]}>Tone: {this.state.data.dailykin.tone.number} {this.state.data.dailykin.tone.name}</Text>
                    <Text style={style.text}>* { this.state.data.dailykin.tone.words.join('\n* ')}</Text>
                  </View>
                  <View style={{paddingLeft:10}}>
                    <Text style={[style.header2, { color: this.state.data.dailykin.color}]}>Tribe: {this.state.data.dailykin.tribe.number} {this.state.data.dailykin.tribe.name}</Text>
                    <Text style={style.text}>* { this.state.data.dailykin.tribe.words.join('\n* ')}</Text>
                  </View>
                </View>
                <Text style={[style.header2, { color: this.state.data.dailykin.color}]}>Affirmation</Text>
                <Text style={[style.text, { textAlign: 'center' }]}>{this.state.data.dailykin.affirmation.join('\n')}</Text>
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
      now = new Date(Date.parse(this.state.data.dailykin.day));
      now.setDate(now.getDate() + dayOffset);
    }
    
    try {

      var day = new Calendar().calculateDay(now);
      if (day.error) {
        throw new Error(day.error);
      }

      const data = this.loadKin(day);
      data.moon = new MoonPhase().phase(now);

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
          dailykin: {
            day: now
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

  loadKin(day) {
    switch (day.kin) {
      case 1: return require('./assets/data/dailykin-1.json');
      case 2: return require('./assets/data/dailykin-2.json');
      case 3: return require('./assets/data/dailykin-3.json');
      case 4: return require('./assets/data/dailykin-4.json');
      case 5: return require('./assets/data/dailykin-5.json');
      case 6: return require('./assets/data/dailykin-6.json');
      case 7: return require('./assets/data/dailykin-7.json');
      case 8: return require('./assets/data/dailykin-8.json');
      case 9: return require('./assets/data/dailykin-9.json');
      case 10: return require('./assets/data/dailykin-10.json');
      case 11: return require('./assets/data/dailykin-11.json');
      case 12: return require('./assets/data/dailykin-12.json');
      case 13: return require('./assets/data/dailykin-13.json');
      case 14: return require('./assets/data/dailykin-14.json');
      case 15: return require('./assets/data/dailykin-15.json');
      case 16: return require('./assets/data/dailykin-16.json');
      case 17: return require('./assets/data/dailykin-17.json');
      case 18: return require('./assets/data/dailykin-18.json');
      case 19: return require('./assets/data/dailykin-19.json');
      case 20: return require('./assets/data/dailykin-20.json');
      case 21: return require('./assets/data/dailykin-21.json');
      case 22: return require('./assets/data/dailykin-22.json');
      case 23: return require('./assets/data/dailykin-23.json');
      case 24: return require('./assets/data/dailykin-24.json');
      case 25: return require('./assets/data/dailykin-25.json');
      case 26: return require('./assets/data/dailykin-26.json');
      case 27: return require('./assets/data/dailykin-27.json');
      case 28: return require('./assets/data/dailykin-28.json');
      case 29: return require('./assets/data/dailykin-29.json');
      case 30: return require('./assets/data/dailykin-30.json');
      case 31: return require('./assets/data/dailykin-31.json');
      case 32: return require('./assets/data/dailykin-32.json');
      case 33: return require('./assets/data/dailykin-33.json');
      case 34: return require('./assets/data/dailykin-34.json');
      case 35: return require('./assets/data/dailykin-35.json');
      case 36: return require('./assets/data/dailykin-36.json');
      case 37: return require('./assets/data/dailykin-37.json');
      case 38: return require('./assets/data/dailykin-38.json');
      case 39: return require('./assets/data/dailykin-39.json');
      case 40: return require('./assets/data/dailykin-40.json');
      case 41: return require('./assets/data/dailykin-41.json');
      case 42: return require('./assets/data/dailykin-42.json');
      case 43: return require('./assets/data/dailykin-43.json');
      case 44: return require('./assets/data/dailykin-44.json');
      case 45: return require('./assets/data/dailykin-45.json');
      case 46: return require('./assets/data/dailykin-46.json');
      case 47: return require('./assets/data/dailykin-47.json');
      case 48: return require('./assets/data/dailykin-48.json');
      case 49: return require('./assets/data/dailykin-49.json');
      case 50: return require('./assets/data/dailykin-50.json');
      case 51: return require('./assets/data/dailykin-51.json');
      case 52: return require('./assets/data/dailykin-52.json');
      case 53: return require('./assets/data/dailykin-53.json');
      case 54: return require('./assets/data/dailykin-54.json');
      case 55: return require('./assets/data/dailykin-55.json');
      case 56: return require('./assets/data/dailykin-56.json');
      case 57: return require('./assets/data/dailykin-57.json');
      case 58: return require('./assets/data/dailykin-58.json');
      case 59: return require('./assets/data/dailykin-59.json');
      case 60: return require('./assets/data/dailykin-60.json');
      case 61: return require('./assets/data/dailykin-61.json');
      case 62: return require('./assets/data/dailykin-62.json');
      case 63: return require('./assets/data/dailykin-63.json');
      case 64: return require('./assets/data/dailykin-64.json');
      case 65: return require('./assets/data/dailykin-65.json');
      case 66: return require('./assets/data/dailykin-66.json');
      case 67: return require('./assets/data/dailykin-67.json');
      case 68: return require('./assets/data/dailykin-68.json');
      case 69: return require('./assets/data/dailykin-69.json');
      case 70: return require('./assets/data/dailykin-70.json');
      case 71: return require('./assets/data/dailykin-71.json');
      case 72: return require('./assets/data/dailykin-72.json');
      case 73: return require('./assets/data/dailykin-73.json');
      case 74: return require('./assets/data/dailykin-74.json');
      case 75: return require('./assets/data/dailykin-75.json');
      case 76: return require('./assets/data/dailykin-76.json');
      case 77: return require('./assets/data/dailykin-77.json');
      case 78: return require('./assets/data/dailykin-78.json');
      case 79: return require('./assets/data/dailykin-79.json');
      case 80: return require('./assets/data/dailykin-80.json');
      case 81: return require('./assets/data/dailykin-81.json');
      case 82: return require('./assets/data/dailykin-82.json');
      case 83: return require('./assets/data/dailykin-83.json');
      case 84: return require('./assets/data/dailykin-84.json');
      case 85: return require('./assets/data/dailykin-85.json');
      case 86: return require('./assets/data/dailykin-86.json');
      case 87: return require('./assets/data/dailykin-87.json');
      case 88: return require('./assets/data/dailykin-88.json');
      case 89: return require('./assets/data/dailykin-89.json');
      case 90: return require('./assets/data/dailykin-90.json');
      case 91: return require('./assets/data/dailykin-91.json');
      case 92: return require('./assets/data/dailykin-92.json');
      case 93: return require('./assets/data/dailykin-93.json');
      case 94: return require('./assets/data/dailykin-94.json');
      case 95: return require('./assets/data/dailykin-95.json');
      case 96: return require('./assets/data/dailykin-96.json');
      case 97: return require('./assets/data/dailykin-97.json');
      case 98: return require('./assets/data/dailykin-98.json');
      case 99: return require('./assets/data/dailykin-99.json');
      case 100: return require('./assets/data/dailykin-100.json');
      case 101: return require('./assets/data/dailykin-101.json');
      case 102: return require('./assets/data/dailykin-102.json');
      case 103: return require('./assets/data/dailykin-103.json');
      case 104: return require('./assets/data/dailykin-104.json');
      case 105: return require('./assets/data/dailykin-105.json');
      case 106: return require('./assets/data/dailykin-106.json');
      case 107: return require('./assets/data/dailykin-107.json');
      case 108: return require('./assets/data/dailykin-108.json');
      case 109: return require('./assets/data/dailykin-109.json');
      case 110: return require('./assets/data/dailykin-110.json');
      case 111: return require('./assets/data/dailykin-111.json');
      case 112: return require('./assets/data/dailykin-112.json');
      case 113: return require('./assets/data/dailykin-113.json');
      case 114: return require('./assets/data/dailykin-114.json');
      case 115: return require('./assets/data/dailykin-115.json');
      case 116: return require('./assets/data/dailykin-116.json');
      case 117: return require('./assets/data/dailykin-117.json');
      case 118: return require('./assets/data/dailykin-118.json');
      case 119: return require('./assets/data/dailykin-119.json');
      case 120: return require('./assets/data/dailykin-120.json');
      case 121: return require('./assets/data/dailykin-121.json');
      case 122: return require('./assets/data/dailykin-122.json');
      case 123: return require('./assets/data/dailykin-123.json');
      case 124: return require('./assets/data/dailykin-124.json');
      case 125: return require('./assets/data/dailykin-125.json');
      case 126: return require('./assets/data/dailykin-126.json');
      case 127: return require('./assets/data/dailykin-127.json');
      case 128: return require('./assets/data/dailykin-128.json');
      case 129: return require('./assets/data/dailykin-129.json');
      case 130: return require('./assets/data/dailykin-130.json');
      case 131: return require('./assets/data/dailykin-131.json');
      case 132: return require('./assets/data/dailykin-132.json');
      case 133: return require('./assets/data/dailykin-133.json');
      case 134: return require('./assets/data/dailykin-134.json');
      case 135: return require('./assets/data/dailykin-135.json');
      case 136: return require('./assets/data/dailykin-136.json');
      case 137: return require('./assets/data/dailykin-137.json');
      case 138: return require('./assets/data/dailykin-138.json');
      case 139: return require('./assets/data/dailykin-139.json');
      case 140: return require('./assets/data/dailykin-140.json');
      case 141: return require('./assets/data/dailykin-141.json');
      case 142: return require('./assets/data/dailykin-142.json');
      case 143: return require('./assets/data/dailykin-143.json');
      case 144: return require('./assets/data/dailykin-144.json');
      case 145: return require('./assets/data/dailykin-145.json');
      case 146: return require('./assets/data/dailykin-146.json');
      case 147: return require('./assets/data/dailykin-147.json');
      case 148: return require('./assets/data/dailykin-148.json');
      case 149: return require('./assets/data/dailykin-149.json');
      case 150: return require('./assets/data/dailykin-150.json');
      case 151: return require('./assets/data/dailykin-151.json');
      case 152: return require('./assets/data/dailykin-152.json');
      case 153: return require('./assets/data/dailykin-153.json');
      case 154: return require('./assets/data/dailykin-154.json');
      case 155: return require('./assets/data/dailykin-155.json');
      case 156: return require('./assets/data/dailykin-156.json');
      case 157: return require('./assets/data/dailykin-157.json');
      case 158: return require('./assets/data/dailykin-158.json');
      case 159: return require('./assets/data/dailykin-159.json');
      case 160: return require('./assets/data/dailykin-160.json');
      case 161: return require('./assets/data/dailykin-161.json');
      case 162: return require('./assets/data/dailykin-162.json');
      case 163: return require('./assets/data/dailykin-163.json');
      case 164: return require('./assets/data/dailykin-164.json');
      case 165: return require('./assets/data/dailykin-165.json');
      case 166: return require('./assets/data/dailykin-166.json');
      case 167: return require('./assets/data/dailykin-167.json');
      case 168: return require('./assets/data/dailykin-168.json');
      case 169: return require('./assets/data/dailykin-169.json');
      case 170: return require('./assets/data/dailykin-170.json');
      case 171: return require('./assets/data/dailykin-171.json');
      case 172: return require('./assets/data/dailykin-172.json');
      case 173: return require('./assets/data/dailykin-173.json');
      case 174: return require('./assets/data/dailykin-174.json');
      case 175: return require('./assets/data/dailykin-175.json');
      case 176: return require('./assets/data/dailykin-176.json');
      case 177: return require('./assets/data/dailykin-177.json');
      case 178: return require('./assets/data/dailykin-178.json');
      case 179: return require('./assets/data/dailykin-179.json');
      case 180: return require('./assets/data/dailykin-180.json');
      case 181: return require('./assets/data/dailykin-181.json');
      case 182: return require('./assets/data/dailykin-182.json');
      case 183: return require('./assets/data/dailykin-183.json');
      case 184: return require('./assets/data/dailykin-184.json');
      case 185: return require('./assets/data/dailykin-185.json');
      case 186: return require('./assets/data/dailykin-186.json');
      case 187: return require('./assets/data/dailykin-187.json');
      case 188: return require('./assets/data/dailykin-188.json');
      case 189: return require('./assets/data/dailykin-189.json');
      case 190: return require('./assets/data/dailykin-190.json');
      case 191: return require('./assets/data/dailykin-191.json');
      case 192: return require('./assets/data/dailykin-192.json');
      case 193: return require('./assets/data/dailykin-193.json');
      case 194: return require('./assets/data/dailykin-194.json');
      case 195: return require('./assets/data/dailykin-195.json');
      case 196: return require('./assets/data/dailykin-196.json');
      case 197: return require('./assets/data/dailykin-197.json');
      case 198: return require('./assets/data/dailykin-198.json');
      case 199: return require('./assets/data/dailykin-199.json');
      case 200: return require('./assets/data/dailykin-200.json');
      case 201: return require('./assets/data/dailykin-201.json');
      case 202: return require('./assets/data/dailykin-202.json');
      case 203: return require('./assets/data/dailykin-203.json');
      case 204: return require('./assets/data/dailykin-204.json');
      case 205: return require('./assets/data/dailykin-205.json');
      case 206: return require('./assets/data/dailykin-206.json');
      case 207: return require('./assets/data/dailykin-207.json');
      case 208: return require('./assets/data/dailykin-208.json');
      case 209: return require('./assets/data/dailykin-209.json');
      case 210: return require('./assets/data/dailykin-210.json');
      case 211: return require('./assets/data/dailykin-211.json');
      case 212: return require('./assets/data/dailykin-212.json');
      case 213: return require('./assets/data/dailykin-213.json');
      case 214: return require('./assets/data/dailykin-214.json');
      case 215: return require('./assets/data/dailykin-215.json');
      case 216: return require('./assets/data/dailykin-216.json');
      case 217: return require('./assets/data/dailykin-217.json');
      case 218: return require('./assets/data/dailykin-218.json');
      case 219: return require('./assets/data/dailykin-219.json');
      case 220: return require('./assets/data/dailykin-220.json');
      case 221: return require('./assets/data/dailykin-221.json');
      case 222: return require('./assets/data/dailykin-222.json');
      case 223: return require('./assets/data/dailykin-223.json');
      case 224: return require('./assets/data/dailykin-224.json');
      case 225: return require('./assets/data/dailykin-225.json');
      case 226: return require('./assets/data/dailykin-226.json');
      case 227: return require('./assets/data/dailykin-227.json');
      case 228: return require('./assets/data/dailykin-228.json');
      case 229: return require('./assets/data/dailykin-229.json');
      case 230: return require('./assets/data/dailykin-230.json');
      case 231: return require('./assets/data/dailykin-231.json');
      case 232: return require('./assets/data/dailykin-232.json');
      case 233: return require('./assets/data/dailykin-233.json');
      case 234: return require('./assets/data/dailykin-234.json');
      case 235: return require('./assets/data/dailykin-235.json');
      case 236: return require('./assets/data/dailykin-236.json');
      case 237: return require('./assets/data/dailykin-237.json');
      case 238: return require('./assets/data/dailykin-238.json');
      case 239: return require('./assets/data/dailykin-239.json');
      case 240: return require('./assets/data/dailykin-240.json');
      case 241: return require('./assets/data/dailykin-241.json');
      case 242: return require('./assets/data/dailykin-242.json');
      case 243: return require('./assets/data/dailykin-243.json');
      case 244: return require('./assets/data/dailykin-244.json');
      case 245: return require('./assets/data/dailykin-245.json');
      case 246: return require('./assets/data/dailykin-246.json');
      case 247: return require('./assets/data/dailykin-247.json');
      case 248: return require('./assets/data/dailykin-248.json');
      case 249: return require('./assets/data/dailykin-249.json');
      case 250: return require('./assets/data/dailykin-250.json');
      case 251: return require('./assets/data/dailykin-251.json');
      case 252: return require('./assets/data/dailykin-252.json');
      case 253: return require('./assets/data/dailykin-253.json');
      case 254: return require('./assets/data/dailykin-254.json');
      case 255: return require('./assets/data/dailykin-255.json');
      case 256: return require('./assets/data/dailykin-256.json');
      case 257: return require('./assets/data/dailykin-257.json');
      case 258: return require('./assets/data/dailykin-258.json');
      case 259: return require('./assets/data/dailykin-259.json');
      case 260: return require('./assets/data/dailykin-260.json');
      default: throw new Error('Could not load ' + (day.date.getMonth() + 1) + '/' + day.date.getDate() + '/' + day.date.getFullYear());
    }
  }

  loadMoon(name) {
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
}

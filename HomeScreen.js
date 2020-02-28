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
              { !this.state.data.gad ?
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={[style.header2, {color: this.state.data.color }]}>{this.state.data.moon.name.toUpperCase()} MOON {this.state.data.moon.number}</Text>
                <Text style={style.header2}>{ this.state.data.moon.words.join(' * ')}</Text>
                <Image
                  style={{ width: 160, height: 76 }}
                  source={this.state.data.tone.image} />
                <Image
                  style={{ width: 160, height: 160 }}
                  source={this.state.data.tribe.image} />
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <Text style={[style.header2, {color: this.state.data.color, paddingRight:8 }]}>{this.state.data.glyph}</Text>
                  <Text style={style.header}>{this.state.data.moon.name.toUpperCase()} {this.state.data.moon.day}</Text>
                </View>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <Text style={style.header}>{this.state.data.date} | </Text>
                  <Text style={style.header}>{this.state.data.longCount}</Text>
                </View>
              </View>
              :
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={style.header2}>{this.state.data.date}</Text>
                <Text style={style.text}>{this.state.data.gad}</Text>
              </View>
              }
              { this.state.data.dot &&
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={style.header2}>{this.state.data.dot}</Text>
              </View>
              }
              { !this.state.data.gad &&
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={[style.header, { fontSize: 24, color: this.state.data.color}]}>{this.state.data.name}</Text>
                <Text style={style.text}>Guided by {this.state.data.guide}</Text>
                <Text style={[style.header2, { color: this.state.data.color}]}>Kin {this.state.data.kinNumber}</Text>
              </View>
              }
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <Image
                    style={{ width: 110, height: 110 }}
                    source={this.state.data.moon.image} />
                  <View style={{justifyContent:'center'}}>
                    <Text style={style.header}>{this.state.data.moon.phase.name}</Text>
                    <Text style={style.header}>{this.state.data.moon.phase.illuminated}</Text>
                  </View>
                </View>
              </View>
              { !this.state.data.gad ?
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={{ flexDirection: 'row', flex: 1, paddingTop:10 }}>
                  <View style={{borderRightWidth: 1, borderRightColor: 'white', paddingRight:10}}>
                    <Text style={[style.header2, { color: this.state.data.color}]}>Tone: {this.state.data.tone.number} {this.state.data.tone.name}</Text>
                    <Text style={style.text}>* { this.state.data.tone.words.join('\n* ')}</Text>
                  </View>
                  <View style={{paddingLeft:10}}>
                    <Text style={[style.header2, { color: this.state.data.color}]}>Tribe: {this.state.data.tribe.number} {this.state.data.tribe.name}</Text>
                    <Text style={style.text}>* { this.state.data.tribe.words.join('\n* ')}</Text>
                  </View>
                </View>
                <Text style={[style.header2, { color: this.state.data.color}]}>Affirmation</Text>
                <Text style={[style.text, { textAlign: 'center' }]}>{this.state.data.readings.affirmation.join('\n')}</Text>
              </View>
              :
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={{height:600}} />
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
      now = new Date(Date.parse(this.state.data.date));
      now.setDate(now.getDate() + dayOffset);
    }
    
    try {
      var day = new Calendar().calculateDay(now);
      this.setState({
        isLoading: false,
        data: day,
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
        this.props.navigation.dangerouslyGetParent().dispatch(NavigationActions.setParams({
          key: 'About',
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

}

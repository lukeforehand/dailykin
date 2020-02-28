import React from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  StyleSheet,
  ImageBackground
} from 'react-native';

import style from './style';

export default class ReadingScreen extends React.Component {

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener(
      'didFocus',
      () => {
        this.forceUpdate();
      });
  }
  componentWillUnmount() {
    this.focusListener.remove();
  }

  refreshing() {
    return !this.props.navigation.dangerouslyGetParent().getParam('data');
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

    const data = this.props.navigation.dangerouslyGetParent().getParam('data');

    return(
      <SafeAreaView>
        <ImageBackground
            resizeMode='stretch'
            style={{width: '100%', height: '100%'}}
            source={require('./assets/images/space.jpg')}>
          <ScrollView>
          {data.gad ?
            <View style={{ height: 600, paddingTop: 10 }}>
              <Text style={style.readingtext}>{data.gad}</Text>
            </View>
          :
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={[style.header, { fontSize: 24, color: data.color}]}>{data.name}</Text>
              <Text style={style.readingtext}>{'\n' + data.readings.reading.join('\n\n')}</Text>
            </View>
          }
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }

}

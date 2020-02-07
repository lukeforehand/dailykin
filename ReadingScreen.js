import React from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Text,
  StyleSheet,
  ImageBackground
} from 'react-native';

import style from './style';

export default class ReadingScreen extends React.Component {

  refreshing() {
    return !this.props.navigation.dangerouslyGetParent().getParam('dailykin');
  }

  render() {

    if (this.refreshing()) {
      return (
        <ActivityIndicator />
      )
    }

    return(
      <SafeAreaView>
        <ImageBackground
            resizeMode='stretch'
            style={{width: '100%', height: '100%'}}
            source={{ uri: 'https://spacestationplaza.com/images/space.jpg' }}>
          <ScrollView>
            <Text style={[style.header, { fontSize: 24, color: this.props.navigation.dangerouslyGetParent().getParam('dailykin').color}]}>
              {this.props.navigation.dangerouslyGetParent().getParam('dailykin').name}
            </Text>
            <Text style={style.text}>{'\n' + this.props.navigation.dangerouslyGetParent().getParam('dailykin').reading.join('\n\n')}</Text>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }

}

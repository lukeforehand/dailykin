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

  render() {

    if (!this.props.navigation.dangerouslyGetParent().getParam('reading')) {
      return (
        <ActivityIndicator />
      )
    }

    return(
      <SafeAreaView>
        <ScrollView>
          <ImageBackground
            resizeMode='stretch'
            style={{width: '100%', height: '100%'}}
            source={{ uri: 'https://spacestationplaza.com/images/space.jpg' }}>
            <Text style={style.text}>{'\n' + this.props.navigation.dangerouslyGetParent().getParam('reading').join('\n\n')}</Text>
          </ImageBackground>
        </ScrollView>
      </SafeAreaView>
    );
  }

}

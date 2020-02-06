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
    return !this.props.navigation.dangerouslyGetParent().getParam('reading');
  }

  render() {

    if (this.refreshing()) {
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
            <Text style={[style.text, { marginLeft: '4%', marginRight: '4%'}]}>{'\n' + this.props.navigation.dangerouslyGetParent().getParam('reading').join('\n\n')}</Text>
          </ImageBackground>
        </ScrollView>
      </SafeAreaView>
    );
  }

}

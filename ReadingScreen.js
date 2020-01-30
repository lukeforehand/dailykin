import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  ImageBackground
} from 'react-native';

import style from './style';

export default class ReadingScreen extends React.Component {

  render() {

    return(
      <SafeAreaView>
        <ScrollView>
          <ImageBackground
            resizeMode='repeat'
            style={{width: '100%', height: '100%'}}
            source={{ uri: 'https://spacestationplaza.com/images/space.jpg' }}>
            <Text style={style.text}>{'\n' + this.props.navigation.dangerouslyGetParent().getParam('reading').join('\n\n')}</Text>
          </ImageBackground>
        </ScrollView>
      </SafeAreaView>
    );
  }

}

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

export default class DonateScreen extends React.Component {

  refreshing() {
    return false;
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
            <Text style={style.text}>
              {'\n'}Donation
            </Text>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }

}

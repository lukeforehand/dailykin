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
          {this.props.navigation.dangerouslyGetParent().getParam('error') ?
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={style.header2}>{this.props.navigation.dangerouslyGetParent().getParam('error')}</Text>
            </View>
          :
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={[style.header, { fontSize: 24, color: this.props.navigation.dangerouslyGetParent().getParam('dailykin').color}]}>
                {this.props.navigation.dangerouslyGetParent().getParam('dailykin').name}
              </Text>
              <Text style={style.text}>{'\n' + this.props.navigation.dangerouslyGetParent().getParam('dailykin').reading.join('\n\n')}</Text>
            </View>
          }
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }

}

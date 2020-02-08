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
    return
      !this.props.navigation.dangerouslyGetParent().getParam('reading') ||
      !this.props.navigation.dangerouslyGetParent().getParam('name') ||
      !this.props.navigation.dangerouslyGetParent().getParam('color');
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
            <Text style={[style.header, { fontSize: 24, color: this.props.navigation.dangerouslyGetParent().getParam('color')}]}>
              {this.props.navigation.dangerouslyGetParent().getParam('name')}
            </Text>
            <Text style={style.text}>{'\n' + this.props.navigation.dangerouslyGetParent().getParam('reading').join('\n\n')}</Text>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }

}

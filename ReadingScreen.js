import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  ImageBackground
} from 'react-native';

export default class ReadingScreen extends React.Component {

  render() {

    return(
      <SafeAreaView>
        <ScrollView>
          <ImageBackground
            resizeMode='repeat'
            style={{width: '100%', height: '100%'}}
            source={{ uri: 'https://spacestationplaza.com/images/space.jpg' }}>
            <Text style={this.style.text}>{'\n' + this.props.navigation.getParam('reading').join('\n\n')}</Text>
          </ImageBackground>
        </ScrollView>
      </SafeAreaView>
    );
  }

  style = StyleSheet.create({
    text: {
      color: 'white'
    }
  });

}

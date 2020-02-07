import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  ImageBackground
} from 'react-native';

import style from './style';

export default class AboutScreen extends React.Component {

  render() {
    return(
      <SafeAreaView>
        <ImageBackground
          resizeMode='stretch'
          style={{width: '100%', height: '100%'}}
          source={{ uri: 'https://spacestationplaza.com/images/space.jpg' }}>
          <ScrollView>
            <Text style={style.text}>
              {'\n'}Tzolkin, meaning the 'Count of Days' in Yucatecan, is the Sacred Mayan Calendar that was utilized by Mayan priests for ceremonies, rituals and divination purposes. This sacred calendar was followed by several Mesoamerican cultures and, although expressed with different names, they all consisted of a combination of 20 symbols by 13 numbers. The Cholq'ij, its name in Quiche, is still in use by the Day Keepers in Mayan communities of Highland Guatemala.
              {'\n'}{'\n'}The 20 symbols or glyphs are energies or archetypes represented by names, called in their modern term as Solar Seals. The 13 numbers are expressed in dots and bars and are known as Lunar Tones. Both, glyphs and numbers, have a correlation to the Human body (twenty fingers and toes and thirteen joints), and the entire 260-day cycle also relates to both human gestation (pregnancy) and corn cultivation cycles.
              {'\n'}{'\n'}Each day has a unique combination of energies that affects a specific part of our Being. Getting in tune with the energies is a wonderful way to reconnect with our essence, feel part of the web of life and live in harmony with all existence!
              {'\n'}{'\n'}The modern version of the ancient Mayan Tzolkin is known as Natural Time 13:20, called as Dreamspell by Dr. Jose Arguelles. Each day of the 260-day cycle is known as a Kin, which is a combination of a Solar Seal (glyph) and a Lunar Tone (number). All 260 kins create a matrix known as the Harmonic Module or Galactic Spin. And, based on the day you were born, you will have one of those kins or position within the matrix.
              {'\n'}{'\n'}Each Kin and its supportive energies conform an Oracle. Becoming familiar with your Oracle of Birth allows you to know yourself better while you open up to a path filled with amazing opportunities of self-discovery and unfoldment of your true potential. 'Energy flows where Attention goes'… Once you become aware of your own energies and you follow the cycle, you will be living in the present moment and start experiencing increasing synchronicities and magic in your life!
            </Text>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }

}

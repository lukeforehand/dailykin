import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground
} from 'react-native';

import style from './style';

export default class AboutScreen extends React.Component {

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
            { !data.gad ?
            <View style={{justifyContent: 'center', alignItems: 'center'}}>

              <Text style={style.about}>Each day in the 13-moon calendar has a unique combination of energies that affect each part of our Being.  Getting in tune with the energies is a wonderful way to reconnect with our essence, feel part of the web of life and live in harmony with all existence!  Read more about today's Kin below.</Text>

              <View style={style.box}>
                <Text style={[style.header2, {color: data.color }]}>{data.moon.name.toUpperCase()} MOON {data.moon.number}</Text>
                <Text style={style.header2}>{ data.moon.words.join(' * ')}</Text>
              </View>

              <Text style={style.about}>Name of the Moon <Text style={style.abouthl}>{data.moon.name}</Text> and the Action <Text style={style.abouthl}>{data.moon.words[0]}</Text>, Essence <Text style={style.abouthl}>{data.moon.words[1]}</Text>, and Power <Text style={style.abouthl}>{data.moon.words[2]}</Text> associated with the moon.</Text>

              <View style={style.box}>
                <Image
                  style={{ width: 160, height: 76 }}
                  source={data.tone.image} />
                <Image
                  style={{ width: 160, height: 160 }}
                  source={data.tribe.image} />
              </View>

              <Text style={style.about}>
                Galactic Tone <Text style={style.abouthl}>{data.tone.number} {data.tone.name}</Text> and Solar Tribe <Text style={style.abouthl}>{data.tribe.number} {data.tribe.name}</Text>.{'\n\n'}
                13 Galactic Tones and 20 Solar Tribes describe the process of cosmic creation.  The 13 Galactic Tones are divine pulsations that support our becoming conscious of our divine inner frequency.  The Solar Tribes are universal energies which symbolize archetypal aspects of our being.{'\n\n'}
                'Energy flows where Attention goes' ... Once you become aware of your own energies and you follow the cycle, you will be living in the present moment and start experiencing increasing synchronicities and magic in your life!
              </Text>

              <View style={[style.box, { flexDirection: 'row', flex: 1 }]}>
                <Text style={[style.header2, {color: data.color, paddingRight:8 }]}>{data.glyph}</Text>
                <Text style={style.header}>{data.moon.name.toUpperCase()} {data.moon.day}</Text>
              </View>

              <Text style={style.about}>
                Day of the week <Text style={style.abouthl}>{data.glyph}</Text>, Name of the Moon <Text style={style.abouthl}>{data.moon.name}</Text>, and Day of the Moon <Text style={style.abouthl}>{data.moon.day}</Text>.{'\n\n'}
                In the 13 Moon Calendar each moon lasts 28-days with 4 7-day weeks.  The 7 days of the week are the Seven Radial Plasmas which stream out from the center of the galaxy and are absorbed into and radiated out from the seven chakras.{'\n\n'}
                * Dali - Crown{'\n'}
                * Seli - Root{'\n'}
                * Gamma - 3rd Eye{'\n'}
                * Kali - Sacral{'\n'}
                * Alpha - Throat{'\n'}
                * Limi - Solar Plexus{'\n'}
                * Silio - Heart
              </Text>

              <View style={[style.box, { flexDirection: 'row', flex: 1 }]}>
                <Text style={style.header}>{data.date} | </Text>
                <Text style={style.header}>{data.longCount}</Text>
              </View>

              <Text style={style.about}>
                Numbering of the days.  NS stands for 'New Sirius', the 52-year cycle which is how long it takes Sirius B to orbit Sirius A.  The numbering is defined as follows: <Text style={style.abouthl}>{data.longCount.split('.')[0]}</Text> NS cycles, <Text style={style.abouthl}>{data.longCount.split('.')[1]}</Text> years, <Text style={style.abouthl}>{data.longCount.split('.')[2]}</Text> months, <Text style={style.abouthl}>{data.longCount.split('.')[3]}</Text> days since the beginning of the calendar.
              </Text>

            </View>
            :
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={style.header2}>{data.date}</Text>
              <Text style={style.text}>{data.gad}</Text>
              <Text style={style.about}>Please choose another Kin day to learn more.</Text>
            </View>
            }
            { !data.gad &&
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={style.box}>
                <Text style={[style.header, { fontSize: 24, color: data.color}]}>{data.name}</Text>
                <Text style={[style.header2, { color: data.color}]}>Kin {data.kinNumber}</Text>
              </View>

              <Text style={style.about}>
                Galactic Signature <Text style={style.abouthl}>{data.name}</Text> and Kin day <Text style={style.abouthl}>{data.kinNumber}</Text>.{'\n\n'}
                Each Kin day is a combination of one of 20 Solar Tribes and 13 Galactic Tones, called a Galactic Signature.  This makes a total of 260 (20 x 13) combinations, and each day of the 260-day cycle is known as a Kin.
              </Text>

              <View style={[style.box, { flexDirection: 'row', flex: 1, paddingTop:10 }]}>
                <View style={{borderRightWidth: 1, borderRightColor: 'white', paddingRight:10}}>
                  <Text style={[style.header2, { color: data.color}]}>Tone: {data.tone.number} {data.tone.name}</Text>
                  <Text style={style.text}>* { data.tone.words.join('\n* ')}</Text>
                </View>
                <View style={{paddingLeft:10}}>
                  <Text style={[style.header2, { color: data.color}]}>Tribe: {data.tribe.number} {data.tribe.name}</Text>
                  <Text style={style.text}>* { data.tribe.words.join('\n* ')}</Text>
                </View>
              </View>

              <Text style={style.about}>
                Name of the Galactic Tone <Text style={style.abouthl}>{data.tone.name}</Text> and the Action <Text style={style.abouthl}>{data.tone.words[0]}</Text>, Essence <Text style={style.abouthl}>{data.tone.words[1]}</Text>, and Power <Text style={style.abouthl}>{data.tone.words[2]}</Text> associated with the tone.{'\n\n'}
                Name of the Solar Tribe <Text style={style.abouthl}>{data.tribe.name}</Text> and the Action <Text style={style.abouthl}>{data.tribe.words[0]}</Text>, Essence <Text style={style.abouthl}>{data.tribe.words[1]}</Text>, and Power <Text style={style.abouthl}>{data.tribe.words[2]}</Text> associated with the tribe.
              </Text>

            </View>
            }
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }

}

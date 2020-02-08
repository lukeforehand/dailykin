import React from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Text,
  Image,
  ImageBackground,
  View,
  StyleSheet
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import style from './style';

import JSSoup from 'jssoup';

export default class HomeScreen extends React.Component {

  url = 'https://spacestationplaza.com';

  constructor(props) {
    super(props);
    this.state = {
      isHomeLoading: true,
      isCalendarLoading: true
    }
  }

  componentDidMount() {
    this.fetchData();
    this.focusListener = this.props.navigation.addListener(
      'didFocus',
      () => {
        if (!this.refreshing()) {
          currentDay = Date.parse(this.state.dailykin.day);
          nextDay = (new Date()).getTime();
          if (nextDay - currentDay > 86400000) {
            this.fetchData();
          }
        }
      });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  parseHome(html) {
    soup = new JSSoup(html);
    dailykin = soup.find(name='div', attrs={id:'col_one_id'});
    
    texts = dailykin.findAll(name='font');
    
    toneTribeImages = dailykin.find(name='table').findAll(name='img');
    
    toneNumber = texts[2].findAll(name='font')[1].getText();
    texts[2].findAll(name='font')[1].extract();
    toneWords = texts[5].getText().split('*').map(function(x) {
      return x.trim();
    });
    tribeNumber = texts[8].findAll(name='font')[1].getText();
    texts[8].findAll(name='font')[1].extract();
    tribeWords = texts[11].getText().split('*').map(function(x) {
      return x.trim();
    });

    dailykin.find(name='legend', attrs={class:'affirmation'}).extract();
    affirmation = dailykin.find(name='fieldset', attrs={class:'affirmation'}).contents.filter(function(x) {
      return '_text' in x;
    }).map(function(x) {
      return x['_text'].trim();
    });

    reading = soup.find(name='table', attrs={class:'reading'})
      .find(name='div', attrs={class:'outdent'}).contents.map(function(x) {
        return x.getText()
          .replace(new RegExp('^\n', 'g'), '')
          .replace(new RegExp('\n\n', 'g'), '\n')
          .replace(new RegExp('&quot;', 'g'), '"')
          .replace(new RegExp('&amp;', 'g'), '&');
    }).join(' ').split('\n').filter(function(x) {
      return x.trim().length > 0;
    });
    return {
      day: texts[0].getText().trim(),
      color: dailykin.find(name='h1').getText().split(' ')[0].toLowerCase(),
      kinNumber: texts[1].getText().slice('Kin: '.length).trim(),
      name: dailykin.find(name='h1').getText(),
      tone: {
        image: this.url + toneTribeImages[0].attrs['src'],
        number: toneNumber,
        name: texts[2].getText().slice('Tone: '.length),
        words: toneWords
      },
      tribe: {
        image: this.url + toneTribeImages[1].attrs['src'],
        number: tribeNumber,
        name: texts[8].getText().slice('Tribe: '.length),
        words: tribeWords
      },
      affirmation: affirmation,
      reading: reading
    };
  }

  parseCalendar(html) {
    soup = new JSSoup(html);
    resonant = soup.findAll(name='td', attrs={class:'cal_row_dk_hlt'})[0].getText().slice('RESONANT '.length).trim();
    guided = soup.findAll(name='td', attrs={class:'cal_row_medlt_hlt'})[0].getText().slice('Guided by '.length).trim();
    moon = soup.findAll(name='td', attrs={class:'cal_row_dk_hlt'})[1];
    moonText = moon.findAll(name='font')[0].contents.filter(function(x) {
      return '_text' in x;
    });
    return {
      resonant: resonant,
      guided: guided,
      moon: {
        image: this.url + moon.findAll(name='img')[0].attrs['src'],
        name: moonText[0]['_text'],
        percent: moonText[1]['_text']
      }
    };
  }

  refreshing() {
    return this.state.isHomeLoading || this.state.isCalendarLoading;
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
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={this.refreshing()} onRefresh={this.fetchData.bind(this)} />
            }
          >
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                style={{ width: 160, height: 76 }}
                source={{ uri: this.state.dailykin.tone.image }} />
              <Image
                style={{ width: 160, height: 160 }}
                source={{ uri: this.state.dailykin.tribe.image }} />
              <Text style={[style.header2, { color: this.state.dailykin.color}]}>RESONANT {this.state.calendar.resonant}</Text>
              <Text style={style.header}>{this.state.dailykin.day}</Text>
              <Text style={[style.header, { fontSize: 24, color: this.state.dailykin.color}]}>{this.state.dailykin.name}</Text>
              <Text style={style.text}>Guided by {this.state.calendar.guided}</Text>
              <Text style={[style.header2, { color: this.state.dailykin.color}]}>Kin {this.state.dailykin.kinNumber}</Text>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <Image
                  style={{ width: 110, height: 110 }}
                  source={{ uri: this.state.calendar.moon.image }} />
                <View style={{justifyContent:'center'}}>
                  <Text style={style.header}>{this.state.calendar.moon.name}</Text>
                  <Text style={style.header}>{this.state.calendar.moon.percent}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', flex: 1, paddingTop:10 }}>
                <View style={{borderRightWidth: 1, borderRightColor: 'white', paddingRight:10}}>
                  <Text style={[style.header2, { color: this.state.dailykin.color}]}>Tone: {this.state.dailykin.tone.number} {this.state.dailykin.tone.name}</Text>
                  <Text style={style.text}>* { this.state.dailykin.tone.words.join('\n* ')}</Text>
                </View>
                <View style={{paddingLeft:10}}>
                  <Text style={[style.header2, { color: this.state.dailykin.color}]}>Tribe: {this.state.dailykin.tribe.number} {this.state.dailykin.tribe.name}</Text>
                  <Text style={style.text}>* { this.state.dailykin.tribe.words.join('\n* ')}</Text>
                </View>
              </View>
              <Text style={[style.header2, { color: this.state.dailykin.color}]}>Affirmation</Text>
              <Text style={[style.text, { textAlign: 'center' }]}>{this.state.dailykin.affirmation.join('\n')}</Text>
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  fetchData() {
    this.setState({
      isHomeLoading: true,
      isCalendarLoading: true
    });
    return Promise.all([
      // home
      fetch(this.url)
        //FIXME: remove
        //+ '/kin.php?dcode_mo=2&dcode_day=9&dcode_yr=2020&decoder=decode')
        .then((response) => response.text())
        .then((html) => {
          dailykin = this.parseHome(html);
          this.setState({
            isHomeLoading: false,
            dailykin: dailykin
          }, function() {
            // callback
            this.props.navigation.dangerouslyGetParent().dispatch(NavigationActions.setParams({
              key: 'Reading',
              params: { 
                reading: this.state.dailykin.reading,
                name: this.state.dailykin.name,
                color: this.state.dailykin.color
              }
            }));
          });
        })
        .catch((error) =>{
          console.error(error);
        }),
      // calendar
      fetch(this.url + '/calendar.php')
        .then((response) => response.text())
        .then((html) => {
          calendar = this.parseCalendar(html);
          this.setState({
            isCalendarLoading: false,
            calendar: calendar
          }, function() {
            // callback
          })
        })
        .catch((error) =>{
          console.error(error);
        })
    ]);
  }

}

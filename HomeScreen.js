import React from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Text,
  Image,
  ImageBackground,
  View,
  StyleSheet
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import JSSoup from 'jssoup';

export default class HomeScreen extends React.Component {

  url = 'https://spacestationplaza.com';

  constructor(props) {
    super(props);
    this.state = { isLoading: true }
  }

  parseGalactic(html) {
    soup = new JSSoup(html);
    galactic = soup.find(name='div', attrs={id:'col_one_id'});
    
    texts = galactic.findAll(name='font');
    
    toneTribeImages = galactic.find(name='table').findAll(name='img');
    
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

    galactic.find(name='legend', attrs={class:'affirmation'}).extract();
    affirmation = galactic.find(name='fieldset', attrs={class:'affirmation'}).contents.filter(function(x) {
      return '_text' in x;
    }).map(function(x) {
      return x['_text'].trim();
    });

    reading = soup.find(name='table', attrs={class:'reading'})
      .find(name='div', attrs={class:'outdent'}).contents.map(function(x) {
        return x.getText()
          .replace(new RegExp('^\n', 'g'), '')
          .replace(new RegExp('\n\n', 'g'), '\n')
          .replace(new RegExp('&quot;', 'g'), '"');
    }).join(' ').split('\n');

    return {
      day: texts[0].getText().trim(),
      toneImage: this.url + toneTribeImages[0].attrs['src'],
      tribeImage: this.url + toneTribeImages[1].attrs['src'],
      kinNumber: texts[1].getText().slice('Kin: '.length).trim(),
      name: galactic.find(name='h1').getText(),
      tone: {
        number: toneNumber,
        name: texts[2].getText().slice('Tone: '.length),
        words: toneWords
      },
      tribe: {
        number: tribeNumber,
        name: texts[8].getText().slice('Tribe: '.length),
        words: tribeWords
      },
      affirmation: affirmation,
      reading: reading
    };
  }

  render() {

    if (this.state.isLoading) {
      return (
        <ActivityIndicator />
      )
    }
    return(
      <SafeAreaView>
        <ScrollView>
          <ImageBackground
            resizeMode='repeat'
            style={{width: '100%', height: '100%'}}
            source={{ uri: 'https://spacestationplaza.com/images/space.jpg' }}>
            <Text style={this.style.text}>{this.state.galactic.day}</Text>
            <Text style={this.style.text}>{this.state.galactic.name}</Text>
            <Image
              style={{ width: 120, height: 56 }}
              source={{ uri: this.state.galactic.toneImage }} />
            <Image
              style={{ width: 120, height: 120 }}
              source={{ uri: this.state.galactic.tribeImage }} />
            <Text style={this.style.text}>Kin: {this.state.galactic.kinNumber}</Text>
            <Text style={this.style.text}>Tone: {this.state.galactic.tone.number} {this.state.galactic.tone.name}</Text>
            <Text style={this.style.text}>* {this.state.galactic.tone.words.join('\n* ')}</Text>
            <Text style={this.style.text}>Tribe: {this.state.galactic.tribe.number} {this.state.galactic.tribe.name}</Text>
            <Text style={this.style.text}>* {this.state.galactic.tribe.words.join('\n* ')}</Text>
            <Text style={this.style.text}>Affirmation:{'\n' + this.state.galactic.affirmation.join('\n')}</Text>
          </ImageBackground>
        </ScrollView>
      </SafeAreaView>
    );
  }

  style = StyleSheet.create({
    text: {
      color: 'white',
      textAlign: 'center'
    }
  });

  componentDidMount() {
    return fetch(this.url)
      .then((response) => response.text())
      .then((html) => {
        galactic = this.parseGalactic(html);
        this.setState({
          isLoading: false,
          galactic: galactic
        }, function() {
          // callback
          this.props.navigation.dispatch(NavigationActions.setParams({
            key: 'Reading',
            params: { reading: this.state.galactic.reading },
          }));
        })
      })
      .catch((error) =>{
        console.error(error);
      });
  }

}

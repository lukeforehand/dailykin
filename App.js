/**
 * Galactic
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Text,
  Image
} from 'react-native';

import JSSoup from 'jssoup';

class Galactic extends React.Component {

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
      return String.replace(' +', ' ', x.trim()).replace('\n \n', '\n');
    });

    //tribeNumber = texts[5].findAll(name='font')[1].getText();
    //texts[2].findAll(name='font')[1].extract();    

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
      //tribe: {
      //  number: tribeNumber,
      //  name: texts[3].getText().slice('Tribe: '.length),
      //}
    };
  }

  render() {
    if (this.state.isLoading) {
      return (
        <ActivityIndicator />
      )
    }
    return(
      <>
        <Text>{JSON.stringify(this.state.galactic, null, 2)}</Text>
        <Text>-------------</Text>
        <Text>{this.state.galactic.day}</Text>
        <Image
          style={{ width: 120, height: 56 }}
          source={{ uri: this.state.galactic.toneImage }}
        />
        <Image
          style={{ width: 120, height: 120 }}
          source={{ uri: this.state.galactic.tribeImage }}
        />
        <Text>Kin: {this.state.galactic.kinNumber}</Text>
        <Text>Tone: {this.state.galactic.tone.number} {this.state.galactic.tone.name}</Text>
      </>
    );
  }

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
        });
      })
      .catch((error) =>{
        console.error(error);
      });
  }

}

const App: () => React$Node = () => {
  return (
    <>
      <SafeAreaView>
        <ScrollView>
          <Galactic />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;

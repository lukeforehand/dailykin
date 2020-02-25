
var fs = require('fs');
var JSSoup = require('jssoup').default;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var https = require ('https');

var HOST = 'spacestationplaza.com';
var URL = 'https://' + HOST;

function fetchData(dayOffset=0) {
  now = new Date();
  now.setDate(now.getDate() + dayOffset);
  dayQueryString = '?dcode_mo=' + (now.getMonth() + 1) + '&dcode_day=' + now.getDate() + '&dcode_yr=' + now.getFullYear() + '&decoder=decode';
  var dailykin = null;
  var calendar = null;
  return new Promise((resolve, reject) => {
    Promise.all([
      // home
      fetchResponse(URL + '/kin.php' + dayQueryString)
        .then((html) => {
          dailykin = parseHome(html);
        })
        .catch((error) =>{
          console.error(error);
        }),
      // calendar
      fetchResponse(URL + '/calendar.php' + dayQueryString)
        .then((html) => {
          calendar = parseCalendar(html);
        })
        .catch((error) =>{
          console.error(error);
        })
    ]).then((values) => {
      kin = {
        dailykin: dailykin,
        calendar: calendar
      };
      fs.writeFileSync('data/dailykin-' + kin.dailykin.kinNumber + '.json', JSON.stringify(kin));
      resolve(kin.dailykin.kinNumber);
    })
    .catch((error) =>{
      reject(error);
    });
  });
}

function fetchResponse(url) {
  return new Promise((resolve, reject) => {
    https.get(
      {
        host: HOST,
        port: 443,
        path: url
      },
      (res) => {
        const chunks = []
        res.on('data', chunk => chunks.push(chunk))
        res.on('error', (error) => console.error(error))
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
      }
    ).on('error', (error) => {
      console.error(error);
    });
  });
}

function parseHome(html) {
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
      image: URL + toneTribeImages[0].attrs['src'],
      number: toneNumber,
      name: texts[2].getText().slice('Tone: '.length),
      words: toneWords
    },
    tribe: {
      image: URL + toneTribeImages[1].attrs['src'],
      number: tribeNumber,
      name: texts[8].getText().slice('Tribe: '.length),
      words: tribeWords
    },
    affirmation: affirmation,
    reading: reading
  };
}

function parseCalendar(html) {
  soup = new JSSoup(html);
  guided = soup.findAll(name='td', attrs={class:'cal_row_medlt_hlt'})[0].getText().slice('Guided by '.length).trim();
  moon = soup.findAll(name='td', attrs={class:'cal_row_dk_hlt'})[1];
  moonText = moon.findAll(name='font')[0].contents.filter(function(x) {
    return '_text' in x;
  });
  return {
    guided: guided,
    moon: {
      image: URL + moon.findAll(name='img')[0].attrs['src'],
      name: moonText[0]['_text'],
      percent: moonText[1]['_text']
    }
  };
}

promises = [];
//FIXME: this doesn't always work
//for (i = 0; i < 1; i++) {
//  kinNumber = (((i + 228) % 260)) + 1;
//  if (!fs.existsSync('data/dailykin-' + kinNumber + '.json')) {
//    console.info('fetching data/dailykin-' + kinNumber + '.json');
//    promises.push(fetchData(i));
//  }
//}
Promise.all(promises).then((values) => {
  values.map((value) => {
    console.info(value);
  });
})
.catch((error) =>{
  console.error(error);
});
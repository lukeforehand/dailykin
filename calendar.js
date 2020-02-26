
var fs = require('fs');

glyphs = [
  'Dali',
  'Seli',
  'Gamma',
  'Kali',
  'Alpha',
  'Limi',
  'Sillio'
];

colors = {
  'Dali': 'yellow',
  'Seli': 'red',
  'Gamma': 'white',
  'Kali': 'blue',
  'Alpha': 'yellow',
  'Limi': 'red',
  'Sillio': 'white'
};

tones = [
  'Magnetic',
  'Lunar',
  'Electric',
  'Self-Existing',
  'Overtone',
  'Rhythmic',
  'Resonant',
  'Galactic',
  'Solar',
  'Spectral',
  'Planetary',
  'Crystal',
  'Cosmic'
];

tribes = [
  'Red Dragon',
  'White Wind',
  'Blue Night',
  'Yellow Seed',
  'Red Serpent',
  'White World-Bridger',
  'Blue Hand',
  'Yellow Star',
  'Red Moon',
  'White Dog',
  'Blue Monkey',
  'Yellow Human',
  'Red Skywalker',
  'White Wizard',
  'Blue Eagle',
  'Yellow Warrior',
  'Red Earth',
  'White Mirror',
  'Blue Storm',
  'Yellow Sun'
];

START_DATE = new Date(Date.UTC(1900, 0, 1, 12, 0, 0));
START_KIN = 52;
START_TONE = 0;
START_TRIBE = 12;
START_GLYPH = 4;
START_MOONDAY = 19;

function isLeapYear(year) {
  if (year % 4 != 0) {
    return false;
  } else if (year % 400 == 0) {
    return true;
  } else if (year % 100 == 0) {
    return false;
  } else {
    return true;
  }
}

function leapYearsBetween(start, end) {
  leapYears = 0;
  for (i = start; i <= end; i++) {
    if (isLeapYear(i)) {
      leapYears++;
    }
  }
  return leapYears;
}

function calculate(dayOffset=0) {
  now = new Date();
  now = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0));
  now.setDate(now.getDate() + dayOffset);
  //now = new Date(Date.UTC(2026, 9, 22, 12, 0, 0));
  //now = new Date(Date.UTC(2102, 3, 12, 12, 0, 0));
  days = Math.round((now.getTime() - START_DATE.getTime()) / (24 * 60 * 60 * 1000));
  leapYears = leapYearsBetween(START_DATE.getFullYear(), now.getFullYear());
  years = now.getFullYear() - START_DATE.getFullYear();
  days = (days - leapYears);
  tribe = parseInt((days + START_TRIBE) % 20);
  tone = parseInt((days + START_TONE) % 13);
  kin = parseInt((days + START_KIN) % 260);
  //TODO: these don't work yet
  //TODO: if the NOW day is before Feb 29th, then subtract one from the
  // leapyear count.  if the NOW day is before July 25, then subtract one
  // from the year count
  //TODO: write a unit test based on space plaza
  moonDay = parseInt(((days + START_MOONDAY) - years) % 28);
  glyph = parseInt(moonDay % 7);

  return {
    date: now,
    kin: kin + 1,
    tone: tone + 1 + ' ' + tones[tone],
    tribe: tribe + 1 + ' ' + tribes[tribe],
    moonDay: moonDay + 1,
    glyph: glyph + 1 + ' ' + glyphs[glyph]
  };

}

i = 0;
//for (i=0; i < 30; i++) {
  console.info(calculate(i));
//}

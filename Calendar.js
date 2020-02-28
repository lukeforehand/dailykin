
export default class Calendar {

  GLYPHS = ['Dali', 'Seli', 'Gamma', 'Kali', 'Alpha', 'Limi', 'Sillio'];

  GLYPH_COLORS = {
    Dali: 'yellow',
    Seli: 'red',
    Gamma: 'white',
    Kali: 'blue',
    Alpha: 'yellow',
    Limi: 'red',
    Sillio: 'white',
  };

  TONES = [
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
    'Cosmic',
  ];

  TONE_COLORS = {
    'blue': 'silver',
    'yellow': 'gold',
    'red': 'gold',
    'white': 'silver',
  };

  TRIBES = [
    'Dragon',
    'Wind',
    'Night',
    'Seed',
    'Serpent',
    'World-Bridger',
    'Hand',
    'Star',
    'Moon',
    'Dog',
    'Monkey',
    'Human',
    'Skywalker',
    'Wizard',
    'Eagle',
    'Warrior',
    'Earth',
    'Mirror',
    'Storm',
    'Sun',
  ];

  TRIBE_COLORS = {
    'Dragon': 'red',
    'Wind': 'white',
    'Night': 'blue',
    'Seed': 'yellow',
    'Serpent': 'red',
    'World-Bridger': 'white',
    'Hand': 'blue',
    'Star': 'yellow',
    'Moon': 'red',
    'Dog': 'white',
    'Monkey': 'blue',
    'Human': 'yellow',
    'Skywalker': 'red',
    'Wizard': 'white',
    'Eagle': 'blue',
    'Warrior': 'yellow',
    'Earth': 'red',
    'Mirror': 'white',
    'Storm': 'blue',
    'Sun': 'yellow',
  };

  START_DATE = new Date(Date.UTC(1900, 0, 1, 12, 0, 0));
  START_KIN = 52;
  START_TONE = 0;
  START_TRIBE = 12;
  START_MOON = 5;
  START_MOONDAY = 19;
  START_GLYPH = 4;

  isLeapYear(year) {
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

  leapDaysBetween(start, end) {
    leapDays = 0;
    for (var i = start; i <= end; i++) {
      if (this.isLeapYear(i)) {
        leapDays++;
      }
    }
    return leapDays;
  }

  calculateDay(date, dayOffset = 0) {
    // set date to UTC at noon
    date = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0),
    );
    date.setDate(date.getDate() + dayOffset);

    if (date.getMonth() == 1 && date.getDate() == 29) {
      // leap day is Hunab ku day
      return {
        date: date,
        error: '0.0.Hunab ku, which is another name for LEAP DAY, is technically missing from the calendar.'
      };
    }
    if (date.getMonth() == 6 && date.getDate() == 25) {
      // Day out of time
      return {
        date: date,
        error: 'Day out of time, the day prior to the 13-Moon New Year, is technically missing from the calendar.  It is a time for great celebration!'
      };
    }

    // calculate days since first known kin day
    days = Math.round(
      (date.getTime() - this.START_DATE.getTime()) / (24 * 60 * 60 * 1000),
    );

    // calculate leap days which must be subtracted from the days since first known kin
    leapDays = this.leapDaysBetween(this.START_DATE.getFullYear(), date.getFullYear());
    if (
      date.getTime() <
      new Date(Date.UTC(date.getFullYear(), 1, 29, 12, 0, 0)).getTime()
    ) {
      // date is before Feb 29, so the year's leap day hasn't happened yet
      leapDays = leapDays - 1;
    }
    days = days - leapDays;

    tribe = (days + this.START_TRIBE) % 20;
    tone = (days + this.START_TONE) % 13;
    kin = (days + this.START_KIN) % 260;

    // calculate the years since first known kin day
    years = date.getFullYear() - this.START_DATE.getFullYear();
    if (
      date.getTime() >
      new Date(Date.UTC(date.getFullYear(), 6, 25, 12, 0, 0)).getTime()
    ) {
      // date is after July 25, the start of a new galactic year
      years = years + 1;
    }

    // calculate how many moons this year has seen up to the date
    moon = (Math.floor((days + this.START_MOONDAY - years) / 28) + this.START_MOON) % 13;
    // calculate the day of the current moon
    moonDay = (days + this.START_MOONDAY - years) % 28;
    glyph = moonDay % 7;

    return {
      date: date,
      color: this.TRIBE_COLORS[this.TRIBES[tribe]],
      kinNumber: kin + 1,
      tone: {
        number: tone + 1,
        name: this.TONES[tone],
        color: this.TONE_COLORS[this.TRIBE_COLORS[this.TRIBES[tribe]]]
      },
      tribe: {
        number: tribe + 1,
        name: this.TRIBES[tribe]
      },
      moon: {
        number: moon + 1,
        day: moonDay + 1
      },
      glyph: glyph + 1 + ' ' + this.GLYPHS[glyph],
    };
  }
}

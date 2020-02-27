// 1980 January 0.0 in JDN
var epoch = 2444238.5;

// Ecliptic longitude of the Sun at epoch 1980.0
var ecliptic_longitude_epoch = 278.83354;

// Ecliptic longitude of the Sun at perigee
var ecliptic_longitude_perigee = 282.596403;

// Eccentricity of Earth's orbit
var eccentricity = 0.016718;

// Moon's mean longitude at the epoch
var moon_mean_longitude_epoch = 64.975464;

// Mean longitude of the perigee at the epoch
var moon_mean_perigee_epoch = 349.383063;

// Synodic month (new Moon to new Moon), in days
var synodic_month = 29.53058868;

var phase_strings = {
  0.05: 'new moon',
  0.20: 'waxing crescent',
  0.30: 'first quarter',
  0.45: 'waxing gibbous',
  0.55: 'full moon',
  0.70: 'waning gibbous',
  0.80: 'last quarter',
  0.95: 'waning crescent',
  1.05: 'new moon',
};

function juliandate(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

function kepler(m, ecc) {
  var epsilon = 1e-6;
  var m = torad(m);
  var e = m;
  while (true) {
    var delta = e - ecc * Math.sin(e) - m;
    e = e - delta / (1.0 - ecc * Math.cos(e));
    if (Math.abs(delta) <= epsilon) {
      break;
    }
  }
  return e;
}

function fixangle(a) {
  return a - 360.0 * Math.floor(a / 360.0);
}

function torad(d) {
  return (d * Math.PI) / 180.0;
}

function todeg(r) {
  return (r * 180.0) / Math.PI;
}

function phase(date, dayOffset = 0) {

  date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0));
  date.setDate(date.getDate() + dayOffset);

  var day = juliandate(date) - epoch;

  // Mean anomaly of the Sun
  var N = fixangle((360 / 365.2422) * day);

  // Convert from perigee coordinates to epoch 1980
  var M = fixangle(N + ecliptic_longitude_epoch - ecliptic_longitude_perigee);

  // Solve Kepler's equation
  var Ec = kepler(M, eccentricity);
  Ec = Math.sqrt((1 + eccentricity) / (1 - eccentricity)) * Math.tan(Ec / 2.0);

  // True anomaly
  Ec = 2 * todeg(Math.atan(Ec));

  // Suns's geometric ecliptic longuitude
  var lambda_sun = fixangle(Ec + ecliptic_longitude_perigee);

  // Calculation of the Moon's position

  // Moon's mean longitude
  var moon_longitude = fixangle(13.1763966 * day + moon_mean_longitude_epoch);

  // Moon's mean anomaly
  var MM = fixangle(moon_longitude - 0.1114041 * day - moon_mean_perigee_epoch);

  // Moon's ascending node mean longitude
  var evection =
    1.2739 * Math.sin(torad(2 * (moon_longitude - lambda_sun) - MM));

  // Annual equation
  var annual_eq = 0.1858 * Math.sin(torad(M));

  // Correction term
  var A3 = 0.37 * Math.sin(torad(M));

  var MmP = MM + evection - annual_eq - A3;

  // Correction for the equation of the centre
  var mEc = 6.2886 * Math.sin(torad(MmP));

  // Another correction term
  var A4 = 0.214 * Math.sin(torad(2 * MmP));

  // Corrected longitude
  var lP = moon_longitude + evection + mEc - annual_eq + A4;

  // Variation
  var variation = 0.6583 * Math.sin(torad(2 * (lP - lambda_sun)));

  // True longitude
  var lPP = lP + variation;

  // Age of the Moon, in degrees
  var moon_age = lPP - lambda_sun;

  // Phase of the Moon
  var moon_phase = (1 - Math.cos(torad(moon_age))) / 2.0;

  var phase = fixangle(moon_age) / 360.0;

  var phase_name;
  for (var key in phase_strings) {
    if (phase < key) {
      phase_name = phase_strings[key];
      break;
    }
  }

  return {
    date: date,
    age: (synodic_month * fixangle(moon_age)) / 360.0,
    phase: phase,
    name: phase_name,
    illuminated: moon_phase,
  };
}

date = new Date();
for (var i = 0; i < 30; i++) {
  console.info(phase(date, i));
}


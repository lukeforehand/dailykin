// 1980 January 0.0 in JDN
epoch = 2444238.5;

// Ecliptic longitude of the Sun at epoch 1980.0
ecliptic_longitude_epoch = 278.833540;

// Ecliptic longitude of the Sun at perigee
ecliptic_longitude_perigee = 282.596403;

// Eccentricity of Earth's orbit
eccentricity = 0.016718;

// Moon's mean longitude at the epoch
moon_mean_longitude_epoch = 64.975464;

// Mean longitude of the perigee at the epoch
moon_mean_perigee_epoch = 349.383063;

// Synodic month (new Moon to new Moon), in days
synodic_month = 29.53058868;

function juliandate(date) {
  return (date.getTime() / 86400000) + 2440587.5;
}

function kepler(m, ecc) {
  epsilon = 1e-6;
  m = torad(m);
  e = m;
  while (true) {
    delta = e - ecc * Math.sin(e) - m;
    e = e - delta / (1.0 - ecc * Math.cos(e));
    if (Math.abs(delta) <= epsilon) {
      break;
    }
  }
  return e;
}

function fixangle(a) {
  return a - 360.0 * Math.floor(a/360.0);
}

function torad(d) {
  return d * Math.PI / 180.0;
}

function todeg(r) {
  return r * 180.0 / Math.PI;
}

PRECISION = 0.05;
NEW = 0 / 4.0;
FIRST = 1 / 4.0;
FULL = 2 / 4.0;
LAST = 3 / 4.0;
NEXTNEW = 4 / 4.0;

function phase_string(p) {
  phase_strings = (
    (0.05, 'new'),
    (0.2,  'waxing crescent'),
    (0.3,  'first quarter'),
    (0.45, 'waxing gibbous'),
    (0.55, 'full'),
    (0.7,  'waning gibbous'),
    (0.8,  'last quarter'),
    (0.95, 'waning crescent'),
    (1.05, 'new')
  );
  //i = bisect.bisect([a[0] for a in phase_strings], p);
  //return phase_strings[i][1];
  return 'yo';
}

function phase(date) {
  day = juliandate(date) - epoch;

  // Mean anomaly of the Sun
  N = fixangle((360/365.2422) * day);

  // Convert from perigee coordinates to epoch 1980
  M = fixangle(N + ecliptic_longitude_epoch - ecliptic_longitude_perigee);
  
  // Solve Kepler's equation
  Ec = kepler(M, eccentricity);
  Ec = Math.sqrt((1 + eccentricity) / (1 - eccentricity)) * Math.tan(Ec / 2.0);
  
  // True anomaly
  Ec = 2 * todeg(Math.atan(Ec));
  
  // Suns's geometric ecliptic longuitude
  lambda_sun = fixangle(Ec + ecliptic_longitude_perigee);
  
  // Orbital distance factor
  F = ((1 + eccentricity * Math.cos(torad(Ec))) / (1 - eccentricity**2));
  
  // Distance to Sun in km
  //sun_dist = sun_smaxis / F;
  //sun_angular_diameter = F * sun_angular_size_smaxis;

  // Calculation of the Moon's position

  // Moon's mean longitude
  moon_longitude = fixangle(13.1763966 * day + moon_mean_longitude_epoch);

  // Moon's mean anomaly
  MM = fixangle(moon_longitude - 0.1114041 * day - moon_mean_perigee_epoch);

  // Moon's ascending node mean longitude
  evection = 1.2739 * Math.sin(torad(2*(moon_longitude - lambda_sun) - MM));

  // Annual equation
  annual_eq = 0.1858 * Math.sin(torad(M));

  // Correction term
  A3 = 0.37 * Math.sin(torad(M));

  MmP = MM + evection - annual_eq - A3;

  // Correction for the equation of the centre
  mEc = 6.2886 * Math.sin(torad(MmP));

  // Another correction term
  A4 = 0.214 * Math.sin(torad(2 * MmP));

  // Corrected longitude
  lP = moon_longitude + evection + mEc - annual_eq + A4;

  // Variation
  variation = 0.6583 * Math.sin(torad(2*(lP - lambda_sun)));

  // True longitude
  lPP = lP + variation;

  // Age of the Moon, in degrees
  moon_age = lPP - lambda_sun;

  // Phase of the Moon
  moon_phase = (1 - Math.cos(torad(moon_age))) / 2.0;

  return {
    phase: fixangle(moon_age) / 360.0,
    illuminated: moon_phase,
    age: synodic_month * fixangle(moon_age) / 360.0
  }

}

date = new Date();
phase_result = phase(date);
phase_text = phase_string(phase_result);
console.info('The moon is ' + phase_text + ', ' + (phase_result.illuminated * 100).toFixed(1) + '% illuminated, ' + phase_result.age.toFixed(1) + ' days old.');

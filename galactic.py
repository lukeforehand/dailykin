
import requests
import json
import re
from datetime import datetime
from bs4 import BeautifulSoup

domain = 'https://spacestationplaza.com'
calendar_url = '/calendar.php?dcode_yr={year}&dcode_mo={month}&dcode_day={day}'

def clean(text):
  return re.sub(' +', ' ', text.strip()).replace('\n \n', '\n')

def get_day(year, month, day):
  
  # get main attributes
  soup = BeautifulSoup(requests.get(domain + calendar_url.format(year = year, month = month, day = day)).text, 'html.parser')
  galactic_day = soup.find_all(class_='cal_row_lt_hlt')
  name = ' '.join(galactic_day[0].find('a').strings)
  resonant = soup.find_all(class_='cal_row_dk_hlt')[0].get_text()[len('RESONANT '):]

  # get attributes
  soup = BeautifulSoup(requests.get(domain + galactic_day[1].find('a')['href']).text, 'html.parser')  
  
  soup.find('legend', class_='affirmation').extract()
  affirmation = clean(' '.join(soup.find('fieldset', class_='affirmation').strings))
  reading = clean(' '.join(soup.find(class_='reading').find(class_='outdent').strings))

  attrs = soup.find(id='col_one_id').find_all('font')
  for i, attr in enumerate(attrs):
    attr_text = clean(' '.join(attr.strings))
    if re.search('^Kin: ', attr_text):
      kin_number = clean(attr_text[len('Kin: '):])
    elif re.search('^Tone: ', attr_text):
        tone = clean(attr_text[len('Tone: '):])
        tone = {
          'number': tone.split(' ', 1)[0],
          'name': tone.split(' ')[1],
          'words': [clean(x) for x in ' '.join(attrs[i + 3].strings).split('*')]
        }
    elif re.search('^Tribe: ', attr_text):
        tribe = clean(attr_text[len('Tribe: '):])
        tribe = {
          'number': tribe.split(' ', 1)[0],
          'name': tribe.split(' ')[1],
          'words': [clean(x) for x in ' '.join(attrs[i + 3].strings).split('*')]
        }
    #else:
      #print(clean(attr_text))

  return {
    'day': {
      'day': day,
      'month': month,
      'year': year,
      'name': name,
      'resonant': resonant,
      'kin_number': kin_number,
      'tone': tone,
      'tribe': tribe,
      'affirmation': affirmation,
      'reading': reading
    }
  }

now = datetime.now()
print(json.dumps(get_day(now.year, now.month, now.day), indent=2))

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  header: {
    color: '#C1CDCD',
    textAlign: 'center',
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
    paddingTop: 10,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Metamorphous' : 'metamorphous_regular'
  },
  header2: {
    color: '#C1CDCD',
    textAlign: 'center',
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
    paddingTop: 10,
    paddingBottom: 5,
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Metamorphous' : 'metamorphous_regular'
  },
  text: {
    color: '#C1CDCD',
    textAlign: 'left',
    fontWeight: 'normal',
    marginLeft: '5%',
    marginRight: '5%',
    lineHeight: 24,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Metamorphous' : 'metamorphous_regular'
  },
  readingtext: {
    color: '#C1CDCD',
    textAlign: 'left',
    fontWeight: 'normal',
    marginLeft: '5%',
    marginRight: '5%',
    lineHeight: 24,
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Metamorphous' : 'metamorphous_regular'
  },
  about: {
    color: '#C1CDCD',
    textAlign: 'left',
    fontWeight: 'normal',
    marginLeft: '5%',
    marginRight: '5%',
    paddingTop: 10,
    paddingBottom: 10,
    lineHeight: 24,
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Metamorphous' : 'metamorphous_regular'
  },
  abouthl: {
    color: 'red'
  },
  box: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 6,
    paddingRight: 6,
    borderWidth: 1,
    borderColor: 'yellow'
  },
  button: {
    borderColor: '#C1CDCD',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 50,
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  buttonText: {
    color: '#C1CDCD',
    textAlign: 'left',
    fontWeight: 'normal',
    fontSize: 22,
    padding: 12,
    marginLeft: '5%',
    marginRight: '5%',
    fontFamily: Platform.OS === 'ios' ? 'Metamorphous' : 'metamorphous_regular'
  }
});

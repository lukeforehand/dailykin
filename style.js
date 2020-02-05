import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  header: {
    color: 'white',
    textAlign: 'center',
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
    paddingTop: 10,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Metamorphous' : 'metamorphous_regular'
  },
  header2: {
    color: 'white',
    textAlign: 'center',
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
    paddingTop: 10,
    paddingBottom: 5,
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Metamorphous' : 'metamorphous_regular'
  },
  text: {
    color: 'white',
    textAlign: 'left',
    fontWeight: 'normal',
    marginLeft: '5%',
    paddingBottom: 10,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Metamorphous' : 'metamorphous_regular'
  }
});

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import HomeScreen from './HomeScreen';
import ReadingScreen from './ReadingScreen';

const TabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        title: 'Daily Kin',
        headerTitle: 'Daily Kin',
        tabBarLabel: 'Daily Kin',
      }
    },
    Reading: {
      screen: ReadingScreen,
      navigationOptions: {
        title: 'Reading',
        headerTitle: 'Reading',
        tabBarLabel: 'Reading',
      }
    }
  }
);

const App = createStackNavigator({
  TabNavigator: {
    screen: TabNavigator,
    navigationOptions: {
      title: 'The Daily Kin',
    },
  },
});

export default createAppContainer(App);

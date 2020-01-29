import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Icon from 'react-native-vector-icons/FontAwesome';

import HomeScreen from './HomeScreen';
import ReadingScreen from './ReadingScreen';

const HomeScreenNavigator = createStackNavigator({
  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: {
      title: 'Daily Kin',
    },
  },
});

const ReadingScreenNavigator = createStackNavigator({
  ReadingScreen: {
    screen: ReadingScreen,
    navigationOptions: {
      title: 'Reading',
    },
  },
})

const TabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreenNavigator,
      navigationOptions: {
        tabBarLabel: 'Daily Kin',
        /*
        tabBarIcon: ({tintColor})=>(
          <Icon name='rocket' color={tintColor} size={25} />
        )
        */
      }
    },
    Reading: {
      screen: ReadingScreenNavigator,
      navigationOptions: {
        tabBarLabel: 'Reading',
      }
    }
  }
);

export default createAppContainer(TabNavigator);

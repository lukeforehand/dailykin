import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import HomeScreen from './HomeScreen';
import ReadingScreen from './ReadingScreen';

const HomeScreenNavigator = createStackNavigator({
  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: {
      title: 'Daily Kin',
      headerTitleStyle: {
        fontFamily: Platform.OS === 'ios' ? 'Metamorphous' : 'metamorphous_regular'
      },
      headerTitleAlign: 'center'
    },
  },
});

const ReadingScreenNavigator = createStackNavigator({
  ReadingScreen: {
    screen: ReadingScreen,
    navigationOptions: {
      title: 'Reading',
      headerTitleStyle: {
        fontFamily: Platform.OS === 'ios' ? 'Metamorphous' : 'metamorphous_regular'
      },
      headerTitleAlign: 'center'
    },
  },
})

const TabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreenNavigator,
      navigationOptions: {
        tabBarLabel: 'Daily Kin',
        tabBarIcon: ({tintColor})=>(
          <Icon name='home' color={tintColor} size={25} />
        )
      }
    },
    Reading: {
      screen: ReadingScreenNavigator,
      navigationOptions: {
        tabBarLabel: 'Reading',
        tabBarIcon: ({tintColor})=>(
          <Icon name='readme' color={tintColor} size={25} />
        )
      }
    }
  }
);

export default createAppContainer(TabNavigator);

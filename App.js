import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import HomeScreen from './HomeScreen';
import ReadingScreen from './ReadingScreen';
import AboutScreen from './AboutScreen';
import DonateScreen from './DonateScreen';

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

const ReadingScreenNavigator = createStackNavigator(
  {
    ReadingScreen: {
      screen: ReadingScreen
    },
  },
  {
    defaultNavigationOptions: {
      title: 'Reading',
      headerTitleStyle: {
        fontFamily: Platform.OS === 'ios' ? 'Metamorphous' : 'metamorphous_regular'
      },
      headerTitleAlign: 'center'
    }
  }
);

const AboutScreenNavigator = createStackNavigator({
  AboutScreen: {
    screen: AboutScreen,
    },
  },
  {
    defaultNavigationOptions: {
      title: 'About',
      headerTitleStyle: {
        fontFamily: Platform.OS === 'ios' ? 'Metamorphous' : 'metamorphous_regular'
      },
      headerTitleAlign: 'center'
    }
  }
);

const DonateScreenNavigator = createStackNavigator({
  DonateScreen: {
    screen: DonateScreen,
    },
  },
  {
    defaultNavigationOptions: {
      title: 'Donate',
      headerTitleStyle: {
        fontFamily: Platform.OS === 'ios' ? 'Metamorphous' : 'metamorphous_regular'
      },
      headerTitleAlign: 'center'
    }
  }
);

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
    },
    About: {
      screen: AboutScreenNavigator,
      navigationOptions: {
        tabBarLabel: 'About',
        tabBarIcon: ({tintColor})=>(
          <Icon name='question' color={tintColor} size={25} />
        )
      }
    },
    Donate: {
      screen: DonateScreenNavigator,
      navigationOptions: {
        tabBarLabel: 'Donate',
        tabBarIcon: ({tintColor})=>(
          <Icon name='donate' color={tintColor} size={25} />
        )
      }
    }
  },
  {
    tabBarOptions: {
      labelStyle: {
        fontFamily: Platform.OS === 'ios' ? 'Metamorphous' : 'metamorphous_regular'
      }
    }
  }
);

export default createAppContainer(TabNavigator);

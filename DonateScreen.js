import React from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ImageBackground
} from 'react-native';

import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
  type InAppPurchase,
  type PurchaseError
} from 'react-native-iap';

import Icon from 'react-native-vector-icons/FontAwesome5';

import style from './style';

const itemSkus = Platform.select({
  ios: [
    'com.dailykin.coins100'
  ],
  android: [
    'com.dailykin.coins100'
  ]
});

export default class DonateScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {

    this.purchaseUpdateSubscription = purchaseUpdatedListener((purchase: InAppPurchase) => {
      receipt = purchase.transactionReceipt;
      RNIap.finishTransaction(purchase, false)
        .catch((error) => {
          console.error(error);
        });
    });

    this.purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
      console.error(error);
    });

    RNIap.getProducts(itemSkus)
      .then((products) => {
        this.setState({
          //products: products,
          products: [
            {localizedPrice: '$1.00', productId: 1},
            {localizedPrice: '$2.00', productId: 2},
            {localizedPrice: '$3.00', productId: 3},
            {localizedPrice: '$4.00', productId: 4},
            {localizedPrice: '$5.00', productId: 5},
            {localizedPrice: '$6.00', productId: 6},
            {localizedPrice: '$7.00', productId: 7},
            {localizedPrice: '$8.00', productId: 8},
            {localizedPrice: '$9.00', productId: 9},
            {localizedPrice: '$10.00', productId: 10},
          ],
          isLoading: false
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentWillUnmount() {
    this.purchaseUpdateSubscription.remove();
    this.purchaseErrorSubscription.remove();
  }

  refreshing() {
    return this.state.isLoading;
  }

  donate(productId) {
    RNIap.requestPurchase(productId, false)
      .then((purchase) => {
        // purchase callback
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {

    if (this.refreshing()) {
      return (
        <SafeAreaView>
          <ImageBackground
            resizeMode='stretch'
            style={{width: '100%', height: '100%'}}
            source={{ uri: 'https://spacestationplaza.com/images/space.jpg' }}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <ActivityIndicator size='large' />
            </View>
          </ImageBackground>
        </SafeAreaView>
      )
    }

    return(
      <SafeAreaView>
        <ImageBackground
            resizeMode='stretch'
            style={{width: '100%', height: '100%'}}
            source={{ uri: 'https://spacestationplaza.com/images/space.jpg' }}>
          <ScrollView>
            <Text style={style.text}>{'\n'}
              If you like this app please consider donating to the developer.
            </Text>
            {this.state.products.map((product) => {
              return (
                <TouchableOpacity onPress={() => this.donate(product.productId)}>
                  <Icon name='home' color='grey' size={30} />
                  <Text style={style.text}>{product.localizedPrice}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }

}

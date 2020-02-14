import React from 'react';
import {
  Alert,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
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
  ios: ['1','2','3','4','5','6','7','8','9','10'],
  android: ['1','2','3','4','5','6','7','8','9','10']
});

export default class DonateScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    this.purchaseUpdateHandler = purchaseUpdatedListener((purchase: InAppPurchase) => {
      receipt = purchase.transactionReceipt;
      RNIap.finishTransaction(purchase, false)
        .then(() => {
          Alert.alert('Donation complete');
        })
        .catch((error) => {
          console.info(error);
        });
    });

    this.purchaseErrorHandler = purchaseErrorListener((error: PurchaseError) => {
      Alert.alert('Problem with completing donation');
      console.info(error);
    });

    RNIap.getProducts(itemSkus)
      .then((products) => {
        this.setState({
          products: products,
          isLoading: false
        });
      })
      .catch((error) => {
        console.info(error);
      });
  }

  componentWillUnmount() {
    this.purchaseUpdateHandler.remove();
    this.purchaseErrorHandler.remove();
  }

  refreshing() {
    return this.state.isLoading;
  }

  donate(product) {
    Alert.alert(
      'Donate ' + product.localizedPrice + '?', '',
      [
        {
          text: 'Yes',
          onPress: () => {
            RNIap.requestPurchase(product.productId, false)
            .then((purchase) => {
              // purchase callback
            })
            .catch((error) => {
              console.info(error);
            });
          }
        },
        { text: 'No'}
      ], {cancelable: false});
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
            <Text style={style.text}>
              {'\n'}If you appreciate this app please consider donating to the developer.{'\n'}
            </Text>
            {this.state.products.map((product) => {
              return (
                <View key={product.productId}
                  style={{ flexDirection: 'row', flex: 1, paddingBottom:3}}>
                  <View style={{ paddingRight: 80 }} />
                  <TouchableOpacity
                    activeOpacity={0.60}
                    style={style.button}
                    onPress={() => this.donate(product)}>
                      <Icon color='#C1CDCD' name='donate' size={35} />
                      <Text style={style.buttonText}>{product.localizedPrice}</Text>
                  </TouchableOpacity>
                  <View style={{ paddingLeft: 80 }} />
                </View>
              );
            })}
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }

}

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
        products = products.sort(function(a, b) {
          return new Number(a.productId) > new Number(b.productId);
        });
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
            {this.state.products.length <= 0 ?
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={style.header2}>Accepting donations soon</Text>
              </View>
            :
              this.state.products.map((product) => {
                return (
                  <View style={{paddingTop: 5}}>
                    <TouchableOpacity
                      key={product.productId}
                      style={style.button}
                      activeOpacity={0.60}
                      onPress={() => this.donate(product)}>
                        <Icon color='#C1CDCD' name='donate' size={35} />
                        <Text style={style.buttonText}>{product.localizedPrice}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })
          }
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }

}

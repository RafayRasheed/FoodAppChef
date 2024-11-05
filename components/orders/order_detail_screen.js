import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
  Text,
  ScrollView,
  StatusBar,
  Easing,
} from 'react-native';
import {
  Loader,
  MyError,
  Spacer,
  StatusbarH,
  errorTime,
  ios,
  myHeight,
  myWidth,
} from '../common';
import {myColors} from '../../ultils/myColors';
import {myFonts, myLetSpacing, myFontSize} from '../../ultils/myFonts';
import firestore, {Filter} from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import {ImageUri} from '../common/image_uri';

export const OrderDetails = ({navigation, route}) => {
  const {item} = route.params;
  const {cart} = item;
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const cartItems = cart.cartItems;
  console.log(cartItems);
  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        setIsLoading(false);
        setErrorMsg(null);
      }, errorTime);
    }
  }, [errorMsg]);

  const items = [
    {
      name: 'Large Burger',
      value: 'Whopper',
    },
    {
      name: 'Small Burger',
      value: 'Original Chicken Sandwich',
    },
    {
      name: 'Zinger Burger',
      value: 'Whopper Cheese',
    },
    {
      name: 'Drink',
      value: '1.5 Litre Coke',
    },
  ];
  function goFurther(order, orderId) {
    Alert.alert('haan');
    firestore()
      .collection('orders')
      .doc(order.userId)
      .collection('orders')
      .doc(orderId.toString())
      .update(order)
      .then(data => {
        Alert.alert('naa');

        navigation.goBack();
      })
      .catch(er => {
        console.log('Error on set order', er);
        setErrorMsg('Something Wrong');
      });
  }
  function onUpdate(status, statusT) {
    // setIsLoading(true)
    // -1=rejected
    // -2=cancelled
    // 100= completed
    // 0 = pending
    // 1 = inProgress
    const orderId = item.orderId.toString();
    const order = {
      ...item,
      // orderId,
      // resId: restaurant.uid,
      // name: restaurant.name,
      // image: restaurant.images[0],
      // dateInt: dateData.dateInt,
      // date: dateData.date + "  " + dateData.time,
      // userId: profile.uid,
      // address,
      // phone,
      // cart: {
      //     ...resCart,
      //     total
      // },
      status,
      statusT,
    };
    database()
      .ref(`/orders/${order.resId}/${orderId}`)
      .update(order)
      .then(() => {
        database()
          .ref(`/orders/${order.userId}/${orderId}`)
          .set(order)
          .then(() => {
            navigation.goBack();
          })
          .catch(er => {
            console.log('Error on set order', er);
            setErrorMsg('Something Wrong');
          });
      })
      .catch(er => {
        console.log('Error on set order', er);
        setErrorMsg('Something Wrong');
      });
    // firestore().collection('orders').doc(order.resId).collection('orders').doc(orderId.toString()).update(order)
    //     .then((data) => {
    //         // setIsLoading(false)

    //         goFurther(order, orderId)

    //     }).catch((er) => {
    //         console.log('Error on set order', er)
    //         setErrorMsg('Something Wrong')

    //     })
  }
  return (
    <>
      {/* <StatusBar backgroundColor={orderModal ? '#00000030' : myColors.background} /> */}
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: myColors.background,
        }}>
        <StatusbarH />
        {/* Top  */}
        <Spacer paddingT={myHeight(1.2)} />

        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: myWidth(4),
            alignItems: 'center',
          }}>
          {/* Back */}
          <TouchableOpacity
            style={{
              paddingEnd: myWidth(3),
            }}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}>
            <Image
              style={{
                width: myHeight(2.6),
                height: myHeight(2.6),
                resizeMode: 'contain',
              }}
              source={require('../assets/home_main/home/back.png')}
            />
          </TouchableOpacity>

          <Text
            numberOfLines={1}
            style={[
              styles.textCommon,
              {
                flex: 1,
                fontFamily: myFonts.bodyBold,
                fontSize: myFontSize.xBody2,
              },
            ]}>
            Order Details
          </Text>
        </View>
        <Spacer paddingT={myHeight(1.2)} />

        {/* Content */}
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: myWidth(4),
            backgroundColor: myColors.background,
            flexGrow: 1,
          }}>
          {/* Name */}
          <Text
            style={[
              styles.textCommon,
              {
                fontSize: myFontSize.medium2,
                fontFamily: myFonts.heading,
              },
            ]}>
            {item.name}
          </Text>

          <Spacer paddingT={myHeight(0.7)} />
          <Text
            style={[
              styles.textCommon,
              {
                fontSize: myFontSize.body2,
                fontFamily: myFonts.headingBold,
              },
            ]}>
            Date:{' '}
            <Text style={{fontFamily: myFonts.bodyBold}}>{item.date}</Text>
          </Text>
          <Spacer paddingT={myHeight(0.7)} />

          <Text
            style={[
              styles.textCommon,
              {
                fontSize: myFontSize.body2,
                fontFamily: myFonts.headingBold,
              },
            ]}>
            Order ID:{' '}
            <Text style={{fontFamily: myFonts.bodyBold}}>{item.orderId}</Text>
          </Text>
          <Spacer paddingT={myHeight(0.7)} />

          <Text
            style={[
              styles.textCommon,
              {
                fontSize: myFontSize.body2,
                fontFamily: myFonts.headingBold,
              },
            ]}>
            Address:{' '}
            <Text style={{fontFamily: myFonts.bodyBold}}>{item.address}</Text>
          </Text>
          <Spacer paddingT={myHeight(0.7)} />

          <Text
            style={[
              styles.textCommon,
              {
                fontSize: myFontSize.body2,
                fontFamily: myFonts.headingBold,
              },
            ]}>
            Phone:{' '}
            <Text style={{fontFamily: myFonts.bodyBold}}>{item.phone}</Text>
          </Text>
          <Spacer paddingT={myHeight(0.7)} />

          <Text
            style={[
              styles.textCommon,
              {
                fontSize: myFontSize.body2,
                fontFamily: myFonts.headingBold,
              },
            ]}>
            Delevery Charges:{' '}
            <Text style={{fontFamily: myFonts.bodyBold}}>
              {item.deliveryCharges}
            </Text>
          </Text>
          <Spacer paddingT={myHeight(0.7)} />

          <Text
            style={[
              styles.textCommon,
              {
                fontSize: myFontSize.body2,
                fontFamily: myFonts.headingBold,
              },
            ]}>
            Delevery Time:{' '}
            <Text style={{fontFamily: myFonts.bodyBold}}>
              {item.delivery} minutes
            </Text>
          </Text>
          <Spacer paddingT={myHeight(1.5)} />
          {cartItems?.map((cartItem, i) => {
            const {item} = cartItem;
            return (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  marginVertical: myHeight(1.15),
                  paddingHorizontal: myWidth(2.5),
                  borderRadius: myWidth(1.5),
                  backgroundColor: myColors.background,
                  elevation: 4.5,
                  paddingVertical: myHeight(0.8),
                }}>
                {/* <Image style={{
                                    width: myHeight(10),
                                    height: myHeight(10),
                                    resizeMode: 'contain',
                                    borderRadius: myWidth(1.5)
                                }} source={item.images[0]} /> */}

                <Spacer paddingEnd={myWidth(2.5)} />
                <View style={{flex: 1}}>
                  {/* name */}
                  <Text
                    style={[
                      styles.textCommon,
                      {
                        fontSize: myFontSize.xBody,
                        fontFamily: myFonts.heading,
                      },
                    ]}>
                    {cartItem.quantity}x {item.name}
                  </Text>

                  {/* price & subtotal */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={[
                          styles.textCommon,
                          {
                            color: myColors.text3,
                            fontSize: myFontSize.body,
                            fontFamily: myFonts.bodyBold,
                          },
                        ]}>
                        Price:{' '}
                      </Text>
                      <Text
                        style={[
                          styles.textCommon,
                          {
                            fontSize: myFontSize.body,
                            fontFamily: myFonts.heading,
                          },
                        ]}>
                        {item.price}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={[
                          styles.textCommon,
                          {
                            color: myColors.text3,
                            fontSize: myFontSize.body,
                            fontFamily: myFonts.bodyBold,
                          },
                        ]}>
                        Sub Total:{' '}
                      </Text>
                      <Text
                        style={[
                          styles.textCommon,
                          {
                            fontSize: myFontSize.body,
                            fontFamily: myFonts.heading,
                          },
                        ]}>
                        {cartItem.totalPrice}{' '}
                      </Text>
                    </View>
                  </View>

                  {item.selectOptions && (
                    <View
                      style={{
                        paddingTop: myHeight(0.4),
                        paddingBottom: myHeight(0.2),
                      }}>
                      {item.selectOptions.map((option, i) => (
                        <View key={i} style={{flexDirection: 'row'}}>
                          <Text
                            style={[
                              styles.textCommon,
                              {
                                fontSize: myFontSize.xSmall,
                                color: myColors.text,
                                fontFamily: myFonts.bodyBold,
                                paddingTop: myHeight(0.3),
                              },
                            ]}>
                            {option.name}:{' '}
                            <Text style={{color: myColors.textL4}}>
                              {option.value}
                            </Text>
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <Spacer paddingT={myHeight(0.5)} />
                </View>
              </View>
            );
          })}
          <Spacer paddingT={myHeight(1)} />
          {/* Divider */}
          <View
            style={{borderTopWidth: myHeight(0.18), borderColor: myColors.dot}}
          />
          <Spacer paddingT={myHeight(1.5)} />

          {/* Total Price */}
          <View style={{flexDirection: 'row'}}>
            <Text
              style={[
                styles.textCommon,
                {
                  flex: 1,
                  fontSize: myFontSize.xBody,
                  fontFamily: myFonts.heading,
                  color: myColors.primaryT,
                },
              ]}>
              Total
            </Text>
            <Text
              style={[
                styles.textCommon,
                {
                  fontSize: myFontSize.xBody,
                  fontFamily: myFonts.heading,
                  color: myColors.primaryT,
                },
              ]}>
              {cart.total}
            </Text>
          </View>
        </ScrollView>

        {/* Buttons */}
        <View style={{paddingHorizontal: myWidth(4)}}>
          <Spacer paddingT={myHeight(1.5)} />

          {/* Invoice */}
          {/* <TouchableOpacity activeOpacity={0.8} onPress={() => null}
                        style={{
                            backgroundColor: myColors.background,
                            borderRadius: myHeight(0.8),
                            paddingVertical: myHeight(1.1),
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: myHeight(0.1), borderColor: myColors.primaryT,
                            flexDirection: 'row',
                        }}>
                        <Image style={{
                            height: myHeight(2.6),
                            width: myHeight(2.6),
                            resizeMode: 'contain',
                            tintColor: myColors.primaryT
                        }} source={require('../assets/activity/download.png')} />

                        <Spacer paddingEnd={myWidth(2)} />
                        <Text style={[
                            styles.textCommon,
                            {
                                fontSize: myFontSize.body2,
                                fontFamily: myFonts.heading,
                                color: myColors.primaryT,
                            }
                        ]}>Invoice</Text>
                    </TouchableOpacity> */}
          <Spacer paddingT={myHeight(2)} />

          {/* Rebook */}
          {item.status == 0 && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onUpdate(1, 'In Progress')}
              style={{
                backgroundColor: myColors.primaryT,
                borderRadius: myHeight(0.8),
                paddingVertical: myHeight(1.1),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={[
                  styles.textCommon,
                  {
                    fontSize: myFontSize.body2,
                    fontFamily: myFonts.heading,
                    color: myColors.background,
                  },
                ]}>
                Accept
              </Text>
            </TouchableOpacity>
          )}
          <Spacer paddingT={myHeight(1.5)} />

          {/* Reject */}
          {item.status == 0 && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onUpdate(-1, 'Rejected')}
              style={{
                backgroundColor: myColors.red,
                borderRadius: myHeight(0.8),
                paddingVertical: myHeight(1.1),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={[
                  styles.textCommon,
                  {
                    fontSize: myFontSize.body2,
                    fontFamily: myFonts.heading,
                    color: myColors.background,
                  },
                ]}>
                Reject
              </Text>
            </TouchableOpacity>
          )}

          {/* Completed */}
          {item.status == 1 && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onUpdate(100, 'Completed')}
              style={{
                backgroundColor: myColors.primaryT,
                borderRadius: myHeight(0.8),
                paddingVertical: myHeight(1.1),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={[
                  styles.textCommon,
                  {
                    fontSize: myFontSize.body2,
                    fontFamily: myFonts.heading,
                    color: myColors.background,
                  },
                ]}>
                Completed
              </Text>
            </TouchableOpacity>
          )}
          <Spacer paddingT={myHeight(2)} />
        </View>
      </SafeAreaView>

      {isLoading && <Loader />}
      {errorMsg && <MyError message={errorMsg} />}
    </>
  );
};

const styles = StyleSheet.create({
  //Text
  textCommon: {
    color: myColors.text,
    letterSpacing: myLetSpacing.common,
    includeFontPadding: false,
    padding: 0,
  },
});

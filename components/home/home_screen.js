import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Image, View, Text, FlatList, Modal, UIManager, LayoutAnimation } from 'react-native'
import { MyError, Spacer, StatusbarH, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';
import { Categories, Restaurants, } from './home_data'
import { ResturantH } from './home.component/resturant_hori';
import { Banners } from './home.component/banner';
import { RestaurantInfo } from './home.component/restaurant_info';
import { RestRating } from './rest_rating_screen';
import { getCartLocal, getLogin } from '../functions/storageMMKV';
import { setCart } from '../../redux/cart_reducer';
import { useDispatch, useSelector } from 'react-redux';
import { setFavoriteItem, setFavoriteRest } from '../../redux/favorite_reducer';
import { RestaurantInfoSkeleton } from '../common/skeletons';
import { HomeSkeleton } from './home.component/home_skeleton';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { RestaurantInfoFull } from './home.component/restaurant_info_full';
import { setMainCategories } from '../../redux/category_reducer';
import { setProfile } from '../../redux/profile_reducer';
import { setHistoryOrderse, setPendingOrderse, setProgressOrderse } from '../../redux/order_reducer';
import database from '@react-native-firebase/database';

if (!ios && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}
export const HomeScreen = ({ navigation }) => {
    const name = "Someone";
    const { profile } = useSelector(state => state.profile)

    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(true)

    function getCategories() {
        let catArray = []
        firestore().collection('categories').orderBy('count', 'desc').get().then((result) => {
            if (!result.empty) {
                result.forEach((cat) => {
                    catArray.push(cat.data())
                })
                dispatch(setMainCategories(catArray))
                setIsLoading(false)

            }

        }).catch((er) => {
            console.log('Error on Get Category', er)
        })
    }
    // re.turn (<Test />)
    useEffect(() => {
        firestore().collection('restaurants').doc(profile.uid).get()
            .then((data) => {
                const pro = data.data()


                console.log(JSON.stringify(pro))
                dispatch(setProfile(pro))
            }).catch(() => {
                console.log('Error getting profile update')
            })
        getCategories()
    }, [])

    useEffect(() => {
        database()
            .ref(`/orders/${profile.uid}`)
            .on('value', snapshot => {
                let pending = []
                let progress = []
                let history = []
                snapshot.forEach(documentSnapshot1 => {
                    const order = documentSnapshot1.val()
                    if (order.status == -1 || order.status == 100 || order.status == -2) {
                        history.push(order)
                    }
                    else if (order.status == 0) {
                        pending.push(order)
                    }
                    else {
                        progress.push(order)
                    }

                });
                pending.sort((a, b) => b.dateInt - a.dateInt);
                progress.sort((a, b) => b.dateInt - a.dateInt);
                history.sort((a, b) => b.dateInt - a.dateInt);
                dispatch(setPendingOrderse(pending))
                dispatch(setHistoryOrderse(history))
                dispatch(setProgressOrderse(progress))
                console.log('User data: ', pending.length, progress.length, history.length);
            });
        // const subscriber = firestore().collection('orders').doc(profile.uid).collection('orders')
        //     .onSnapshot(documentSnapshot => {
        //         let pending = []
        //         let progress = []
        //         let history = []
        //         documentSnapshot.forEach(documentSnapshot1 => {
        //             const order = documentSnapshot1.data()
        //             if (order.status == -1 || order.status == 100 || order.status == -2) {
        //                 history.push(order)
        //             }
        //             else if (order.status == 0) {
        //                 pending.push(order)
        //             }
        //             else {
        //                 progress.push(order)
        //             }

        //         });
        //         pending.sort((a, b) => b.dateInt - a.dateInt);
        //         progress.sort((a, b) => b.dateInt - a.dateInt);
        //         history.sort((a, b) => b.dateInt - a.dateInt);
        //         dispatch(setPendingOrderse(pending))
        //         dispatch(setHistoryOrderse(history))
        //         dispatch(setProgressOrderse(progress))
        //     });

        // // Stop listening for updates when no longer required
        // return () => subscriber();
        console.log(JSON.stringify(profile))
    }, []);

    return (

        <SafeAreaView style={styles.container}>
            <StatusbarH />
            {
                isLoading ? <HomeSkeleton />
                    :
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} >

                        <Spacer paddingT={myHeight(1.4)} />
                        <Text style={[styles.textCommon, {
                            fontSize: myFontSize.medium2,
                            fontFamily: myFonts.heading,
                            alignSelf: 'center',

                        }]}>Foodapp<Text style={{ color: myColors.primaryT }}> CHEF</Text> </Text>

                        <Spacer paddingT={myHeight(3)} />
                        {/* Search */}
                        {/* <TouchableOpacity activeOpacity={0.8} style={{
                            flexDirection: 'row', alignItems: 'center', width: myWidth(85),
                            backgroundColor: myColors.divider, alignSelf: 'center', paddingVertical: myHeight(1.3),
                            borderRadius: myWidth(2.5)

                        }} onPress={() => navigation.navigate('Search')}>
                            <Spacer paddingEnd={myWidth(4)} />
                            <Image style={{
                                height: myHeight(2.2), width: myHeight(2.2), resizeMode: 'contain', tintColor: myColors.offColor
                            }} source={require('../assets/home_main/home/search.png')} />
                            <Spacer paddingEnd={myWidth(3)} />

                            <Text style={[styles.textCommon, {
                                fontSize: myFontSize.body,
                                fontFamily: myFonts.bodyBold,
                                color: myColors.offColor
                            }]}>Search dishes, restaurants</Text>
                        </TouchableOpacity> */}

                        <Text style={[styles.textCommon, {
                            fontSize: myFontSize.xxBody,
                            fontFamily: myFonts.bodyBold,
                            paddingStart: myWidth(4)
                        }]}>Your Restaurant</Text>
                        <Spacer paddingT={myHeight(1.5)} />

                        {
                            profile.update ?
                                <TouchableOpacity activeOpacity={0.9} onPress={() => {
                                    navigation.navigate('RestaurantDetail')

                                }} >

                                    <RestaurantInfoFull restaurant={profile} navigate={navigation.navigate} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity
                                    activeOpacity={0.75} onPress={() => {
                                        navigation.navigate('RestaurantEdit')

                                    }} style={{
                                        marginHorizontal: myWidth(4),
                                        height: myHeight(20), justifyContent: 'center', alignItems: 'center',
                                        borderRadius: myWidth(4), backgroundColor: myColors.offColor7
                                    }}>



                                    <Text style={[styles.textCommon,
                                    {
                                        fontFamily: myFonts.body,
                                        fontSize: myFontSize.body4,
                                        textAlign: 'center'

                                    }]}>
                                        Add Restaurant Details {'\n'}For Publish
                                    </Text>



                                </TouchableOpacity>
                        }

                        <Spacer paddingT={myHeight(2.5)} />
                        {/* CAtegories*/}
                        {/* <View>
                            <View style={{
                                paddingHorizontal: myWidth(4), alignItems: 'center', flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <Text style={[styles.textCommon, {
                                    fontSize: myFontSize.xxBody,
                                    fontFamily: myFonts.bodyBold,
                                }]}>Categories</Text>

                                <TouchableOpacity style={{
                                    flexDirection: 'row', alignItems: 'center', paddingVertical: myHeight(0.4),
                                    paddingStart: myWidth(2)
                                }} activeOpacity={0.6} onPress={() => navigation.navigate('CategoryFull', { categories })}>

                                    <Text
                                        style={[styles.textCommon, {
                                            fontSize: myFontSize.body2,
                                            fontFamily: myFonts.bodyBold,
                                            color: myColors.primaryT
                                        }]}>See All</Text>
                                    <Image style={{
                                        height: myHeight(1.5), width: myHeight(1.5), marginStart: myWidth(1),
                                        resizeMode: 'contain', tintColor: myColors.primaryT
                                    }} source={require('../assets/home_main/home/go.png')} />
                                </TouchableOpacity>
                            </View>

                            <Spacer paddingT={myHeight(0.3)} />
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: myWidth(1) }}>

                                {categories?.slice(0, 4).map((item, i) =>

                                    <View key={i} style={{ padding: myHeight(1.4), paddingEnd: myWidth(2) }}>
                                        <TouchableOpacity activeOpacity={0.8} style={{
                                            flexDirection: 'row', alignItems: 'center', borderRadius: myHeight(15),
                                            backgroundColor: myColors.background,
                                            // backgroundColor:myColors.primaryL,  
                                            padding: myHeight(0.8), elevation: 8
                                        }} onPress={() => navigation.navigate('RestaurantAll', { name: item.name, restaurants: Restaurants })}>
                                            <View style={{
                                                height: myHeight(5), width: myHeight(5), borderRadius: myHeight(5),
                                                backgroundColor: '#00000008',
                                                // backgroundColor:myColors.background, 
                                                alignItems: 'center', justifyContent: 'center'
                                            }}>

                                                <Image style={{
                                                    height: myHeight(4.2), width: myHeight(4.2),
                                                    resizeMode: 'contain',
                                                }}
                                                    source={{ uri: item.image }} />
                                            </View>

                                            <Spacer paddingEnd={myWidth(2)} />
                                            <Text
                                                style={[styles.textCommon, {
                                                    fontSize: myFontSize.body2,
                                                    fontFamily: myFonts.heading,
                                                }]}>{item.name}</Text>
                                            <Spacer paddingEnd={myWidth(2.7)} />

                                        </TouchableOpacity>
                                    </View>
                                )}
                            </ScrollView>

                        </View> */}
                    </ScrollView>
            }

        </SafeAreaView>
    )
}






const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: myColors.background
    },


    //Text
    textCommon: {
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },

})
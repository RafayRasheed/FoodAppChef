import React, { useEffect, useRef, useState } from 'react';
import {
    ScrollView, StyleSheet, TouchableOpacity, Image,
    View, Text, StatusBar, TextInput,
    Linking, Platform, ImageBackground, SafeAreaView, FlatList,
} from 'react-native';
import { MyError, Spacer, StatusbarH, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';
import { useSelector } from 'react-redux';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

async function chooseFile() {
    const options = {
        mediaType: 'photo',
        selectionLimit: 1,
    }
    launchCamera(options, callback => {
        if (callback.assets) {
            console.log(callback.assets)
        }
        else if (callback.didCancel) {
            console.log('didCancel')
        }
        else if (callback.errorCode) {
            console.log('errorCode')
        }

    });

    // launchImageLibrary(options, callback => {
    //     if (callback.assets) {
    //         console.log(callback.assets)
    //     }
    //     else if (callback.didCancel) {
    //         console.log('didCancel')
    //     }
    //     else if (callback.errorCode) {
    //         console.log('errorCode')
    //     }

    // });


};
const CommonFaci = ({ name, fac, setFAc }) => (
    <TouchableOpacity activeOpacity={0.75}
        onPress={() => {
            setFAc(!fac)
            chooseFile()
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <View style={{
                height: myHeight(3.5),
                width: myHeight(3.5),
                paddingTop: myHeight(0.75)
            }}>
                <View style={{ width: myHeight(2.2), height: myHeight(2.2), borderWidth: 1.5, borderColor: myColors.textL4 }} />
                {
                    fac &&
                    <Image style={{
                        height: myHeight(3.5),
                        width: myHeight(3.5),
                        resizeMode: 'contain',
                        tintColor: myColors.primaryT,
                        marginTop: -myHeight(3.3)
                    }} source={require('../assets/profile/check2.png')} />
                }
            </View>
            <Spacer paddingEnd={myWidth(1)} />
            <Text style={[styles.textCommon,
            {
                fontFamily: myFonts.bodyBold,
                fontSize: myFontSize.xBody,

            }]}>{name}</Text>
        </View>
    </TouchableOpacity>
)
export const RestaurantEdit = ({ navigation }) => {

    // const [, set] = useState(true)

    const [isLoading, setIsLoading] = useState(true)
    const facArray = ['Dine In', 'Delivery', 'Take Away',]
    const [DineIn, setDineIn] = useState(false)
    const [Delivery, setDelivery] = useState(false)
    const [TakeAway, setTakeAway] = useState(false)
    const [address, setAddress] = useState(null)




    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: myColors.background }}>
                <StatusbarH />
                {/* Top */}
                <View>
                    <Spacer paddingT={myHeight(1.5)} />
                    <View style={{ paddingEnd: myWidth(4), flexDirection: 'row', alignItems: 'center' }}>
                        {/* Search */}

                        {/* Arrow */}
                        <TouchableOpacity activeOpacity={0.7}
                            onPress={() => navigation.goBack()} style={{ paddingHorizontal: myWidth(4), }}>
                            <Image style={{
                                height: myHeight(2.4),
                                width: myHeight(2.4),
                                resizeMode: 'contain',
                                tintColor: myColors.textL0
                            }} source={require('../assets/home_main/home/back.png')} />
                        </TouchableOpacity>
                        {/* <Spacer paddingEnd={myWidth(2.5)} /> */}
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2
                        }]}>
                            Restautant Details
                        </Text>
                    </View>
                    <Spacer paddingT={myHeight(1.5)} />

                    <View style={{ height: myHeight(0.6), backgroundColor: myColors.divider }} />
                </View>
                <Spacer paddingT={myHeight(1.5)} />

                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: myWidth(4) }}>
                    {/* Background Image */}
                    <TouchableOpacity activeOpacity={0.75} onPress={() => null}
                        style={{
                            height: myHeight(20), justifyContent: 'center', alignItems: 'center',
                            borderRadius: myWidth(4), backgroundColor: myColors.offColor7
                        }}>
                        <View>

                            <Text style={[styles.textCommon,
                            {
                                fontFamily: myFonts.body,
                                fontSize: myFontSize.body4,

                            }]}>
                                Upload Background Image
                            </Text>
                            <Text style={[styles.textCommon,
                            {
                                fontFamily: myFonts.body,
                                fontSize: myFontSize.body,
                                textAlign: 'center'

                            }]}>
                                (maximum size 1 MB)
                            </Text>
                        </View>

                    </TouchableOpacity>

                    <Spacer paddingT={myHeight(2.5)} />
                    {/* FAcilities */}
                    <View>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2,

                        }]}>Select Facilities</Text>
                        <Spacer paddingT={myHeight(1)} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            <CommonFaci name={'Dine In'} fac={DineIn} setFAc={setDineIn} />
                            <CommonFaci name={'Delivery'} fac={Delivery} setFAc={setDelivery} />
                            <CommonFaci name={'Take Away'} fac={TakeAway} setFAc={setTakeAway} />
                        </View>
                    </View>

                    <Spacer paddingT={myHeight(2.5)} />
                    {/* Location */}
                    <View>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2,

                        }]}>Location</Text>
                        <Spacer paddingT={myHeight(1)} />
                        <TextInput placeholder="Type Restaurant Address"
                            multiline={true}
                            autoCorrect={false}
                            numberOfLines={2}
                            placeholderTextColor={myColors.offColor}
                            selectionColor={myColors.primary}
                            cursorColor={myColors.primaryT}
                            value={address} onChangeText={setAddress}
                            style={{
                                height: myHeight(12),
                                textAlignVertical: 'top',
                                borderRadius: myWidth(2),
                                width: '100%',
                                paddingBottom: ios ? myHeight(1.2) : myHeight(100) > 600 ? myHeight(0.8) : myHeight(0.1),
                                paddingTop: ios ? myHeight(1.2) : myHeight(100) > 600 ? myHeight(1.2) : myHeight(0.3),
                                fontSize: myFontSize.body,
                                color: myColors.text,
                                includeFontPadding: false,
                                fontFamily: myFonts.body,
                                paddingHorizontal: myWidth(3),
                                backgroundColor: myColors.offColor7
                            }}
                        />
                    </View>

                </ScrollView>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({

    //Text
    textCommon: {
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },
})
import React, { useEffect, useRef, useState } from 'react';
import {
    ScrollView, StyleSheet, TouchableOpacity, Image,
    View, Text, StatusBar, TextInput, Alert,
    Linking, Platform, ImageBackground, SafeAreaView, FlatList,
} from 'react-native';
import { MyError, Spacer, StatusbarH, errorTime, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';
import { useSelector } from 'react-redux';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { getLogin } from '../functions/storageMMKV';

import storage from '@react-native-firebase/storage';
import { ImageUri } from '../common/image_uri';
import { ChangeImageView } from './profile_component/change_image_modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Clipboard from '@react-native-clipboard/clipboard'
import { isValid } from 'js-base64';

export const RestaurantEdit = ({ navigation }) => {

    // const [, set] = useState(true)

    const [isLoading, setIsLoading] = useState(true)
    const facArray = ['Dine In', 'Delivery', 'Take Away',]
    const [DineIn, setDineIn] = useState(false)
    const [Delivery, setDelivery] = useState(false)
    const [TakeAway, setTakeAway] = useState(false)
    const [address, setAddress] = useState(null)
    const { profile } = useSelector(state => state.profile)

    const [showChangeModal, setShowChangeModal] = useState(false)
    const [image, setImage] = useState(null);
    const [locLink, setLocLink] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null)

    useEffect(() => {
        if (errorMsg) {
            setTimeout(() => {
                setIsLoading(false)
                setErrorMsg(null)
            }
                , errorTime)
        }
    }, [errorMsg])

    async function chooseFile() {
        const options = {
            mediaType: 'photo',
            selectionLimit: 1,
        }
        // launchCamera(options, callback => {
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

        launchImageLibrary(options, callback => {
            if (callback.assets) {
                const asset = callback.assets[0]
                const sizeKB = asset.fileSize / 1000000
                console.log(sizeKB)
                const source = asset.uri
                if (sizeKB <= 1) {

                    setImage(source);
                    // uploadImage(source)
                    // uploadImage(source)
                }
                else {
                    setErrorMsg(`Maximum Image Size is 1 MB`)
                }
                // console.log(source);
            }
            else if (callback.didCancel) {
                console.log('didCancel')
            }
            else if (callback.errorCode) {
                console.log('errorCode')
            }

        });


    };

    const uploadImage = async (uri) => {
        const path = `images/restaurants/${profile.uid}/background`
        storage()
            .ref(path)
            .putFile(uri)
            .then((s) => {
                storage().ref(path).getDownloadURL().then((uri) => {

                    console.log('uri recieved')
                }).catch((e) => {
                    shoE
                    console.log('er', e)

                })

            }).catch(err => console.log(err));

        // try {
        //     await task;
        // } catch (e) {
        //     console.error(e);
        // }

    };

    const CommonFaci = ({ name, fac, setFAc }) => (
        <TouchableOpacity activeOpacity={0.75}
            onPress={() => {
                setFAc(!fac)
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

    const verifyLink = async () => {
        const text = await Clipboard.getString();
        const isValid = text.toString().includes(('https' || 'http') && 'maps')
        //    (https|http)maps
        if (isValid) {
            setLocLink(text)
            return
        } else {

            setErrorMsg('Invalid Url')
        }

        // setLocLink(text);
    };
    function onChangeImage() {
        chooseFile()
    }
    function onViewImage() {
        navigation.navigate("ImageViewer", { images: [{ uri: image }], i: 0 })
    }


    function onPaste() {
        if (locLink) {
            setLocLink(null)
            return
        }
        verifyLink()


    }
    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: myColors.background }}>
                <StatusbarH />
                <KeyboardAwareScrollView>
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
                        <TouchableOpacity activeOpacity={0.75} onPress={() => {
                            // if (image) {
                            //     setShowChangeModal(true)
                            // }
                            // else {
                            //     onChangeImage()
                            // }
                            onChangeImage()

                        }}
                            style={{
                                height: myHeight(20), justifyContent: 'center', alignItems: 'center',
                                borderRadius: myWidth(4), backgroundColor: myColors.offColor7
                            }}>
                            {
                                image ?
                                    <ImageUri width={'100%'} height={'100%'} resizeMode='cover' uri={image} />

                                    :
                                    <View>

                                        <Text style={[styles.textCommon,
                                        {
                                            fontFamily: myFonts.body,
                                            fontSize: myFontSize.body4,

                                        }]}>
                                            Upload Background Image *
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
                            }

                        </TouchableOpacity>

                        <Spacer paddingT={myHeight(2.5)} />
                        {/* FAcilities */}
                        <View>
                            <Text style={[styles.textCommon,
                            {
                                fontFamily: myFonts.heading,
                                fontSize: myFontSize.xBody2,

                            }]}>Select Facilities *</Text>
                            <Spacer paddingT={myHeight(1.3)} />

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                <CommonFaci name={'Dine In'} fac={DineIn} setFAc={setDineIn} />
                                <CommonFaci name={'Delivery'} fac={Delivery} setFAc={setDelivery} />
                                <CommonFaci name={'Take Away'} fac={TakeAway} setFAc={setTakeAway} />
                            </View>
                        </View>

                        <Spacer paddingT={myHeight(2.7)} />
                        {/* Location */}
                        <View>
                            <Text style={[styles.textCommon,
                            {
                                fontFamily: myFonts.heading,
                                fontSize: myFontSize.xBody2,

                            }]}>Location *</Text>
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
                                    height: myFontSize.body * 2 + myHeight(6),
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


                        <Spacer paddingT={myHeight(2.5)} />
                        {/* Link */}
                        <View>
                            <Text style={[styles.textCommon,
                            {
                                fontFamily: myFonts.heading,
                                fontSize: myFontSize.xBody2,

                            }]}>Link</Text>
                            <Spacer paddingT={myHeight(1)} />

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{
                                        flexGrow: 1,
                                        paddingVertical: myHeight(1.2), paddingHorizontal: myWidth(3),
                                        backgroundColor: myColors.offColor7, borderRadius: 5
                                    }}>
                                    <Text numberOfLines={1} style={[styles.textCommon,
                                    {
                                        fontFamily: myFonts.bodyBold,
                                        fontSize: myFontSize.body3,
                                        color: locLink ? myColors.text : myColors.textL3

                                    }]}>{locLink ? locLink : 'Ex: http://maps.google.com/..'}</Text>
                                </ScrollView>
                                <Spacer paddingEnd={myWidth(4)} />
                                <TouchableOpacity activeOpacity={0.7} onPress={onPaste} style={{
                                    paddingVertical: myHeight(1), paddingHorizontal: myWidth(5),
                                    backgroundColor: myColors.primaryT, borderRadius: 5
                                }}>
                                    <Text style={[styles.textCommon,
                                    {
                                        fontFamily: myFonts.body,
                                        fontSize: myFontSize.body3,
                                        color: myColors.background

                                    }]}>{locLink ? 'Clear' : 'Paste'}</Text>

                                </TouchableOpacity>
                            </View>
                        </View>


                    </ScrollView>
                </KeyboardAwareScrollView>
                {showChangeModal &&

                    <ChangeImageView onChange={onChangeImage} onView={onViewImage} onHide={setShowChangeModal} />
                }
                {errorMsg && <MyError message={errorMsg} />}

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
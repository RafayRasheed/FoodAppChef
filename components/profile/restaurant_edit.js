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
import { CalenderDate } from './profile_component/calender';
import Collapsible from 'react-native-collapsible';

export const RestaurantEdit = ({ navigation }) => {

    // const [, set] = useState(true)

    const [isLoading, setIsLoading] = useState(true)
    const facArray = ['Dine In', 'Delivery', 'Take Away',]
    const [DineIn, setDineIn] = useState(false)
    const [Delivery, setDelivery] = useState(false)
    const [DeliveryFee, SetDeliveryFee] = useState(null)
    const [DeliveryTime, SetDeliveryTime] = useState(null)
    const [Description, SetDescription] = useState(null)
    const [offer, Setoffer] = useState(null)
    const [TakeAway, setTakeAway] = useState(false)
    const [address, setAddress] = useState(null)
    const { profile } = useSelector(state => state.profile)

    const [showChangeModal, setShowChangeModal] = useState(false)
    const [image, setImage] = useState(null);
    const [locLink, setLocLink] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null)
    const [change, setChange] = useState(null)
    const [time, setTime] = useState(null)
    const [showTimeModal, setShowTimeModal] = useState(false)
    const [timmings, setTimmings] = useState([
        {
            day: 'Mon',
            open: true, startTime: '', startCurrent: null, endTime: '', endCurrent: null
        },
        {
            day: 'Tue',
            open: true, startTime: '', startCurrent: null, endTime: '', endCurrent: null
        },
        {
            day: 'Wed',
            open: true, startTime: '', startCurrent: null, endTime: '', endCurrent: null
        },
        {
            day: 'Thu',
            open: true, startTime: '', startCurrent: null, endTime: '', endCurrent: null
        },
        {
            day: 'Fri',
            open: true, startTime: '', startCurrent: null, endTime: '', endCurrent: null
        },
        {
            day: 'Sat',
            open: true, startTime: '', startCurrent: null, endTime: '', endCurrent: null
        },
        {
            day: 'Sun',
            open: true, startTime: '', startCurrent: null, endTime: '', endCurrent: null
        },
    ])
    const [MenuImages, setMenuImages] = useState([])
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

    async function chooseFileMenu(i) {
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
                const source = asset.uri
                if (sizeKB <= 1) {

                    if (i != null) {
                        const copy = MenuImages
                        copy[i] = source
                        setMenuImages(copy)

                    } else {
                        MenuImages.push(source)
                        setMenuImages(MenuImages)
                    }
                    setChange(!change)
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

    const TimingsCom = ({ i }) => {
        const single = timmings[i]
        return (
            <View key={i} style={{ marginVertical: myHeight(1), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[styles.textCommon,
                {
                    flex: 1,
                    fontFamily: myFonts.body,
                    fontSize: myFontSize.xxBody,
                    color: myColors.text,
                    textAlignVertical: 'center',
                    // marginTop: -myHeight(0.5)

                }]}>{single.day}</Text>


                {
                    single.open &&

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                        <TouchableOpacity activeOpacity={0.7} onPress={() => {
                            setShowTimeModal({ i, start: true, current: single.startCurrent })
                        }} style={{
                            paddingVertical: myHeight(0.8), paddingHorizontal: myWidth(2),
                            backgroundColor: myColors.offColor7, borderRadius: 7
                        }}>
                            <Text numberOfLines={1} style={[styles.textCommon,
                            {
                                fontFamily: myFonts.bodyBold,
                                fontSize: myFontSize.body,
                                minWidth: myFontSize.body + myWidth(13),
                                textAlign: 'center',
                                color: single.startTime ? myColors.text : myColors.textL4

                            }]}>{single.startTime ? single.startTime : 'SELECT'}</Text>
                        </TouchableOpacity>

                        <Spacer paddingEnd={myWidth(1)} />
                        <Text numberOfLines={1} style={[styles.textCommon,
                        {
                            fontFamily: myFonts.bodyBold,
                            fontSize: myFontSize.body,

                        }]}>-</Text>
                        <Spacer paddingEnd={myWidth(1)} />

                        <TouchableOpacity activeOpacity={0.7} onPress={() => {
                            setShowTimeModal({ i, start: false, current: single.endCurrent })
                        }} style={{

                            paddingVertical: myHeight(0.8), paddingHorizontal: myWidth(2),
                            backgroundColor: myColors.offColor7, borderRadius: 7
                        }}>
                            <Text numberOfLines={1} style={[styles.textCommon,
                            {
                                fontFamily: myFonts.bodyBold,
                                fontSize: myFontSize.body,
                                minWidth: myFontSize.body + myWidth(13),
                                textAlign: 'center',
                                color: single.endTime ? myColors.text : myColors.textL4

                            }]}>{single.endTime ? single.endTime : 'SELECT'}</Text>
                        </TouchableOpacity>
                    </View>

                }


                <Spacer paddingEnd={myWidth(4)} />

                {/* Button */}
                <TouchableOpacity activeOpacity={0.7}
                    onPress={() => {
                        const copy = timmings
                        copy[i].open = !single.open

                        setTimmings(copy)
                        setChange(!change)


                    }} style={{
                        paddingVertical: myHeight(0.8), paddingHorizontal: myWidth(4),
                        borderRadius: 5,
                        backgroundColor: single.open ? myColors.primaryT : 'red',
                    }}>
                    <Text style={[styles.textCommon,
                    {
                        fontFamily: myFonts.body,
                        fontSize: myFontSize.body,
                        color: myColors.background

                    }]}>{single.open ? 'Open' : 'Close'}</Text>

                </TouchableOpacity>


            </View>
        )
    }

    function isFirstTime(isStart) {
        if (isStart) {
            const fil = timmings.filter(time => time.startTime.length > 0)
            return fil.length == 0
        }
        else {
            const fil = timmings.filter(time => time.endTime.length > 0)
            return fil.length == 0
        }

    }

    function checkTime(val, date, content) {
        const isFirst = isFirstTime(content.start)
        let copy = timmings
        if (content.start) {
            if (isFirst) {
                copy = []
                timmings.map(time => {
                    const newDay = {
                        ...time,
                        startTime: val,
                        startCurrent: date,
                    }
                    copy.push(newDay)
                })

            }
            else {

                copy[content.i].startTime = val
                copy[content.i].startCurrent = date
            }

        }
        else {
            if (isFirst) {
                copy = []
                timmings.map(time => {
                    const newDay = {
                        ...time,
                        endTime: val,
                        endCurrent: date,
                    }
                    copy.push(newDay)
                })

            }
            else {
                copy[content.i].endTime = val
                copy[content.i].endCurrent = date
            }
        }
        setTimmings(copy)
        setChange(!change)
    }
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
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>

                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: myWidth(4) }}>
                        <Spacer paddingT={myHeight(1.5)} />
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


                        <Spacer paddingT={myHeight(2.7)} />
                        {/* Description */}
                        <View>
                            <Text style={[styles.textCommon,
                            {
                                fontFamily: myFonts.heading,
                                fontSize: myFontSize.xBody2,

                            }]}>Description *</Text>
                            <Spacer paddingT={myHeight(1)} />
                            <TextInput placeholder="About Your Restaurant"
                                multiline={true}
                                autoCorrect={false}
                                maxLength={100}
                                numberOfLines={2}
                                placeholderTextColor={myColors.offColor}
                                selectionColor={myColors.primary}
                                cursorColor={myColors.primaryT}
                                value={Description} onChangeText={SetDescription}
                                style={{
                                    height: myFontSize.body * 2 + myHeight(4.5),
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

                        {/* Delivery Charges & Time */}
                        <Collapsible collapsed={!Delivery}>
                            <Spacer paddingT={myHeight(2.7)} />

                            {/* Delivery Charges */}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[styles.textCommon,
                                {
                                    flex: 1,
                                    fontFamily: myFonts.heading,
                                    fontSize: myFontSize.xBody2,

                                }]}>Delivery Charges *</Text>


                                <View style={{
                                    flexDirection: 'row',
                                    borderRadius: myWidth(2),
                                    width: myFontSize.body2 + myWidth(22),
                                    paddingVertical: myHeight(0.2),
                                    paddingHorizontal: myWidth(3),
                                    color: myColors.text,
                                    backgroundColor: myColors.offColor7,
                                    borderWidth: 0.7,
                                    borderColor: myColors.primaryT
                                }}>

                                    <TextInput placeholder=""
                                        autoCorrect={false}
                                        placeholderTextColor={myColors.text}
                                        selectionColor={myColors.primary}
                                        cursorColor={myColors.primaryT}
                                        editable={false}
                                        style={{
                                            width: 0,
                                            padding: 0,
                                            textAlignVertical: 'center',

                                            backgroundColor: myColors.offColor7,

                                            // textAlign: 'center'
                                        }}
                                    />
                                    <TextInput placeholder="Ex 50"
                                        autoCorrect={false}
                                        placeholderTextColor={myColors.offColor}
                                        selectionColor={myColors.primary}
                                        cursorColor={myColors.primaryT}
                                        value={DeliveryFee} onChangeText={SetDeliveryFee}
                                        keyboardType='numeric'
                                        style={{
                                            flex: 1,
                                            padding: 0,
                                            backgroundColor: myColors.offColor7,

                                            // textAlign: 'center'
                                        }}
                                    />

                                    <TextInput placeholder=" Rs"
                                        autoCorrect={false}
                                        placeholderTextColor={myColors.text}
                                        selectionColor={myColors.primary}
                                        cursorColor={myColors.primaryT}
                                        editable={false}
                                        style={{

                                            padding: 0,
                                            textAlignVertical: 'center',

                                            backgroundColor: myColors.offColor7,

                                            // textAlign: 'center'
                                        }}
                                    />

                                    {/* <Text style={[styles.textCommon,
                                    {
                                        flex: 1,
                                        fontFamily: myFonts.bodyBold,
                                        fontSize: myFontSize.body2,

                                    }]}>Min</Text> */}
                                </View>
                                {/* <TextInput placeholder=""
                                    autoCorrect={false}
                                    placeholderTextColor={myColors.offColor}
                                    selectionColor={myColors.primary}
                                    cursorColor={myColors.primaryT}
                                    value={DeliveryFee} onChangeText={setDelivery}
                                    keyboardType='numeric'
                                    style={{
                                        borderRadius: myWidth(2),
                                        width: myFontSize.body2 + myWidth(22),
                                        fontSize: myFontSize.body2,
                                        includeFontPadding: false,
                                        fontFamily: myFonts.bodyBold,
                                        paddingVertical: myHeight(0.2),
                                        paddingHorizontal: myWidth(3),
                                        color: myColors.text,
                                        backgroundColor: myColors.offColor7,
                                        borderWidth: 0.7,
                                        borderColor: myColors.primaryT
                                        // textAlign: 'center'
                                    }}
                                /> */}
                            </View>

                            <Spacer paddingT={myHeight(2.7)} />

                            {/* Delivery  Time */}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[styles.textCommon,
                                {
                                    flex: 1,
                                    fontFamily: myFonts.heading,
                                    fontSize: myFontSize.xBody2,

                                }]}>Delivery Time *</Text>


                                <View style={{
                                    flexDirection: 'row',
                                    borderRadius: myWidth(2),
                                    width: myFontSize.body2 + myWidth(22),
                                    paddingVertical: myHeight(0.2),
                                    paddingHorizontal: myWidth(3),
                                    color: myColors.text,
                                    backgroundColor: myColors.offColor7,
                                    borderWidth: 0.7,
                                    borderColor: myColors.primaryT
                                }}>

                                    <TextInput placeholder=""
                                        autoCorrect={false}
                                        placeholderTextColor={myColors.text}
                                        selectionColor={myColors.primary}
                                        cursorColor={myColors.primaryT}
                                        editable={false}
                                        style={{
                                            width: 0,
                                            padding: 0,
                                            textAlignVertical: 'center',

                                            backgroundColor: myColors.offColor7,

                                            // textAlign: 'center'
                                        }}
                                    />
                                    <TextInput placeholder="Ex 50"
                                        autoCorrect={false}
                                        placeholderTextColor={myColors.offColor}
                                        selectionColor={myColors.primary}
                                        cursorColor={myColors.primaryT}
                                        value={DeliveryTime} onChangeText={SetDeliveryTime}
                                        keyboardType='numeric'
                                        style={{
                                            flex: 1,
                                            padding: 0,
                                            backgroundColor: myColors.offColor7,

                                            // textAlign: 'center'
                                        }}
                                    />

                                    <TextInput placeholder=" Min"
                                        autoCorrect={false}
                                        placeholderTextColor={myColors.text}
                                        selectionColor={myColors.primary}
                                        cursorColor={myColors.primaryT}
                                        editable={false}
                                        style={{

                                            padding: 0,
                                            textAlignVertical: 'center',

                                            backgroundColor: myColors.offColor7,

                                            // textAlign: 'center'
                                        }}
                                    />

                                    {/* <Text style={[styles.textCommon,
                                    {
                                        flex: 1,
                                        fontFamily: myFonts.bodyBold,
                                        fontSize: myFontSize.body2,

                                    }]}>Min</Text> */}
                                </View>





                            </View>



                        </Collapsible>


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

                            }]}>Map Link</Text>
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


                        <Spacer paddingT={myHeight(2.5)} />
                        {/* Timmings */}
                        <View>
                            <Text style={[styles.textCommon,
                            {
                                fontFamily: myFonts.heading,
                                fontSize: myFontSize.xBody2,

                            }]}>Timmings *</Text>
                            <Spacer paddingT={myHeight(1)} />
                            {
                                timmings.map((item, i) =>
                                    <TimingsCom item={item} i={i} />
                                )
                            }
                        </View>


                        <Spacer paddingT={myHeight(2.5)} />
                        {/* Offer Tag */}
                        <View>
                            <Text style={[styles.textCommon,
                            {
                                fontFamily: myFonts.heading,
                                fontSize: myFontSize.xBody2,

                            }]}>Offer Tag</Text>
                            <Spacer paddingT={myHeight(1)} />
                            <View style={{
                                borderRadius: myWidth(1.5),
                                width: '100%',
                                paddingVertical: myHeight(0.2),
                                paddingHorizontal: myWidth(3),
                                color: myColors.text,
                                backgroundColor: myColors.offColor7,
                                // borderWidth: 0.7,
                                // borderColor: myColors.primaryT
                            }}>

                                <TextInput placeholder="Ex 30% OFF On Family Pack"
                                    autoCorrect={false}
                                    maxLength={30}
                                    placeholderTextColor={myColors.offColor}
                                    selectionColor={myColors.primary}
                                    cursorColor={myColors.primaryT}
                                    value={DeliveryFee} onChangeText={SetDeliveryFee}
                                    keyboardType='numeric'
                                    style={{
                                        flex: 1,
                                        padding: 0,
                                        backgroundColor: myColors.offColor7,

                                        // textAlign: 'center'
                                    }}
                                />

                            </View>
                        </View>


                        <Spacer paddingT={myHeight(2.5)} />

                        {/* Menu Images */}
                        <View>
                            <Text style={[styles.textCommon,
                            {
                                fontFamily: myFonts.heading,
                                fontSize: myFontSize.xBody2,

                            }]}>Menu Images</Text>
                            <Spacer paddingT={myHeight(1)} />


                            <View style={{ flexDirection: 'row', }}>

                                {
                                    MenuImages.map((image, index) =>


                                        <TouchableOpacity activeOpacity={0.75} onPress={() => {
                                            chooseFileMenu(index)

                                        }}
                                            style={{
                                                height: myHeight(18), width: myWidth(28), justifyContent: 'center', alignItems: 'center',
                                                borderRadius: myWidth(4), backgroundColor: myColors.offColor7, marginEnd: myWidth(4)
                                            }}>

                                            <ImageUri width={'100%'} height={'100%'} resizeMode='cover' uri={image} />




                                        </TouchableOpacity>
                                    )
                                }
                                {
                                    MenuImages.length < 3 &&
                                    <TouchableOpacity activeOpacity={0.75} onPress={() => {
                                        chooseFileMenu(null)

                                    }}
                                        style={{
                                            height: myHeight(18), width: myWidth(28), justifyContent: 'center', alignItems: 'center',
                                            borderRadius: myWidth(4), backgroundColor: myColors.offColor7,
                                        }}>

                                        {/* <ImageUri width={'100%'} height={'100%'} resizeMode='cover' uri={image} /> */}


                                        <View style={{ justifyContent: 'center', alignItems: 'center', }}>

                                            <Text style={[styles.textCommon,
                                            {
                                                fontFamily: myFonts.bodyBold,
                                                fontSize: myFontSize.body,
                                                textAlign: 'center'


                                            }]}>
                                                Upload
                                            </Text>

                                        </View>


                                    </TouchableOpacity>
                                }


                            </View>
                        </View>

                        <Spacer paddingT={myHeight(3)} />

                    </ScrollView>
                </KeyboardAwareScrollView>
                {showChangeModal &&

                    <ChangeImageView onChange={onChangeImage} onView={onViewImage} onHide={setShowChangeModal} />
                }
                {
                    showTimeModal &&
                    <CalenderDate show={setShowTimeModal} content={showTimeModal} value={checkTime} />
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
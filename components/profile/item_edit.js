import React, { useEffect, useRef, useState } from 'react';
import {
    ScrollView, StyleSheet, TouchableOpacity, Image,
    View, Text, StatusBar, TextInput, Alert,
    Linking, Platform, ImageBackground, SafeAreaView, FlatList,
} from 'react-native';
import { Loader, MyError, Spacer, StatusbarH, errorTime, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';
import { useDispatch, useSelector } from 'react-redux';
import { deccodeInfo, encodeInfo } from '../functions/functions';
import firestore from '@react-native-firebase/firestore';
import { setProfile } from '../../redux/profile_reducer';
import { SelectCity } from '../account1/select_city';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { ImageUri } from '../common/image_uri';
import uuid from 'react-native-uuid';


export const ItemEdit = ({ navigation, route }) => {
    const { profile } = useSelector(state => state.profile)
    const { item } = route.params
    const pass = (deccodeInfo(profile.password))
    const [isLoading, setIsLoading] = useState(false)

    const [name, setName] = useState(profile.name)
    const [password, setPass] = useState(pass)
    const [hidePass, setHidePass] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const [city, setCity] = useState(profile.city)
    const [showCityModal, setShowCityModal] = useState(false)
    const [image, setImage] = useState(item.image ? item.image : null);
    const [imageLoading, setImageLoading] = useState(null)
    const id = item.id ? item.id : uuid.v4()


    const disptach = useDispatch()
    useEffect(() => {
        if (errorMsg) {
            setTimeout(() => {
                setIsLoading(false)
                setErrorMsg(null)
            }
                , errorTime)
        }
    }, [errorMsg])

    function verifyName() {
        if (name) {
            if (name.length > 2) {
                return true
            }
            setErrorMsg('Name is too Short')
            return false
        }
        setErrorMsg('Please Enter a Name')
        return false
    }
    function verifyPass() {
        if (password) {
            if (password.length > 5) {
                return true
            }
            setErrorMsg('Password must be at least 6 character')
            return false
        }
        setErrorMsg('Please Enter a Password')
        return false
    }

    function checking() {
        if (isEditMode) {

            if (profile.name == name && pass == password && city == profile.city && profile.icon == image) {
                setIsEditMode(false)
                return false

            }
            if (profile.name != name) {
                if (!verifyName()) {
                    return false
                }

            }
            if (password != pass) {
                if (!verifyPass()) {
                    return false
                }
            }

            return true
        }

        else {
            setIsEditMode(true)
            return false
        }
    }

    function goToDone() {

        setIsEditMode(false)
        setIsLoading(false)
        Alert.alert('Updated Successfully')


    }
    function onSave() {
        if (checking()) {
            setIsLoading(true)
            firestore().collection('restaurants').doc(profile.uid)
                .update({
                    name: name,
                    password: encodeInfo(password),
                    city: city,
                    icon: image,

                })
                .then((data) => {
                    goToDone()
                }).catch(err => {
                    setErrorMsg('Something wrong')
                    console.log('Internal error while Updating profile', err)
                });
        }

    }

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
                const source = asset.uri
                if (sizeKB <= 0.3) {
                    setImageLoading(true)
                    uploadImage(source, id)

                }
                else {
                    setErrorMsg(`Maximum Icon Size is 300 KB`)
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


    const uploadImage = async (uri, name, i) => {
        const path = `images/restaurants/${profile.uid}/${name}`
        storage()
            .ref(path)
            .putFile(uri)
            .then((s) => {
                storage().ref(path).getDownloadURL().then((uri) => {


                    setImage(uri)
                    setImageLoading(null)
                    console.log('uri recieved icon')

                }).catch((e) => {
                    setImageLoading(null)
                    setErrorMsg('Something Wrong')

                    console.log('er', e)

                })

            }).catch((e) => {
                setImageLoading(null)
                setErrorMsg('Something Wrong')

                console.log('er', e)

            })

        // try {
        //     await task;
        // } catch (e) {
        //     console.error(e);
        // }

    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: myColors.background }}>
            <StatusbarH />
            {/* Top */}
            <View>
                <Spacer paddingT={myHeight(2)} />
                <View style={{ paddingEnd: myWidth(4), flexDirection: 'row', alignItems: 'center' }}>

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
                    }]}>Item Info </Text>
                </View>

                <Spacer paddingT={myHeight(1.5)} />
                <View style={{ height: myHeight(0.5), width: myWidth(100), backgroundColor: myColors.divider }} />

                {/* <View style={{ height: myHeight(0.6), backgroundColor: myColors.divider }} /> */}
            </View>

            <Spacer paddingT={myHeight(1.5)} />

            <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, paddingHorizontal: myWidth(4) }}>

                <Spacer paddingT={myHeight(1.5)} />
                {/* Background Image */}
                <TouchableOpacity disabled={imageLoading || !isEditMode}
                    activeOpacity={0.75} onPress={() => {
                        chooseFile()

                    }}
                    style={{
                        alignSelf: 'center',
                        height: myHeight(20), width: '100%', justifyContent: 'center', alignItems: 'center',
                        borderRadius: myWidth(2), backgroundColor: myColors.offColor7, overflow: 'hidden'
                    }}>
                    {
                        imageLoading ?
                            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: myColors.offColor7 }} >
                                <Text style={[styles.textCommon,
                                {
                                    fontFamily: myFonts.body,
                                    fontSize: myFontSize.body,
                                    textAlign: 'center',


                                }]}>Loading...</Text>
                            </View>

                            :

                            image ?
                                <ImageUri width={'100%'} height={'100%'} resizeMode='cover' uri={image} />
                                :
                                <View>

                                    <Text style={[styles.textCommon,
                                    {
                                        fontFamily: myFonts.body,
                                        fontSize: myFontSize.body4,
                                        textAlign: 'center',


                                    }]}>
                                        Upload Image
                                    </Text>
                                    <Text style={[styles.textCommon,
                                    {
                                        fontFamily: myFonts.body,
                                        fontSize: myFontSize.body,
                                        textAlign: 'center'

                                    }]}>
                                        (maximum size 300 KB)
                                    </Text>
                                </View>
                    }

                </TouchableOpacity>


                <Spacer paddingT={myHeight(2.5)} />


            </KeyboardAwareScrollView>


            <TouchableOpacity onPress={onSave}
                activeOpacity={0.8}
                style={{
                    width: myWidth(92), alignSelf: 'center', paddingVertical: myHeight(1.3),
                    borderRadius: myHeight(1.4), alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'row', backgroundColor: myColors.primaryT,
                    // borderWidth: myHeight(0.15), borderColor: myColors.primaryT
                }}>
                <Text style={[styles.textCommon, {
                    fontFamily: myFonts.heading,
                    fontSize: myFontSize.body3,
                    color: myColors.background
                }]}>{isEditMode ? 'Save tem' : 'Edit Item'}</Text>
            </TouchableOpacity>
            <Spacer paddingT={myHeight(5)} />

            {isLoading && <Loader />}
            {errorMsg && <MyError message={errorMsg} />}
            {showCityModal &&
                <SelectCity showCityModal={setShowCityModal} setCity={setCity} city={city} />
            }

        </SafeAreaView>
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
    heading: {
        paddingVertical: myHeight(0.8),
        fontFamily: myFonts.heading,
        fontSize: myFontSize.body,
    },
    containerInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: myWidth(2.5),
        paddingHorizontal: myWidth(2),
        borderWidth: myHeight(0.14),
        backgroundColor: myColors.background,
    },

    input: {
        flex: 1,
        textAlignVertical: 'center',
        paddingVertical: ios ? myHeight(1) : myHeight(100) > 600 ? myHeight(0.8) : myHeight(0.2),
        fontSize: myFontSize.body,
        color: myColors.text,
        includeFontPadding: false,
        fontFamily: myFonts.bodyBold,
    },


    textForgetP: {
        fontFamily: myFonts.heading, fontSize: myFontSize.body, color: myColors.primary,
        paddingVertical: myHeight(0.8)
    },


    imageEye: {
        height: myHeight(2.8),
        width: myHeight(2.8),
        paddingHorizontal: myWidth(4),
        resizeMode: 'contain',
        tintColor: myColors.textL4

    }
})
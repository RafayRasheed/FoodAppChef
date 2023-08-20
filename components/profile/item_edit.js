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
import Collapsible from 'react-native-collapsible';
const dummy = [
    {
        required: true,
        name: 'Side Item',
        list: ['Med Fries [350.0 Cals]', 'Med Fries [30.0 Cals]', 'Med Fries [50.0 Cals]', 'Med Fries [300.0 Cals]']
    },
    {
        required: false,
        name: 'Drink',
        list: ['Soft Drinks', 'Coffee or Tea']
    },
    {
        required: false,
        name: 'Ice',
        list: ['Soft Drinks', 'Coffee or Tea']
    },
]
export const ItemEdit = ({ navigation, route }) => {
    const { profile } = useSelector(state => state.profile)
    const { foodCategory } = profile
    const { item } = route.params
    const [isLoading, setIsLoading] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const [image, setImage] = useState(item.image ? item.image : null);
    const [imageLoading, setImageLoading] = useState(null)
    const [name, setName] = useState(item.name ? item.name : null)
    const [price, setPrice] = useState(item.price ? item.price.toString() : null)
    const [newCat, setNewCat] = useState(null)
    const [selectCat, setSelectCat] = useState(item.catName ? item.catName : null)
    const [selectSubCat, setSelectSubCat] = useState(item.subCatName ? item.subCatName : null)
    // const [resCategories, setResCategories] = useState(profile.categories ? profile.categories : [])
    const resCategories = profile.categories ? profile.categories : []
    const [subCategories, setSubCategories] = useState(profile.subCategories ? profile.subCategories : [])
    const [addCategory, setAddCategory] = useState(false)
    const [addOption, setAddOption] = useState(false)
    const id = item.id ? item.id : uuid.v4()
    const [change, setChange] = useState(null)

    const { mainCategories } = useSelector(state => state.mainCategories)

    const [categories, setCategories] = useState(mainCategories)

    const [Description, SetDescription] = useState(item.description)

    const [options, setOptios] = useState(item.options ? [...item.options] : [])
    const [optionSelect, setOptionSelect] = useState({

        required: false,
        name: '',
        list: ['', '']
    })



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



    function checkDescription() {
        if (Description) {
            if (Description.length < 20) {
                setErrorMsg('Enter Description Minimum 20 Characters')
                return false
            }
            return true
        }
        return true
    }
    function checkPrice() {
        if (price) {
            if (!isNaN(price)) {
                return true
            }
            setErrorMsg('Invali Price')
            return false
        }
        setErrorMsg('Please Enter a Price')
        return false
    }
    function checkOptions() {
        if (profile.homeDelivery && options.length) {
            let isOK = true
            options.map((option, i) => {
                if (isOK) {
                    if (option.name.length < 1) {
                        setErrorMsg('Please Enter All Options Name')
                        isOK = false
                    }
                    if (isOK) {
                        let isName = true
                        option.list.map(item => {
                            if (item.length < 1) {
                                isName = false
                            }
                        })
                        if (!isName) {
                            setErrorMsg('Please Enter All Options Item Names')
                            isOK = false
                        }
                    }
                }

            })
            return isOK
        }
        return true
    }

    function checkData() {

        if (!image) {
            setErrorMsg('Please Upload Item Image')
            return false
        }
        if (!name) {
            setErrorMsg('Please Enter a Name')
            return false
        }
        if (!checkPrice()) {
            return false
        }
        if (!selectCat) {
            setErrorMsg('Please Select Category')
            return false
        }
        if (!selectSubCat) {
            setErrorMsg('Please Select Sub Category')
            return false
        }
        if (!checkDescription()) {
            return false
        }
        if (!checkOptions()) {
            return false
        }

        return true
    }

    function goToDone(newP) {

        setIsLoading(false)
        disptach(setProfile(newP))
        const msg = item.id ? 'Updated Successfully' : 'Add Successfully'
        Alert.alert(msg)


    }
    function onSave() {
        if (checkData()) {

            setIsLoading(true)
            let newFoodCat = [...foodCategory]
            let isNewItem = item.id ? false : true
            let newSubCategories = subCategories

            const NewItem = {
                resId: profile.uid,
                resName: profile.name,
                price: parseFloat(price),
                description: Description ? Description : null,
                id: id,
                name: name,
                image: image,
                rating: item.rating ? item.rating : 0,
                noOfRatings: item.noOfRatings ? item.noOfRatings : 0,
                options: options ? options : [],
                subCatName: selectSubCat,
                catName: selectCat
            }
            const isCatExists = newFoodCat.findIndex(it => (it.name == selectSubCat))

            if (isCatExists != -1) {
                let existCat = newFoodCat[isCatExists]
                let existItems = [...existCat.items]
                const indexItem = existItems.findIndex(it => (it.id == id))

                if (isNewItem || indexItem == -1) {
                    existItems.push(NewItem)
                    newFoodCat[isCatExists] = {
                        ...existCat,
                        items: existItems
                    }

                }
                else {
                    existItems[indexItem] = NewItem
                    newFoodCat[isCatExists] = {
                        ...existCat,
                        items: existItems
                    }

                }

            } else {
                newFoodCat.push(

                    {
                        name: selectSubCat,

                        items: [NewItem]
                    }
                )
            }

            // Remove item from previous category if sub category change
            if (!isNewItem && selectSubCat != item.subCatName) {

                let removeIndex = null
                let removeItems = null
                const removeArray = []
                newFoodCat.map((it, i) => {

                    if (it.name == item.subCatName) {
                        removeIndex = i
                        removeItems = it
                    }
                    else {

                        removeArray.push(it)
                    }
                }
                )
                const afterRem = removeItems.items.filter(it => it.id != id)
                if (!afterRem.length) {
                    newSubCategories = newSubCategories.filter(it => it != item.subCatName)
                    newFoodCat = removeArray
                } else {

                    newFoodCat[removeIndex] = {
                        ...removeItems,
                        items: afterRem,
                    }
                }

            }


            let copyResCategories = [...resCategories]
            const check = copyResCategories.filter(it => it == selectCat)

            if (!check.length) {

                copyResCategories.push(selectCat)
            }

            const newProfile = {
                ...profile,
                categories: copyResCategories,
                subCategories: newSubCategories,
                foodCategory: newFoodCat,
            }



            firestore().collection('restaurants').doc(profile.uid)
                .update(newProfile)
                .then((data) => {
                    goToDone(newProfile)
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

    function onAddNewCat() {
        if (newCat) {
            let copy = [...subCategories]

            const check = copy.filter(item => item == newCat)

            if (check.length) {
                setErrorMsg('Category Already Exists')
                setAddCategory(false)

                return
            }
            copy.push(newCat)
            setSubCategories(copy)
            setAddCategory(false)
            return
        }
        setErrorMsg('Plaese Enter Category Name')
    }

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


            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1, paddingHorizontal: myWidth(4) }} showsVerticalScrollIndicator={false}>
                <Spacer paddingT={myHeight(1.5)} />

                {/* Background Image */}
                <TouchableOpacity disabled={imageLoading}
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
                {/*name */}
                <View>
                    <Text style={[styles.textCommon,
                    {
                        fontFamily: myFonts.heading,
                        fontSize: myFontSize.xBody2,

                    }]}>Name *</Text>
                    <Spacer paddingT={myHeight(1)} />
                    <View style={{
                        borderRadius: myWidth(1.5),
                        width: '100%',
                        paddingHorizontal: myWidth(2),
                        paddingVertical: myHeight(0.5),
                        paddingEnd: myWidth(3),
                        color: myColors.text,
                        backgroundColor: myColors.offColor7,
                        // borderWidth: 0.7,
                        // borderColor: myColors.primaryT
                    }}>

                        <TextInput placeholder="Item Name"
                            autoCorrect={false}
                            maxLength={50}
                            placeholderTextColor={myColors.offColor}
                            selectionColor={myColors.primary}
                            cursorColor={myColors.primaryT}
                            value={name} onChangeText={setName}
                            style={{
                                // flex: 1,
                                padding: 0,
                                backgroundColor: myColors.offColor7,

                                // textAlign: 'center'
                            }}
                        />

                    </View>
                </View>
                <Spacer paddingT={myHeight(2.7)} />

                {/*  Price */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.textCommon,
                    {
                        flex: 1,
                        fontFamily: myFonts.heading,
                        fontSize: myFontSize.xBody2,

                    }]}>Price *</Text>


                    <View style={{
                        flexDirection: 'row',
                        borderRadius: myWidth(2),
                        width: myFontSize.body2 + myWidth(30),
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
                            maxLength={8}

                            placeholderTextColor={myColors.offColor}
                            selectionColor={myColors.primary}
                            cursorColor={myColors.primaryT}
                            value={price} onChangeText={setPrice}
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


                    </View>

                </View>

                <Spacer paddingT={myHeight(2.5)} />
                {/* Categoty */}
                <View style={{ marginStart: -myWidth(4), width: myWidth(100) }}>
                    <Text style={[styles.textCommon,
                    {
                        fontFamily: myFonts.heading,
                        fontSize: myFontSize.xBody2,
                        paddingStart: myWidth(4),

                    }]}>Select Category *</Text>
                    <Spacer paddingT={myHeight(1)} />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingStart: myWidth(4) }}>

                        {categories?.map((item, i) =>

                            <View key={i} style={{ paddingBottom: myHeight(1), paddingEnd: myWidth(5) }}>
                                <TouchableOpacity activeOpacity={0.8} style={{
                                    flexDirection: 'row', alignItems: 'center', borderRadius: myHeight(15),
                                    backgroundColor: item.name == selectCat ? myColors.primaryL2 : myColors.background,
                                    // backgroundColor: myColors.primaryL2,
                                    padding: myHeight(0.8), elevation: 8
                                }} onPress={() => setSelectCat(item.name)}>
                                    <View style={{
                                        height: myHeight(4.5), width: myHeight(5), borderRadius: myHeight(5),
                                        backgroundColor: '#00000008',
                                        // backgroundColor:myColors.background, 
                                        alignItems: 'center', justifyContent: 'center'
                                    }}>

                                        <ImageUri height={myHeight(4.2)} width={myHeight(4.2)} resizeMode='contain' uri={item.image} />

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
                </View>


                <Spacer paddingT={myHeight(2.5)} />
                {/*Sub Categoty */}
                <View style={{ marginStart: -myWidth(4), width: myWidth(100) }}>

                    <View style={{
                        paddingHorizontal: myWidth(4), alignItems: 'center', flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={[styles.textCommon, {

                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2,

                        }]}>Select Sub Category *</Text>

                        {/* See all */}
                        <TouchableOpacity style={{
                            flexDirection: 'row', alignItems: 'center', paddingVertical: myHeight(0.4),
                            paddingStart: myWidth(2)
                        }} activeOpacity={0.6} onPress={() => setAddCategory(!addCategory)}>

                            <Text
                                style={[styles.textCommon, {
                                    fontFamily: myFonts.heading,
                                    fontSize: myFontSize.xBody,

                                    color: myColors.primaryT
                                }]}>Add</Text>

                            <Spacer paddingEnd={myWidth(1)} />

                            <Image style={{
                                height: myHeight(2), width: myHeight(2), marginStart: myWidth(1),
                                resizeMode: 'contain', tintColor: myColors.primaryT, transform: [{ rotate: addCategory ? '-90deg' : '90deg' }]
                            }} source={require('../assets/home_main/home/go.png')} />

                        </TouchableOpacity>
                    </View>

                    <Collapsible collapsed={!addCategory}>
                        <Spacer paddingT={myHeight(1.5)} />

                        <View style={{ paddingHorizontal: myWidth(4), flexDirection: 'row', alignItems: 'center' }}>

                            <View style={{
                                borderRadius: myWidth(1.5),

                                paddingHorizontal: myWidth(2),
                                // paddingVertical: myHeight(0.5),
                                paddingEnd: myWidth(3),
                                color: myColors.text,
                                flex: 1,

                                backgroundColor: myColors.offColor7,
                                // borderWidth: 0.7,
                                // borderColor: myColors.primaryT
                            }}>

                                <TextInput placeholder="Item Name"
                                    autoCorrect={false}
                                    maxLength={20}
                                    placeholderTextColor={myColors.offColor}
                                    selectionColor={myColors.primary}
                                    cursorColor={myColors.primaryT}
                                    value={newCat} onChangeText={setNewCat}
                                    style={{
                                        flex: 1,
                                        padding: 0,
                                        backgroundColor: myColors.offColor7,

                                        // textAlign: 'center'
                                    }}
                                />

                            </View>
                            <Spacer paddingEnd={myWidth(4)} />
                            <TouchableOpacity activeOpacity={0.7} onPress={onAddNewCat} style={{
                                paddingVertical: myHeight(0.9), marginVertical: myHeight(0.2),
                                paddingHorizontal: myWidth(5),
                                backgroundColor: myColors.primaryT, borderRadius: 5
                            }}>
                                <Text style={[styles.textCommon,
                                {
                                    fontFamily: myFonts.body,
                                    fontSize: myFontSize.body3,
                                    color: myColors.background

                                }]}>Add</Text>

                            </TouchableOpacity>
                        </View>
                        <Spacer paddingT={myHeight(1)} />

                    </Collapsible>
                    <View>

                        <Spacer paddingT={myHeight(1)} />
                        {
                            subCategories?.length ?
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ paddingStart: myWidth(4) }}>

                                    {subCategories?.map((item, i) =>

                                        <View key={i} style={{ paddingBottom: myHeight(1), paddingEnd: myWidth(5) }}>
                                            <TouchableOpacity activeOpacity={0.8} style={{
                                                flexDirection: 'row', alignItems: 'center', borderRadius: myHeight(15),
                                                backgroundColor: item == selectSubCat ? myColors.primaryL2 : myColors.background,
                                                // backgroundColor: myColors.primaryL2,
                                                padding: myHeight(1.2), elevation: 8,
                                                paddingHorizontal: myWidth(4)
                                            }} onPress={() => setSelectSubCat(item)}>

                                                <Text
                                                    style={[styles.textCommon, {
                                                        fontSize: myFontSize.body2,
                                                        fontFamily: myFonts.heading,
                                                    }]}>{item}</Text>

                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </ScrollView>
                                :
                                <Text
                                    style={[styles.textCommon, {
                                        fontFamily: myFonts.heading,
                                        fontSize: myFontSize.body2,

                                        color: myColors.red,
                                        paddingStart: myWidth(4)
                                    }]}>No Sub Category Found Click On Add</Text>
                        }
                    </View>


                </View>
                <Spacer paddingT={myHeight(2.5)} />

                {/* Description */}
                <View>
                    <Text style={[styles.textCommon,
                    {
                        fontFamily: myFonts.heading,
                        fontSize: myFontSize.xBody2,

                    }]}>Description</Text>
                    <Spacer paddingT={myHeight(1)} />
                    <TextInput placeholder="About Your Item"
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

                {/* Options */}
                {
                    profile.homeDelivery ?
                        <View>

                            <View style={{
                                alignItems: 'center', flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <Text style={[styles.textCommon, {

                                    fontFamily: myFonts.heading,
                                    fontSize: myFontSize.xBody2,

                                }]}>Options</Text>

                                {/* See all */}
                                <TouchableOpacity style={{
                                    flexDirection: 'row', alignItems: 'center', paddingVertical: myHeight(0.4),
                                    paddingStart: myWidth(2)
                                }} activeOpacity={0.6} onPress={() => setAddOption(!addOption)}>

                                    <Text
                                        style={[styles.textCommon, {
                                            fontFamily: myFonts.heading,
                                            fontSize: myFontSize.xBody,

                                            color: myColors.primaryT
                                        }]}>Add</Text>

                                    <Spacer paddingEnd={myWidth(1)} />

                                    <Image style={{
                                        height: myHeight(2), width: myHeight(2), marginStart: myWidth(1),
                                        resizeMode: 'contain', tintColor: myColors.primaryT, transform: [{ rotate: addOption ? '-90deg' : '90deg' }]
                                    }} source={require('../assets/home_main/home/go.png')} />

                                </TouchableOpacity>
                            </View>

                            <Collapsible collapsed={!addOption}>
                                <Spacer paddingT={myHeight(1.5)} />


                                <View style={{
                                    height: myHeight(0.5), backgroundColor: myColors.primaryL2
                                }} />
                                <Spacer paddingT={myHeight(2)} />
                                {/* Name & Required */}
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <View style={{
                                        borderRadius: myWidth(1.5),

                                        paddingHorizontal: myWidth(2),
                                        paddingVertical: myHeight(0.3),
                                        paddingEnd: myWidth(3),
                                        color: myColors.text,
                                        flex: 1,

                                        backgroundColor: myColors.offColor7,
                                        // borderWidth: 0.7,
                                        // borderColor: myColors.primaryT
                                    }}>

                                        <TextInput placeholder="New Option Name"
                                            autoCorrect={false}
                                            maxLength={30}
                                            placeholderTextColor={myColors.offColor}
                                            selectionColor={myColors.primary}
                                            value={optionSelect.name}
                                            onChangeText={(val) => {

                                                const copy = {
                                                    ...optionSelect,
                                                    name: val
                                                }

                                                // console.log(copy)

                                                setOptionSelect(copy)
                                                setChange(!change)

                                            }}
                                            cursorColor={myColors.primaryT}

                                            // value={newCat} onChangeText={setNewCat}
                                            style={{
                                                flex: 1,
                                                padding: 0,
                                                backgroundColor: myColors.offColor7,
                                                fontSize: myFontSize.xBody,
                                                fontFamily: myFonts.bodyBold,

                                                // textAlign: 'center'
                                            }}
                                        />

                                    </View>
                                    <Spacer paddingEnd={myWidth(4)} />


                                    <TouchableOpacity
                                        activeOpacity={0.85}
                                        onPress={() => {
                                            const option = optionSelect
                                            if (option.name.length < 1) {
                                                setErrorMsg('Please Enter Option Name')
                                                return false
                                            }
                                            let isName = true
                                            option.list.map(item => {
                                                if (item.length < 1) {
                                                    isName = false
                                                }
                                            })
                                            if (!isName) {
                                                setErrorMsg('Please Enter All Option Item Name')
                                                return false
                                            }

                                            setAddOption(false)
                                            setOptionSelect({

                                                required: false,
                                                name: '',
                                                list: ['', '']
                                            })
                                            options.push(option)
                                            options.reverse()
                                            setOptios(options)



                                        }}
                                        style={{
                                            paddingHorizontal: myWidth(4),
                                            paddingVertical: myHeight(0.6),
                                            backgroundColor: myColors.primaryT,
                                            borderRadius: myWidth(1)
                                        }}>
                                        <Text style={[styles.textCommon, {
                                            fontSize: myFontSize.body2,
                                            fontFamily: myFonts.body,
                                            color: myColors.background,
                                        }]}>Add</Text>
                                    </TouchableOpacity>

                                </View>
                                <Spacer paddingT={myHeight(1.5)} />
                                <TouchableOpacity activeOpacity={0.85}
                                    onPress={() => {
                                        const copy = {
                                            ...optionSelect,
                                            required: optionSelect.required ? false : true
                                        }

                                        setOptionSelect(copy)
                                        setChange(!change)
                                    }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingStart: myWidth(1) }}>
                                        <View style={{
                                            height: myHeight(3.2),
                                            width: myHeight(3.2),
                                            paddingTop: myHeight(0.6)
                                        }}>
                                            <View style={{ width: myHeight(2.2), height: myHeight(2.2), borderWidth: 1.5, borderColor: myColors.textL4 }} />
                                            {
                                                optionSelect.required &&
                                                <Image style={{
                                                    height: myHeight(3.2),
                                                    width: myHeight(3.2),
                                                    resizeMode: 'contain',
                                                    tintColor: myColors.primaryT,
                                                    marginTop: -myHeight(3)
                                                }} source={require('../assets/profile/check2.png')} />
                                            }
                                        </View>
                                        <Spacer paddingEnd={myWidth(1)} />
                                        <Text style={[styles.textCommon,
                                        {
                                            fontFamily: myFonts.bodyBold,
                                            fontSize: myFontSize.xBody,

                                        }]}>Require <Text
                                            style={{
                                                fontFamily: myFonts.body,
                                                fontSize: myFontSize.body2,

                                            }}>{"(User Must Select Before Place Order)"}</Text></Text>
                                    </View>
                                </TouchableOpacity>

                                <Spacer paddingT={myHeight(1)} />

                                {
                                    optionSelect.list?.map((item, listI) =>
                                        <View key={listI}>
                                            {/* Divider */}

                                            <Spacer paddingT={myHeight(1)} />

                                            <View style={{ paddingHorizontal: myWidth(3), flexDirection: 'row', alignItems: 'center' }}>

                                                <View style={{
                                                    borderRadius: myWidth(1.5),

                                                    paddingHorizontal: myWidth(2),
                                                    // paddingVertical: myHeight(1),
                                                    paddingEnd: myWidth(3),
                                                    color: myColors.text,
                                                    flex: 1,

                                                    backgroundColor: myColors.offColor7,
                                                    // borderWidth: 0.7,
                                                    // borderColor: myColors.primaryT
                                                }}>

                                                    <TextInput placeholder="Item Name"
                                                        autoCorrect={false}
                                                        maxLength={30}
                                                        placeholderTextColor={myColors.offColor}
                                                        selectionColor={myColors.primary}
                                                        cursorColor={myColors.primaryT}
                                                        value={item}
                                                        onChangeText={(val) => {
                                                            let newList = optionSelect.list
                                                            newList[listI] = val
                                                            const copy = {
                                                                ...optionSelect,
                                                                list: newList
                                                            }

                                                            // console.log(copy)
                                                            setOptionSelect(copy)
                                                            setChange(!change)

                                                        }}
                                                        style={{
                                                            flex: 1,
                                                            padding: 0,
                                                            backgroundColor: myColors.offColor7,
                                                            // paddingVertical: myHeight(1)
                                                            // textAlign: 'center'
                                                        }}
                                                    />

                                                </View>

                                                {/* bin */}
                                                <TouchableOpacity activeOpacity={0.7}
                                                    disabled={optionSelect.list.length <= 2}
                                                    onPress={() => {
                                                        let newList = []
                                                        optionSelect.list.map((it, li) => {
                                                            if (listI != li) {
                                                                newList.push(it)
                                                            }
                                                        })
                                                        const copy = {
                                                            ...optionSelect,
                                                            list: newList
                                                        }

                                                        setOptionSelect(copy)
                                                        setChange(!change)


                                                    }}
                                                    style={{ paddingHorizontal: myWidth(4), marginEnd: -myWidth(3) }}>
                                                    <Image style={{
                                                        height: myHeight(2.4),
                                                        width: myHeight(2.4),
                                                        resizeMode: 'contain',
                                                        tintColor: optionSelect.list.length <= 2 ? myColors.offColor : myColors.primaryT
                                                    }} source={require('../assets/home_main/home/bin.png')} />
                                                </TouchableOpacity>

                                                {/* Circle */}
                                                {/* <View style={{
                                                        width: myHeight(2.8), height: myHeight(2.8),
                                                        borderColor: myColors.primaryT, borderRadius: myHeight(3),
                                                        // borderWidth: selectItems[option.name] == item ? myHeight(0.9) : myHeight(0.2),
                                                        borderWidth: myHeight(0.9)
                                                    }} /> */}

                                            </View>
                                            <Spacer paddingT={myHeight(1)} />

                                        </View>
                                    )
                                }
                                <Spacer paddingT={myHeight(1)} />

                                <TouchableOpacity onPress={() => {
                                    optionSelect.list.push('')
                                    const copy = { ...optionSelect }

                                    setOptionSelect(copy)
                                    setChange(!change)

                                }}
                                    activeOpacity={0.8}
                                    style={{
                                        width: myWidth(85), alignSelf: 'center', paddingVertical: myHeight(0.7),
                                        borderRadius: myWidth(1.4), alignItems: 'center', justifyContent: 'center',
                                        flexDirection: 'row', backgroundColor: myColors.background,
                                        borderWidth: myHeight(0.12), borderColor: myColors.primaryT
                                    }}>
                                    <Text style={[styles.textCommon, {
                                        fontFamily: myFonts.bodyBold,
                                        fontSize: myFontSize.body,
                                        color: myColors.primaryT,
                                    }]}>Add Item</Text>
                                </TouchableOpacity>

                                <Spacer paddingT={myHeight(1)} />



                            </Collapsible>
                            {
                                options?.map((option, i) => {

                                    return (

                                        <View key={i}>
                                            <Spacer paddingT={myHeight(1)} />

                                            <View style={{
                                                height: myHeight(0.5), backgroundColor: myColors.primaryL2
                                            }} />
                                            <Spacer paddingT={myHeight(2)} />
                                            {/* Name & Required */}
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <View style={{
                                                    borderRadius: myWidth(1.5),

                                                    paddingHorizontal: myWidth(2),
                                                    paddingVertical: myHeight(0.3),
                                                    paddingEnd: myWidth(3),
                                                    color: myColors.text,
                                                    flex: 1,

                                                    backgroundColor: myColors.offColor7,
                                                    // borderWidth: 0.7,
                                                    // borderColor: myColors.primaryT
                                                }}>

                                                    <TextInput placeholder="Option Name"
                                                        autoCorrect={false}
                                                        maxLength={30}
                                                        placeholderTextColor={myColors.offColor}
                                                        selectionColor={myColors.primary}
                                                        value={option.name}
                                                        onChangeText={(val) => {

                                                            const copy = {
                                                                ...option,
                                                                name: val
                                                            }

                                                            // console.log(copy)
                                                            options[i] = copy
                                                            setOptios(options)
                                                            setChange(!change)

                                                        }}
                                                        cursorColor={myColors.primaryT}

                                                        // value={newCat} onChangeText={setNewCat}
                                                        style={{
                                                            flex: 1,
                                                            padding: 0,
                                                            backgroundColor: myColors.offColor7,
                                                            fontSize: myFontSize.xBody,
                                                            fontFamily: myFonts.bodyBold,

                                                            // textAlign: 'center'
                                                        }}
                                                    />

                                                </View>
                                                <Spacer paddingEnd={myWidth(4)} />


                                                <TouchableOpacity
                                                    activeOpacity={0.85}
                                                    onPress={() => {
                                                        let newOption = []
                                                        options.map((op, oi) => {
                                                            if (oi != i) {
                                                                newOption.push(op)
                                                            }
                                                        })


                                                        setOptios(newOption)
                                                        // setChange(!change)
                                                    }}
                                                    style={{
                                                        paddingHorizontal: myWidth(4),
                                                        paddingVertical: myHeight(0.6),
                                                        backgroundColor: myColors.red,
                                                        borderRadius: myWidth(1)
                                                    }}>
                                                    <Text style={[styles.textCommon, {
                                                        fontSize: myFontSize.body2,
                                                        fontFamily: myFonts.body,
                                                        color: myColors.background,
                                                    }]}>Remove</Text>
                                                </TouchableOpacity>

                                            </View>
                                            <Spacer paddingT={myHeight(1.5)} />
                                            <TouchableOpacity activeOpacity={0.85}
                                                onPress={() => {
                                                    const copy = {
                                                        ...option,
                                                        required: option.required ? false : true
                                                    }

                                                    options[i] = copy
                                                    setOptios(options)
                                                    setChange(!change)
                                                }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingStart: myWidth(1) }}>
                                                    <View style={{
                                                        height: myHeight(3.2),
                                                        width: myHeight(3.2),
                                                        paddingTop: myHeight(0.6)
                                                    }}>
                                                        <View style={{ width: myHeight(2.2), height: myHeight(2.2), borderWidth: 1.5, borderColor: myColors.textL4 }} />
                                                        {
                                                            option.required &&
                                                            <Image style={{
                                                                height: myHeight(3.2),
                                                                width: myHeight(3.2),
                                                                resizeMode: 'contain',
                                                                tintColor: myColors.primaryT,
                                                                marginTop: -myHeight(3)
                                                            }} source={require('../assets/profile/check2.png')} />
                                                        }
                                                    </View>
                                                    <Spacer paddingEnd={myWidth(1)} />
                                                    <Text style={[styles.textCommon,
                                                    {
                                                        fontFamily: myFonts.bodyBold,
                                                        fontSize: myFontSize.xBody,

                                                    }]}>Require <Text
                                                        style={{
                                                            fontFamily: myFonts.body,
                                                            fontSize: myFontSize.body2,

                                                        }}>{"(User Must Select Before Place Order)"}</Text></Text>
                                                </View>
                                            </TouchableOpacity>

                                            <Spacer paddingT={myHeight(1)} />

                                            {
                                                option.list?.map((item, listI) =>
                                                    <View key={listI}>
                                                        {/* Divider */}
                                                        {
                                                            i != 0 &&
                                                            <View style={{
                                                                width: '100%', borderTopWidth: myHeight(0.12),
                                                                borderColor: myColors.dot,
                                                            }} />
                                                        }
                                                        <Spacer paddingT={myHeight(1)} />

                                                        <View style={{ paddingHorizontal: myWidth(3), flexDirection: 'row', alignItems: 'center' }}>

                                                            <View style={{
                                                                borderRadius: myWidth(1.5),

                                                                paddingHorizontal: myWidth(2),
                                                                // paddingVertical: myHeight(0.5),
                                                                paddingEnd: myWidth(3),
                                                                color: myColors.text,
                                                                flex: 1,

                                                                backgroundColor: myColors.offColor7,
                                                                // borderWidth: 0.7,
                                                                // borderColor: myColors.primaryT
                                                            }}>

                                                                <TextInput placeholder="Item Name"
                                                                    autoCorrect={false}
                                                                    maxLength={30}
                                                                    placeholderTextColor={myColors.offColor}
                                                                    selectionColor={myColors.primary}
                                                                    cursorColor={myColors.primaryT}
                                                                    value={item}
                                                                    onChangeText={(val) => {
                                                                        let newList = option.list
                                                                        newList[listI] = val
                                                                        const copy = {
                                                                            ...option,
                                                                            list: newList
                                                                        }

                                                                        // console.log(copy)
                                                                        options[i] = copy
                                                                        setOptios(options)
                                                                        setChange(!change)

                                                                    }}
                                                                    style={{
                                                                        flex: 1,
                                                                        padding: 0,
                                                                        backgroundColor: myColors.offColor7,

                                                                        // textAlign: 'center'
                                                                    }}
                                                                />

                                                            </View>

                                                            {/* bin */}
                                                            <TouchableOpacity activeOpacity={0.7}
                                                                disabled={option.list.length <= 2}
                                                                onPress={() => {
                                                                    let newList = []
                                                                    option.list.map((it, li) => {
                                                                        if (listI != li) {
                                                                            newList.push(it)
                                                                        }
                                                                    })
                                                                    const copy = {
                                                                        ...option,
                                                                        list: newList
                                                                    }

                                                                    options[i] = copy
                                                                    setOptios(options)
                                                                    setChange(!change)


                                                                }}
                                                                style={{ paddingHorizontal: myWidth(4), marginEnd: -myWidth(3) }}>
                                                                <Image style={{
                                                                    height: myHeight(2.4),
                                                                    width: myHeight(2.4),
                                                                    resizeMode: 'contain',
                                                                    tintColor: option.list.length <= 2 ? myColors.offColor : myColors.primaryT
                                                                }} source={require('../assets/home_main/home/bin.png')} />
                                                            </TouchableOpacity>

                                                            {/* Circle */}
                                                            {/* <View style={{
                                                        width: myHeight(2.8), height: myHeight(2.8),
                                                        borderColor: myColors.primaryT, borderRadius: myHeight(3),
                                                        // borderWidth: selectItems[option.name] == item ? myHeight(0.9) : myHeight(0.2),
                                                        borderWidth: myHeight(0.9)
                                                    }} /> */}

                                                        </View>
                                                        <Spacer paddingT={myHeight(1)} />

                                                    </View>
                                                )
                                            }
                                            <Spacer paddingT={myHeight(1)} />

                                            <TouchableOpacity onPress={() => {
                                                option.list.push('')
                                                const copy = { ...option }

                                                options[i] = copy
                                                setOptios(options)
                                                setChange(!change)



                                            }}
                                                activeOpacity={0.8}
                                                style={{
                                                    width: myWidth(85), alignSelf: 'center', paddingVertical: myHeight(0.7),
                                                    borderRadius: myWidth(1.4), alignItems: 'center', justifyContent: 'center',
                                                    flexDirection: 'row', backgroundColor: myColors.background,
                                                    borderWidth: myHeight(0.12), borderColor: myColors.primaryT
                                                }}>
                                                <Text style={[styles.textCommon, {
                                                    fontFamily: myFonts.bodyBold,
                                                    fontSize: myFontSize.body,
                                                    color: myColors.primaryT,
                                                }]}>Add Item</Text>
                                            </TouchableOpacity>

                                            <Spacer paddingT={myHeight(1)} />
                                        </View>
                                    )
                                }
                                )
                            }
                        </View>

                        :
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.body,
                            textAlign: 'center',
                            color: myColors.textL4


                        }]}>Item Options Hidden Because Home Delivery Not Available In Your Restaurant</Text>
                }

                <Spacer paddingT={myHeight(2.5)} />





            </KeyboardAwareScrollView>



            <TouchableOpacity onPress={onSave}
                activeOpacity={0.8}
                style={{
                    width: myWidth(92), alignSelf: 'center', paddingVertical: myHeight(1.3),
                    borderRadius: myHeight(1.4), alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'row', backgroundColor: myColors.primaryT, marginVertical: myHeight(3),
                    // borderTopWidth: 1.5, borderColor: myColors.divider
                }}>
                <Text style={[styles.textCommon, {
                    fontFamily: myFonts.heading,
                    fontSize: myFontSize.body3,
                    color: myColors.background
                }]}>Save item</Text>
            </TouchableOpacity>
            {/* <Spacer paddingT={myHeight(5)} /> */}

            {isLoading && <Loader />}
            {errorMsg && <MyError message={errorMsg} />}


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
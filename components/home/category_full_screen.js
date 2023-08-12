import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { myFontSize, myFonts, myLetSpacing } from "../../ultils/myFonts"
import { myColors } from "../../ultils/myColors"
import { Categories, Restaurants, offers } from "./home_data";
import { Spacer, StatusbarH, myHeight, myWidth } from "../common";

export const CategoryFull = ({ navigation }) => {
    const [search, setSearch] = useState(null)
    const [filterList, setFilterList] = useState([])


    useEffect(() => {
        if (search) {
            const s = Categories.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
            setFilterList(s)
        } else {
            setFilterList(Categories)
        }
    }, [search])
    return (
        <View style={{ paddingHorizontal: myWidth(0), flex: 1, backgroundColor: myColors.background }}>
            <StatusbarH />
            <Spacer paddingT={myHeight(1)} />
            {/* Top */}
            <View style={{ paddingHorizontal: myWidth(4.5), flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity activeOpacity={0.6} style={{ padding: myHeight(1) }}
                    onPress={() => navigation.goBack()}>
                    <Image source={require('../assets/common/back.png')} style={{
                        width: myHeight(2.4),
                        height: myHeight(2.4),
                        resizeMode: 'contain',
                    }} />
                </TouchableOpacity>
                <Spacer paddingEnd={myWidth(2)} />
                <Text style={[styles.textCommon, {
                    flex: 1,
                    fontSize: myFontSize.xBody2,
                    fontFamily: myFonts.heading,
                }]}>All Categories</Text>
            </View>

            <Spacer paddingT={myHeight(1.5)} />
            {/* Search */}
            <View style={{
                flexDirection: 'row', alignItems: 'center', width: myWidth(92),
                backgroundColor: myColors.divider, alignSelf: 'center',
                paddingVertical: myHeight(0.8),
                borderRadius: myHeight(1.2)
            }}>
                <Spacer paddingEnd={myWidth(4)} />
                <Image style={{
                    height: myHeight(2.2),
                    width: myHeight(2.2),
                    resizeMode: 'contain',
                    tintColor: myColors.textL4
                }} source={require('../assets/home_main/home/search.png')} />
                <Spacer paddingEnd={myWidth(3)} />

                <TextInput
                    style={{
                        flex: 1,
                        padding: 0, fontSize: myFontSize.body,
                        fontFamily: myFonts.bodyBold, alignItems: 'center',
                        includeFontPadding: false,
                    }}
                    placeholder="Search Category"
                    cursorColor={myColors.primaryT}
                    placeholderTextColor={myColors.offColor}
                    value={search}

                    onChangeText={setSearch}
                />
            </View>
            <Spacer paddingT={myHeight(1.5)} />
            {/* <View style={{
                borderTopWidth: myHeight(0.1),
                borderColor: myColors.offColor, width: "100%"
            }} /> */}

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Categories */}
                <View style={{
                    flexWrap: 'wrap', flexDirection: 'row',
                    alignItems: 'center',
                    paddingStart: myWidth(2),

                }}>

                    {filterList.map((item, i) =>
                        <TouchableOpacity key={i} activeOpacity={0.95} style={{
                            flexBasis: '43%', marginHorizontal: myWidth(3),
                            marginVertical: myHeight(1),
                            justifyContent: 'center', alignItems: 'center'
                        }} onPress={() => navigation.navigate('RestaurantAll', { name: item.name, restaurants: Restaurants })}>
                            <View style={{ paddingBottom: myHeight(1), }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: myColors.background, elevation: 3, borderRadius: myWidth(5), width: myWidth(43), height: myWidth(36), }}>
                                    <Image style={{
                                        maxHeight: myWidth(35), maxWidth: myWidth(35),
                                        resizeMode: 'contain',
                                    }} source={item.image} />
                                </View>
                            </View>
                            <Text
                                style={[styles.textCommon, {
                                    fontSize: myFontSize.xBody,
                                    fontFamily: myFonts.heading,
                                    alignSelf: 'center'
                                }]}>{item.name}</Text>
                            <Spacer paddingT={myHeight(0)} />

                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>

            {/* THree */}
            {/* <TouchableOpacity key={i} activeOpacity={0.95} style={{
                            flexBasis: '25%', marginHorizontal: myWidth(4), marginVertical: myHeight(1),
                            alignItems: 'center',
                        }} onPress={() => null}>
                            <View style={{ paddingBottom: myHeight(1), }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: myColors.background, elevation: 6, borderRadius: myWidth(5), width: myWidth(28), height: myWidth(28) }}>
                                    <Image style={{
                                        height: myWidth(17), width: myWidth(17),
                                        resizeMode: 'contain',
                                    }} source={item.image} />
                                </View>
                            </View>
                            <Text
                                style={[styles.textCommon, {
                                    fontSize: myFontSize.body2,
                                    fontFamily: myFonts.heading,
                                    alignSelf: 'center'
                                }]}>{item.name}</Text>
                            <Spacer paddingT={myHeight(0.5)} />

                        </TouchableOpacity> */}


            {/* Two */}
            {/* <TouchableOpacity activeOpacity={0.95} style={{
                        flexBasis: '40%', marginHorizontal: myWidth(4), marginVertical: myHeight(1),
                        // justifyContent: 'center', alignItems: 'center', backgroundColor: 'red'
                    }} onPress={() => null}>
                        <View style={{ paddingBottom: myHeight(1), }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: myColors.background, elevation: 6, borderRadius: myWidth(5), width: myWidth(40), height: myWidth(23) + myHeight(4) }}>
                                <Image style={{
                                    height: myWidth(23), width: myWidth(23),
                                    resizeMode: 'contain',
                                }} source={item.image} />
                            </View>
                        </View>
                        <Text
                            style={[styles.textCommon, {
                                fontSize: myFontSize.xBody,
                                fontFamily: myFonts.heading,
                                alignSelf: 'center'
                            }]}>{item.name}</Text>
                        <Spacer paddingT={myHeight(0.5)} />

                    </TouchableOpacity> */}

        </View>
    )
}

const styles = StyleSheet.create({

    textCommon: {
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },
})

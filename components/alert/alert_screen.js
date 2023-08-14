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
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { ItemSkeleton, RestaurantInfoSkeleton, RestaurantInfoSkeletonHori } from '../common/skeletons';


export const Alert = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {

    }, [])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: myColors.background }}>
            <StatusbarH />
            {/* Top */}
            <View>
                <Spacer paddingT={myHeight(2)} />
                <View style={{ paddingEnd: myWidth(4), flexDirection: 'row', alignItems: 'center' }}>

                    {/* Arrow */}
                    {/* <TouchableOpacity activeOpacity={0.7}
                        onPress={() => navigation.goBack()} style={{ paddingHorizontal: myWidth(4), }}>
                        <Image style={{
                            height: myHeight(2.4),
                            width: myHeight(2.4),
                            resizeMode: 'contain',
                            tintColor: myColors.textL0
                        }} source={require('../assets/home_main/home/back.png')} />
                    </TouchableOpacity> */}
                    <Spacer paddingEnd={myWidth(4)} />
                    <Text style={[styles.textCommon,
                    {
                        fontFamily: myFonts.heading,
                        fontSize: myFontSize.xBody2
                    }]}>Notifications </Text>
                </View>
                <Spacer paddingT={myHeight(1.5)} />

                <View style={{ height: myHeight(0.6), backgroundColor: myColors.divider }} />
            </View>

            <Spacer paddingT={myHeight(1.5)} />



            <Spacer paddingT={myHeight(1)} />


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
})
import React from 'react';
import { Dimensions, View, Platform, StatusBar, Text } from 'react-native'
import { MMKV } from 'react-native-mmkv';
import { myColors } from '../ultils/myColors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { myFontSize, myFonts, myLetSpacing } from '../ultils/myFonts';
import Animated, { BounceInUp, FadeInUp, FadeOutUp } from 'react-native-reanimated';
const { height, width } = Dimensions.get('window')
export const ios = Platform.OS == 'ios'
export const stutusH = StatusBar.currentHeight
import { Chase, Fold, Grid, Swing } from "react-native-animated-spinkit"

export function printWithPlat(print) {
    console.log(`${Platform.OS} => ${print} ${height} ${StatusBar.currentHeight}`)
}
export function myHeight(per) {
    if (ios) {

        return (per * height) / 100
    }
    if (stutusH) {
        return (per * (height - stutusH)) / 100
    }
    return (per * (height)) / 100

}
export function myWidth(per) {
    const myHeight = (per * width) / 100
    return myHeight
}

export const Spacer = ({ paddingEnd = 0, paddingT = 0 }) => (
    <View style={{ paddingEnd: paddingEnd, paddingTop: paddingT }} />
)
export const Loader = () => (
    <View
        style={{
            height: '100%', width: myWidth(100), position: 'absolute', zIndex: 10,
            justifyContent: 'center', alignItems: 'center',
            backgroundColor: '#00000020'
        }}>
        <Grid size={myHeight(12)} color={myColors.primaryT} />

    </View>
)
export const MyError = ({ message = '' }) => {

    return (
        <Animated.View
            entering={FadeInUp}
            exiting={FadeOutUp}
            style={{
                marginTop: StatusBar.currentHeight + myHeight(1.5),
                zIndex: 100, position: 'absolute',
                paddingVertical: myHeight(0.7), paddingHorizontal: myWidth(4),
                width: myWidth(90), backgroundColor: myColors.ligRed,
                alignItems: 'center', alignSelf: 'center',
                borderRadius: myWidth(100)
            }}>

            <Text
                style={{
                    fontSize: myFontSize.body,
                    fontFamily: myFonts.heading,
                    color: myColors.background,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                }}
            >{message}</Text>
        </Animated.View>
    )
}

export const bottomTab = {
    backgroundColor: myColors.background,
    paddingHorizontal: myWidth(3.5),
    alignItems: 'center',
    justifyContent: 'center',
    height: myHeight(7.5),
    paddingBottom: ios ? myHeight(2.2) : myHeight(0.5),
    paddingTop: myHeight(2),
    borderTopWidth: 1.5,
}
export const storage = new MMKV()

export const StatusBarShow = () => (
    <StatusBar backgroundColor={myColors.background} translucent={false} />
)
export const StatusBarBlack = () => (
    <StatusBar backgroundColor={myColors.text} translucent={false} />
)
export const StatusBarHide = () => (
    <StatusBar backgroundColor={'transparent'} translucent={true} />
)

export const StatusbarH = () => (
    <View style={{ height: StatusBar.currentHeight }} />
)

export const errorTime = 2000
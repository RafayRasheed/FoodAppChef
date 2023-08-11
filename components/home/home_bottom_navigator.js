import React, { useLayoutEffect } from "react";
import { Text, SafeAreaView, View, Image, StatusBar, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Spacer, StatusbarH, bottomTab, ios, myHeight, myWidth, storage } from "../common";
import { myColors } from "../../ultils/myColors";
import { myFontSize, myFonts, myLetSpacing } from "../../ultils/myFonts";
import { ActivityScreen } from "../activity/activity_screen";
import { HomeNavigator } from "./home_navigator";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack"
import { deleteLogin } from "../functions/storageMMKV";
import { useSelector } from "react-redux";
import { ProfileNavigator } from "../profile/profile_navigator";

const Tab = createBottomTabNavigator()

const Icons = {
    HOME: {
        image: require('../assets/home_main/home/navigator/home.png'),
        style: { width: myWidth(6.5), height: myHeight(2.68) }
    },
    ORDERS: {
        image: require('../assets/home_main/home/navigator/orderIcon.png'),
        style: { width: myHeight(2.9), height: myHeight(2.9) }
    },
    PROFILE: {
        image: require('../assets/home_main/home/navigator/account.png'),
        style: { width: myWidth(6.2), height: myHeight(2.68) }
    },
}


const screenOptions = ({ navigator, route }) => {
    const { cart } = useSelector(state => state.cart)
    const name = route.name
    return {
        headerShown: false,
        tabBarStyle: bottomTab,
        tabBarLabelStyle: {
            display: name == 'HOT' ? 'none' : 'flex',
            fontSize: myFontSize.xSmall,
            fontFamily: myFonts.bodyBold,
            letterSpacing: myLetSpacing.common,
            paddingTop: myHeight(1),
        },
        tabBarActiveTintColor: myColors.primaryT,
        tabBarInactiveTintColor: myColors.text,
        // tabBarShowLabel:name=='HOT'?true:false,
        tabBarIcon: ({ color }) => {

            if (name == 'ORDERS') {
                return (
                    <View>
                        <Image style={[Icons[name].style, { tintColor: color, resizeMode: 'contain', }]}
                            source={Icons[name].image} />
                        {
                            cart.length ?
                                <View style={{
                                    position: 'absolute', top: -myHeight(0.6), right: -myHeight(1.4), backgroundColor: myColors.red, borderRadius: 100,
                                    paddingVertical: myHeight(0.35), paddingHorizontal: myHeight(1)
                                }}>
                                    <Text style={[styles.textCommon, { fontSize: myFontSize.tiny, fontFamily: myFonts.bodyBold, color: myColors.background }]}>{cart.length}</Text>
                                </View>
                                : null
                        }
                    </View>
                )
            }
            return (
                <Image style={[Icons[name].style, { tintColor: color, resizeMode: 'contain', }]}
                    source={Icons[name].image} />
            )
        },
    }
}

const Xr = ({ navigation }) => (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: myColors.background }}>
        <StatusbarH />
        <Spacer paddingT={myHeight(2)} />
        <Text onPress={() => {
            const isNotDelete = deleteLogin()
            console.log(isNotDelete)
            if (isNotDelete) {
                console('Error on delete user from signout mmkv')
            } else {
                navigation.navigate('AccountNavigator')
            }
        }} style={{ color: 'black' }}>Sign Out</Text>
    </SafeAreaView>
)


export const HomeBottomNavigator = ({ route, navigation }) => {
    // useLayoutEffect(() => {
    //     StatusBar.setTranslucent(false)
    //     StatusBar.setBackgroundColor(myColors.background)
    // }, [route, navigation])
    return (

        <>
            <Tab.Navigator
                tabBarActiveTintColor={myColors.primary}
                headerShown={false}
                screenOptions={screenOptions}
                tabBarShowLabel={false}
                initialRouteName="HOME"
            >
                <Tab.Screen name="HOME" component={HomeNavigator} />
                <Tab.Screen name="ORDERS" component={Xr} />
                <Tab.Screen name="PROFILE" component={ProfileNavigator} />

            </Tab.Navigator>
        </>


    )
}

const styles = StyleSheet.create({
    textCommon: {
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    }
})

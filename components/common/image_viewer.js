import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Image, View, Text, FlatList, Modal, UIManager, LayoutAnimation, StatusBar } from 'react-native'
import { MyError, Spacer, StatusBarBlack, StatusbarH, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';


export const ImageViewer = ({ navigation, route }) => {
    const { images, i } = route.params
    const ref = useRef()
    const [index, setIndex] = useState(i);
    // const [enableScroill, setEnableScroill] = useState(false);

    function handleScroll(event) {
        const a = (event.nativeEvent.contentOffset.x) / myWidth(100)
        let b = Math.round(a)

        if (index != b && b < images.length) {
            setIndex(b)
        }

    }
    useEffect(() => {
        ref.current?.scrollTo({
            x: myWidth(100) * index,
            y: 0,
            animated: false,
        })
        // setEnableScroill(true)

    }
        , [])
    return (
        <SafeAreaView style={styles.container}>
            <View style={{
                position: 'absolute', top: myHeight(1) + StatusBar.currentHeight, zIndex: 10, width: '100%',
                flexDirection: 'row', alignItems: 'center', paddingHorizontal: myWidth(4),
                //  backgroundColor: '#ffffff20'
            }}>
                {/* Back */}
                <TouchableOpacity
                    style={{
                        // backgroundColor: myColors.background,
                        padding: myHeight(1),
                        overflow: 'hidden',
                        zIndex: 5,

                    }}
                    activeOpacity={0.8}
                    onPress={() => navigation.goBack()}>
                    <Image
                        style={{
                            width: myHeight(2.6),
                            zIndex: 0,
                            height: myHeight(2.6),
                            resizeMode: 'contain',
                            tintColor: myColors.background
                        }}
                        source={require('../assets/home_main/home/back.png')}
                    />
                </TouchableOpacity>


                <Text style={[styles.textCommon, {
                    flex: 1, textAlign: 'center',
                    marginStart: -myHeight(3.6),
                    fontFamily: myFonts.heading,
                    fontSize: myFontSize.medium0,
                    color: myColors.background
                }]}>{index + 1} / {images.length}</Text>
            </View>

            <ScrollView
                // onTouchStart={() => setEnableScroill(true)}
                ref={ref}
                onScroll={handleScroll}
                showsHorizontalScrollIndicator={false}
                horizontal
                pagingEnabled
                snapToInterval={myWidth((100))}
                scrollEventThrottle={1}
                //  style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
            >
                {
                    images.map((image, i) =>
                        <View key={i} style={{ width: myWidth(100), }}>
                            <Image
                                // onLoadEnd={handlePressIn}
                                style={{
                                    width: myWidth(100),
                                    resizeMode: "contain",
                                    height: 10000

                                    //   borderBottomLeftRadius: myWidth(5),
                                    //   borderBottomRightRadius: myWidth(5),
                                }}
                                source={{ uri: image }}

                            />
                        </View>
                    )
                }
            </ScrollView>


        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: myColors.text
    },


    //Text
    textCommon: {
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },

})
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Spacer, myHeight, myWidth } from '../../common';
import { myColors } from '../../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../../ultils/myFonts';
import { ImageUri } from '../../common/image_uri';


export const History_Order = ({ item }) => {
    const { cart } = item
    return (
        <View style={styles.container}>
            {/* Content */}
            <View style={styles.containerContent}>
                <ImageUri width={myHeight(6.5)} height={myHeight(6.5)} resizeMode='cover' uri={item.image} />
                {/* <Image style={styles.imageMain} source={item.image} /> */}

                <Spacer paddingEnd={myWidth(1.5)} />
                {/* Text */}
                <View style={styles.containerText}>
                    <View>
                        <Text numberOfLines={1} style={styles.textName}>{item.name}</Text>
                        <Text numberOfLines={1} style={styles.textTime_Status}>{item.date}</Text>
                    </View>
                    {/* Price & Status */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                        <Text numberOfLines={1} style={styles.textTime_Status}>{cart.total}</Text>

                        <Spacer paddingEnd={myWidth(3)} />
                        <Text numberOfLines={1} style={[styles.textTime_Status, {
                            fontSize: myFontSize.xxSmall,
                            fontFamily: myFonts.heading,
                            color: item.status > 0 ? '#4CD964' : item.status < 0 ? '#FF1010' : myColors.primaryT,

                        }]}>{item.statusT}</Text>
                        {/* Status Tag */}
                    </View>

                </View>

                <Image style={styles.imageDown_Rel} source={require('../../assets/home_main/home/go.png')} />

                {/* Button  Invoice & Rebook/TrackOrder*/}
                {/* <View style={styles.containerOrder_Reb}>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => console.log('Invoice')}
                            style={styles.containerButtonOrder_Reb}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image style={styles.imageDown_Rel} source={require('../../assets/activity/download.png')} />
                                <Spacer paddingEnd={myWidth(1.7)} />
                                <Text style={styles.textReb_Order}>Invoice</Text>
                            </View>
                        </TouchableOpacity>
                        {
                            item.track ?
                                <TouchableOpacity activeOpacity={0.6} onPress={() => console.log('Rebook')}
                                    style={styles.containerButtonTrack}>
                                    <Text style={styles.textReb_Order}>Track Order</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity activeOpacity={0.6} onPress={() => console.log('Rebook')}
                                    style={styles.containerButtonOrder_Reb}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image style={styles.imageDown_Rel} source={require('../../assets/activity/reload.png')} />
                                        <Spacer paddingEnd={myWidth(1.62)} />
                                        <Text style={styles.textReb_Order}>Rebook</Text>
                                    </View>
                                </TouchableOpacity>
                        }
                    </View> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: myHeight(1.2),
    },
    containerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    containerDivider: {
        height: myHeight(0.16),
        backgroundColor: myColors.divider,
    },
    containerText: {
        flex: 1, justifyContent: 'space-between',
        paddingHorizontal: myWidth(2),
        paddingBottom: myHeight(0.3)
    },

    containerOrder_Reb: {
        justifyContent: 'space-between',
    },
    containerButtonOrder_Reb: {
        paddingStart: myWidth(3),
        paddingEnd: myWidth(5),
        paddingVertical: myHeight(0.45),
        borderRadius: myWidth(10),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: myColors.primaryL2,
    },
    containerButtonTrack: {
        // paddingHorizontal: myWidth(0),
        paddingVertical: myHeight(0.45),
        borderRadius: myWidth(10),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: myColors.primaryL2,
    },


    // Text
    textName: {
        fontSize: myFontSize.body,
        fontFamily: myFonts.bodyBold,
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },
    textTime_Status: {
        fontSize: myFontSize.xxSmall,
        fontFamily: myFonts.body,
        color: myColors.textL4,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },
    textReb_Order: {
        fontSize: myFontSize.xxSmall,
        fontFamily: myFonts.body,
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },




    // Image
    imageMain: {
        height: myHeight(6.5),
        width: myHeight(6.5),
        resizeMode: 'cover'
    },
    imageDown_Rel: {
        height: myHeight(1.9),
        width: myHeight(1.9),
        resizeMode: 'contain',
        alignSelf: 'center',
        tintColor: myColors.primaryT

    },
})
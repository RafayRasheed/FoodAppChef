import React, { useState, useEffect } from "react"
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native"
import { Spacer, myHeight, myWidth } from "../../common"
import { myFontSize, myFonts, myLetSpacing } from "../../../ultils/myFonts"
import { myColors } from "../../../ultils/myColors"
import { useDispatch, useSelector } from "react-redux"
import { addFavoriteItem, removeFavoriteItem } from "../../../redux/favorite_reducer"
import { ImageUri } from "../../common/image_uri"


export const ItemInfo = ({ item, navigate }) => {
    const { favoriteItem } = useSelector(state => state.favorite)
    const dispatch = useDispatch()



    return (

        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingEnd: myWidth(3),
            backgroundColor: myColors.background,
            elevation: 5, marginVertical: myHeight(1),
            borderRadius: myWidth(2),
            borderWidth: myHeight(0.15),
            borderColor: myColors.divider,
            overflow: 'hidden'
        }} >

            <ImageUri width={myHeight(10)} height={myHeight(10)} resizeMode="cover" uri={item.image} />

            <Spacer paddingEnd={myWidth(3)} />

            <View style={{ flex: 1 }}>
                {/* fIRST lINE */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }} >
                    <Text numberOfLines={1}
                        style={[
                            styles.textCommon,
                            {
                                flex: 1,
                                fontSize: myFontSize.xBody,
                                fontFamily: myFonts.heading,
                            },
                        ]}>
                        {item?.name}</Text>
                    <View style={{ width: myHeight(3.5) }} />

                    {/* Heart */}
                    <TouchableOpacity activeOpacity={0.85}
                        onPress={(() => navigate('ItemEdit', { item }))}
                        style={{
                            alignSelf: 'flex-end',
                            backgroundColor: myColors.background,
                            padding: myHeight(0.8),
                            borderRadius: myWidth(5),
                            position: 'absolute',
                            right: myWidth(-1),
                            marginVertical: myHeight(0.5),

                        }}>
                        {/* <Text style={styles.textRating}>Dill</Text> */}
                        <Image style={{
                            height: myHeight(1.8),
                            width: myHeight(1.8),
                            resizeMode: 'contain',
                        }}
                            source={require('../../assets/home_main/home/edit.png')} />
                    </TouchableOpacity>
                </View>
                <Spacer paddingT={myHeight(0.5)} />
                {/* Second Line */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* Price */}
                    <Text numberOfLines={1}
                        style={[
                            styles.textCommon,
                            {
                                fontSize: myFontSize.xBody,
                                fontFamily: myFonts.bodyBold,
                                color: myColors.primaryT,
                                borderRadius: 100,
                                // paddingHorizontal: myWidth(2.3),
                                // paddingVertical: myHeight(0.15),
                                // backgroundColor: myColors.primary
                            },
                        ]}>Rs {item?.price}</Text>

                    <Spacer paddingEnd={myWidth(2.5)} />
                    {/* Star */}
                    <Image
                        style={{
                            width: myHeight(2.2),
                            height: myHeight(2.2),
                            resizeMode: 'contain',
                        }}
                        source={require('../../assets/home_main/home/star.png')}
                    />
                    <Spacer paddingEnd={myWidth(1.2)} />
                    {/* Rating */}
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.textCommon,
                            {
                                flex: 1,
                                fontSize: myFontSize.body2,
                                fontFamily: myFonts.heading,
                                color: myColors.text3,
                            },
                        ]}>
                        {`${item.rating}  `}
                    </Text>


                    <Text numberOfLines={1}
                        style={[
                            styles.textCommon,
                            {
                                fontSize: myFontSize.xxSmall,
                                fontFamily: myFonts.bodyBold,
                                color: myColors.text,
                                maxWidth: myWidth(30),

                            },
                        ]}>
                        {item.resName}
                    </Text>
                </View>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: myColors.background,
    },

    //Text
    textCommon: {
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },
});

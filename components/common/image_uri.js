import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Image, View, Text, FlatList, Modal, UIManager, LayoutAnimation, StatusBar } from 'react-native'
import { MyError, Spacer, StatusBarBlack, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';


export const ImageUri = ({ width = 0, height = 0, resizeMode = 'contain', uri = null, borderRadius = 0 }) => {
    const [isLoading, setIsLoading] = useState(true)
    return (
        <View style={{ width, height }}>
            <Image
                onLoadEnd={() => setIsLoading(false)}
                style={{ width, height, resizeMode }} source={{ uri: uri }} />

            {
                isLoading &&
                <View style={{ position: 'absolute', width, height, top: 0 }}>
                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item width={width} height={height} borderRadius={borderRadius} />
                    </SkeletonPlaceholder>
                </View>
            }
        </View>
    )
}
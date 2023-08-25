import React, { useEffect, useRef, useState } from 'react';
import { View, Image } from 'react-native';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { myColors } from '../../ultils/myColors';


export const ImageUri = ({ width = 0, height = 0, resizeMode = 'contain', uri = null, borderRadius = 0 }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isStart, setIsStart] = useState(false)
    const [isEnd, setIsEnd] = useState(false)

    useEffect(() => {
        if (isStart && !isEnd) {
            setIsLoading(true)
        }
    }, [isStart])
    return (
        <View style={{ width, height, borderRadius, overflow: 'hidden', backgroundColor: myColors.background }}>
            <Image
                onLoadStart={() => {
                    setTimeout(() => {

                        setIsStart(true)

                    }, 50)
                }}
                onError={() => {

                    setIsLoading(false)
                    setIsEnd(true)
                }}
                onLoadEnd={() => {
                    setIsLoading(false)
                    setIsEnd(true)
                }}
                style={{ width, height, resizeMode }} source={{ uri: uri }} />

            {
                isLoading &&
                <View style={{ position: 'absolute', width, height, top: 0 }}>
                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item width={width} height={height} borderRadius={0} />
                    </SkeletonPlaceholder>
                </View>
            }
        </View>
    )
}
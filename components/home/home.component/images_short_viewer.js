import React, { useEffect, useState, useContext } from 'react';
import {
  Image,
  View,
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';
// import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import { myColors } from '../../../ultils/myColors';
import { Spacer, myHeight, myWidth } from '../../common';
import { myFontSize, myFonts, myLetSpacing } from '../../../ultils/myFonts';
import { TouchableOpacity } from 'react-native';
import { ImageUri } from '../../common/image_uri';

const wid = Dimensions.get('window').width;

export const ImagesShortViewer = ({ navigate, images }) => {
  const i = 0;
  const [index, setIndex] = useState(i);

  function handleScroll(event) {
    const a = (event.nativeEvent.contentOffset.x) / myWidth(100)
    let b = Math.round(a)

    if (index != b && b < images.length) {
      setIndex(b)
    }
  }

  return (

    <View style={styles.container}>
      <ScrollView
        onScroll={handleScroll}

        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
        snapToInterval={myWidth((100))}
        scrollEventThrottle={1}
        //  style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, flexDirection: 'row' }}
      >
        {
          images.map((image, i) =>
            <TouchableOpacity activeOpacity={0.97}
              // disabled
              onPress={() => navigate('ImageViewer', { images, i })} key={i} style={{ width: myWidth(100), }}>
              <View style={{
                width: '100%',
                height: myHeight(28),
                borderBottomLeftRadius: myWidth(5),
                borderBottomRightRadius: myWidth(5),
                overflow: 'hidden'
              }}>
                <ImageUri width={'100%'} height={'100%'} resizeMode='cover' uri={image} />

              </View>

            </TouchableOpacity>
          )
        }
      </ScrollView>

      {/* Dot */}
      <View style={{
        position: 'absolute', alignSelf: 'center', flexDirection: 'row',
        borderColor: myColors.primaryT, bottom: myHeight(1)
      }}>
        {
          images.map((item, ind) =>
            <View key={ind} style={{
              borderWidth: myHeight(0.4), marginHorizontal: myWidth(0.3),
              borderColor: index == ind ? myColors.primaryT : 'transparent',
              borderRadius: myHeight(2)
            }}>

              <View style={{
                height: myHeight(1.2), width: myHeight(1.2), borderRadius: myHeight(1),
                backgroundColor: myColors.offColor, margin: myHeight(0.4)
              }} />
            </View>
          )
        }
      </View>
    </View>


  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: myColors.background,
    // overflow: 'visible',
  },

  topBar: {
    width: wid,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  containerChangeImage: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    position: 'absolute',
    top: 50,
    zIndex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },

  containerChangeLeft: {
    borderTopEndRadius: 15,
    borderBottomEndRadius: 15,
    left: 0,
  },

  containerChangeRight: {
    borderTopStartRadius: 15,
    borderBottomStartRadius: 15,
    right: 0,
  },
  //Text
  textCommon: {
    color: myColors.text,
    letterSpacing: myLetSpacing.common,
    includeFontPadding: false,
    padding: 0,
  },
});

import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ios, myHeight, myWidth, Spacer, StatusbarH } from "../common";
import { myFontSize, myFonts } from "../../ultils/myFonts";
import { myColors } from "../../ultils/myColors";
export const ForgetPassword = ({ navigation }) => {
    const [email, setEmail] = useState()
    const [verifyPass, setVerifyPass] = useState(false)

    function verifyEmail() {
        if (email) {
            return true
        }
        return false
    }
    useEffect(() => {
        if (verifyEmail()) {
            setVerifyPass(true)

        }
        else {
            setVerifyPass(false)
        }
    }, [email])

    return (
        <>
            <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, }} style={styles.container}>
                <StatusbarH />
                <View style={{ flex: 1, justifyContent: 'space-between', }}>
                    <View style={{ paddingHorizontal: myWidth(6.4) }}>
                        <Spacer paddingT={myHeight(5)} />

                        {/* T ForgetPass */}
                        <Text style={styles.textForget}>Forget Password</Text>
                        <Text style={[styles.textLight, { fontSize: myFontSize.body3 }]}>Enter your registered email below</Text>

                        <Spacer paddingT={myHeight(6.9)} />
                        {/* Email Portion */}
                        <View >
                            <Text style={[styles.heading]}>Email address</Text>
                            <View style={styles.containerInput}>

                                <TextInput placeholder="Eg namaemail@emailkamu.com"
                                    placeholderTextColor={myColors.offColor}
                                    style={styles.input} cursorColor={myColors.primary}
                                    value={email} onChangeText={setEmail}
                                    onEndEditing={() => verifyEmail()}
                                />
                            </View>

                        </View>

                        <Spacer paddingT={myHeight(1.9)} />
                        {/* T Remember Pass */}
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.textLight2}>Remember the password?</Text>
                            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6}>
                                <Text style={styles.textSign}> Sign in</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <View style={{ alignItems: 'center' }}>
                        {/* Button Submit */}
                        <TouchableOpacity onPress={() => verifyPass ? navigation.navigate('DoneEmail') : null} activeOpacity={0.8}
                            style={styles2(verifyPass).button}>
                            <Text style={styles2(verifyPass).textReg}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    heading: {
        paddingStart: myWidth(0.5), paddingVertical: myHeight(0.8),
        fontFamily: myFonts.bodyBold, fontSize: myFontSize.body,
        color: myColors.text
    },
    container: {
        flex: 1, backgroundColor: myColors.background,
        paddingVertical: myHeight(8.6)
    },
    containerInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: myWidth(2.5),
        paddingHorizontal: myWidth(2),
        borderWidth: myHeight(0.12),
        borderColor: myColors.textL4,
        backgroundColor: myColors.background,
    },

    input: {
        flex: 1,
        textAlignVertical: 'center',
        paddingVertical: ios ? myHeight(1) : myHeight(100) > 600 ? myHeight(0.8) : myHeight(0.2),
        fontSize: myFontSize.body,
        color: myColors.text,
        includeFontPadding: false,
        fontFamily: myFonts.bodyBold,
    },
    textForget: {
        fontFamily: myFonts.heading, fontSize: myFontSize.large, color: myColors.text,
        paddingVertical: myHeight(0.6)
    },
    textLight: {
        fontFamily: myFonts.bodyBold, color: myColors.offColor, fontSize: myFontSize.body
    },
    textLight2: {
        fontFamily: myFonts.bodyBold, color: myColors.offColor, fontSize: myFontSize.body,
        paddingStart: myWidth(0.8)
    },
    textSign: {
        fontFamily: myFonts.heading, color: myColors.primary, fontSize: myFontSize.body,
    }
})

const styles2 = (verifyPass) => StyleSheet.create({
    textReg: {
        color: verifyPass ? myColors.background : myColors.offColor, fontFamily: myFonts.headingBold,
        fontSize: myFontSize.body
    },
    button: {
        height: myHeight(6.1), width: myWidth(68.3),
        borderRadius: myHeight(1.47), alignItems: 'center',
        justifyContent: 'center', flexDirection: 'row',
        backgroundColor: verifyPass ? myColors.primary : myColors.offColor3
    }
})
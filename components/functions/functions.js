import { Base64 } from 'js-base64';

export function verificationCode() {
    return Math.floor(Math.random() * 899999 + 100000);
}


export function encodeInfo(info) {
    return Base64.encode(info);
}

export function deccodeInfo(encode) {
    return Base64.decode(encode);
}

function adjustSting(string, size) {
    const len = string.length
    let myStr = ''
    for (let i = 0; i < size - len; i++) {
        myStr += '0'
    }
    return (myStr + string)

}

export function dataFullData() {
    const date = new Date()

    const year = adjustSting(date.getUTCFullYear().toString(), 2)
    const month = adjustSting(date.getUTCMonth().toString(), 2)
    const day = adjustSting(date.getUTCDate().toString(), 2)
    const hours = adjustSting(date.getUTCHours().toString(), 2)
    const minutes = adjustSting(date.getUTCMinutes().toString(), 2)
    const seconds = adjustSting(date.getUTCSeconds().toString(), 2)
    const mili = adjustSting(date.getUTCMilliseconds().toString(), 3)
    const extra = verificationCode().toString().slice(0, 3)
    const code = year + month + day + hours + minutes + seconds + mili + extra

    const dateData = {
        date: day + '-' + month + '-' + year,
        dateInt: parseInt(code)
    }
    return (dateData)


}

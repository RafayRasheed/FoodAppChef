const { storage } = require("../common")

const saveLogin = 'loginRes'
const saveFirstTime = 'isFirstTime'
const saveCart = 'saveCart'

export function firstTime() {
    storage.set(saveFirstTime, true)
}

export function containFirstTime() {
    return storage.getBoolean(saveFirstTime)
}


// Login
export function setLogin(profile) {
    storage.set(saveLogin, JSON.stringify(profile))
    return containLogin()
}
export function getLogin() {
    if (containLogin()) {

        return JSON.parse(storage.getString(saveLogin))
    } else {

        return {}
    }
}

export function deleteLogin() {
    storage.delete(saveLogin)
    return containLogin()
}

export function containLogin() {
    return storage.contains(saveLogin)
}


// Cart
export function setCartLocal(cart) {
    storage.set(saveCart, JSON.stringify(cart))
}
export function getCartLocal() {
    const s = storage.getString(saveCart)
    if (s) {
        return JSON.parse(s)
    }
    return []
}
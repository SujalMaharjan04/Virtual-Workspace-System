const generateAESkey = () => {
    const key = window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        }, 
        true, //extractable - so true since we need to extract and share
        ["encrypt", "decrypt"]
    )

    return key
}

const encryptAESKey = async(aesKey, userPublicKey) => {
    const rawKey = await window.crypto.subtle.exportKey("raw", aesKey)

    const encryptedKey = await window.crypto.subtle.encrypt(
        {name: "RSA-OAEP"},
        userPublicKey, 
        rawKey
    )

    return btoa(String.fromCharCode(...new Uint8Array(encryptedKey)))
}

const decryptAESKey = async(encryptedAESKey, privateKey) => {
    const encryptedBuffer = Uint8Array.from(
        atob(encryptedAESKey), c => c.charCodeAt(0)
    ).buffer

    const rawKey = await window.crypto.subtle.decrypt(
        {name: "RSA-OAEP"},
        privateKey,
        encryptedBuffer
    )

    //Reimport the key as usable key
    return await window.crypto.subtle.importKey(
        "raw",
        rawKey,
        {name: "AES-GCM"},
        false, //No need to extract again
        ["encrypt", "decrypt"]
    )
}

export {generateAESkey, encryptAESKey, decryptAESKey}

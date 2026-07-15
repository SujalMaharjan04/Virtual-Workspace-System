const arrayToBufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer)
    let binary = ""
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i])
    }

    return window.btoa(binary)
}

const base64ToBufferToArray = (base64) => {
    const binary = window.atoa(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }

    return bytes.buffer
}
const encryptMessage = async(aesKey, plainMessage) => {
    const iv = window.crypto.getRandomValues(new Uint8Array(12))

    const encoded = new TextEncoder().encode(plainMessage)

    const cipherTextBuffer = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        aesKey,
        encoded
    )


    return {
        cipherMessage: arrayToBufferToBase64(cipherTextBuffer),
        iv: arrayToBufferToBase64(iv)
    }
}

const decryptMessage = async(aesKey, cipherMessageB64, ivB64) => {
    const cipherMessage = base64ToBufferToArray(cipherMessageB64)
    const iv = base64ToBufferToArray(ivB64)

    const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        aesKey,
        cipherMessage
    )

    return new TextDecoder().decode(decryptedBuffer)
}

export {encryptMessage, decryptMessage}


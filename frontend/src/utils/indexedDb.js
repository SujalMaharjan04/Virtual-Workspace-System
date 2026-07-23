// Minimal IndexedDB wrapper for storing the AES CryptoKey per room
function openKeyDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open("e2ee-keys", 1)
        req.onupgradeneeded = () => {
            req.result.createObjectStore("aesKeys") // keyPath = roomId, value = CryptoKey
        }
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
    })
}

async function saveAESKey(roomId, cryptoKey) {
    const db = await openKeyDB()
    return new Promise((resolve, reject) => {
        const tx = db.transaction("aesKeys", "readwrite")
        tx.objectStore("aesKeys").put(cryptoKey, roomId)
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
    })
}

async function loadAESKey(roomId) {
    const db = await openKeyDB()
    return new Promise((resolve, reject) => {
        const tx = db.transaction("aesKeys", "readonly")
        const req = tx.objectStore("aesKeys").get(roomId)
        req.onsuccess = () => resolve(req.result ?? null) // null if not found
        req.onerror = () => reject(req.error)
    })
}

export  {saveAESKey, loadAESKey}
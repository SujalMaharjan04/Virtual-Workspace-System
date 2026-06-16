
const VectorClock = {
    compare: (clockA, clockB) => {
        const allKeys = [
            ...new Set([...Object.keys(clockA), ...Object.keys(clockB)]) // Making a unique list of all keys for vectorClock of users
        ]

        let aGreater = false
        let bGreater = false

        allKeys.forEach(key => {
            const a = clockA[key] || 0
            const b = clockB[key] || 0
            if (a > b) aGreater = true
            if (b > a) bGreater = true
        }) // for each key, checking the count to see which is greater

        if (aGreater && !bGreater) return "A_AFTER_B" // since A has greater count than B so A should appear after B
        if (bGreater && !aGreater) return "B_AFTER_A" // since B has greater count than A so B should appear after A
        if (!aGreater && !bGreater) return "EQUAL" // If both clock count are not greater then equal

        return "CONCURRENT" // If both clock have greater then concurrent
    },

    //Check if A happened before B
    happenedBefore: (clockA, clockB) => {
        return VectorClock.compare(clockA, clockB) === "A_BEFORE_B"
    },

    //Check if two events are concurrent
    isConcurrent: (clockA, clockB) => {
        return VectorClock.compare(clockA, clockB) === "CONCURRENT"
    }
}

export default VectorClock
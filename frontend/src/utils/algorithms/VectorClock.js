
const VectorClock = {
    compare: (clockA, clockB) => {
        const allKeys = [
            ...new Set([...Object.keys(clockA), ...Object.keys(clockB)]) // Making a unique list of all keys for vectorClock of users
        ]

        let aBeforeB = false
        let bBeforeA = false

        allKeys.forEach(key => {
            const a = clockA[key] || 0
            const b = clockB[key] || 0
                if (a < b) aBeforeB = true
            if (a > b) bBeforeA = true
        }) // for each key, checking the count to see which is greater

        if (aBeforeB && !bBeforeA) return "A_BEFORE_B" // a happened before b when all entries are less than or equal and at least one is strictly less
        if (bBeforeA && !aBeforeB) return "B_BEFORE_A"
        if (!aBeforeB && !bBeforeA) return "EQUAL" // identical clocks

        return "CONCURRENT" // if the clocks have both before truw
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
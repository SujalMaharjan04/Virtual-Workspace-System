import VectorClock from "./algorithms/VectorClock"

const insertInCasualOrder = (existingMessage, newMessage) => {
    if (existingMessage.length === 0) return [newMessage]

   //Find the correct positions for the messages
   for (let i = 0; i < existingMessage.length; i++) {
    // console.log(newMessage.sender, newMessage.vectorClock, "vs", existingMessage[i]?.sender, existingMessage[i]?.vectorClock)
    const comparison = VectorClock.compare(
        newMessage.vectorClock || {},
        existingMessage[i].vectorClock || {}
    )

    if (comparison === "A_BEFORE_B") {
        return [
            ...existingMessage.slice(0, i),
            newMessage,
            ...existingMessage.slice(i)
        ]
    }
   }

   return [...existingMessage, newMessage]
}

export default insertInCasualOrder
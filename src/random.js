let variable = null
let interestsMap = new Map()

function connectNoInterests (id) {
    let valueToReturn = null
    if (variable === null) {
        variable = id
        valueToReturn = variable
    } else {
        valueToReturn = variable
        variable = null
    }
    return valueToReturn
}

function resetAllInterests(interests) {
    for (let i=0; i<interests.length; i++){
        interestsMap.set(interests[i], undefined)
    }
    console.log(interestsMap)
}

function connectInterests (id, interests) {
    let valueToReturn = id
    for(let i=0; i<interests.length; i++){
        if(interestsMap.get(interests[i]) === undefined){
            interestsMap.set(interests[i], id)
        } else {
            valueToReturn = interestsMap.get(interests[i])
            return valueToReturn
        }
    }
    return valueToReturn
}

export { connectNoInterests, connectInterests, resetAllInterests }
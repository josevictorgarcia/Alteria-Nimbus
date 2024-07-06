let variable = null

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

export { connectNoInterests }
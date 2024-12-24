let onlineUsers = new Map()     //Username --> IP

function addOnlineUser(user, ip){
    onlineUsers.set(user, ip)
    console.log(onlineUsers)
}

function isOnline(user){
    if(onlineUsers.has(user)){
        return true
    } else {
        return false
    }
}

function getIP(user){
    return onlineUsers.get(user)
}

export { addOnlineUser, isOnline, getIP }
const users = []

//Join Users to chat
function userJoin(id, username, room, imageSrc) {
    //Create User
    const user = {id, username, room, imageSrc}

    let checker;
    users.forEach((user) => {
        if(user.username === username && user.room === room && user.imageSrc === imageSrc) {
            user.id = id
            checker = true
        }
    })

    //Push User to array of users
    if(checker != true) {
        users.push(user)
    } 
    return user
}



//function get current user
function getCurrentUser(id) {
    //find the current User
    return users.find(user => user.id === id)
}

//user leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id)

    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}

//get room users
function getRoomUsers(room) {
    //Get All Users in a room
    return users.filter(user => user.room === room)
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}
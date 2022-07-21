//Get The Body Dom
let bodyDom = document.querySelector('body')
//Get The Menu Icon for small screens
let menuIcon = document.querySelector(".chat-room-details .menu-icon")
//Get The Cancel Btn to cancel Menu Div for small screens 
let cancelMenuBtn = document.querySelector(".user-room-div .cancel-large span")
//send message Btn
const sendBtn = document.querySelector(".message-functions .send-btn")
//Message Box that contains the text message
const messageBoxInput = document.querySelector(".message-functions p .textarea")
//messageBox that contains all messages from all users and Bot
const messageBox = document.querySelector(".chat-message-div .messages-box")
//header information about the chat
const chatRoomInfo = document.querySelector(".chat-room-details .chat-room-info")
//chat room name
const chatRoomName = chatRoomInfo.querySelector('h4')
//chat room image
const chatRoomImg = chatRoomInfo.querySelector("img")
//all users in a room side bar 
const sideAllUsers = document.querySelector(".user-users-room-user .all-users-in-room")
//Get ChatsRoomUsers (A Div in the head of the room page to display all users in the current room)
const ChatsRoomUsers = document.querySelector(".chat-room-details .chat-room-users")
//The Users Info Div for username, image and active tag
const userInfoDiv = document.querySelector(".user-room-div .user-info-div")
//all rooms ul
const allRoomUl = document.querySelector(".room-rooms .room-channel-rooms")
//socket
const socket = io()


///Error Handling
///If no sessionStorage redirect to homepage
//get current User Info from sessionStorage
let currentUser = sessionStorage.getItem("username")
let currentUserRoom = sessionStorage.getItem("room")
let currentUserImage = sessionStorage.getItem('imageSrc')
if(currentUser == null || currentUserRoom == null || currentUserImage == null) {
    window.location.assign("/")
}


//Handle Toggle Menu for small screens
//Add Event Listener to menu Icon
menuIcon.addEventListener('click', ()=> {
    //Add Display Box to body Dom
    bodyDom.classList.add("display-box")
})

//Cancel Menu Div for small screens
cancelMenuBtn.addEventListener('click', ()=> {
    //Remove Display Box from body Dom
    bodyDom.classList.remove('display-box')
})

//Get The Username, Room and Image from sessionStorage
let username = sessionStorage.getItem('username')
let room = sessionStorage.getItem("room")
let imageSrc = sessionStorage.getItem("imageSrc")
//Emit to socket
socket.emit("joinRoom", {username, room, imageSrc})

//Send Message
sendBtn.addEventListener("click", ()=> {
    //Get The Message from messageBoxInput
    if(messageBoxInput.innerText != "") {
        socket.emit("chatMessage", messageBoxInput.innerText)
        messageBoxInput.innerHTML = ""
        messageBoxInput.focus()
    }
})

socket.on("message", message => {
    emitServerMessage(message)
})

socket.on("userMessage", message => {
    emitUserServerMessage(message)
})

socket.on("error", message => {
    window.location.assign("/chat.html")
})

function emitServerMessage(message) {
    //Display message gotten from the server on the Dom
    let div = document.createElement("div")
    div.classList.add("other-messages")
    //Append Div to messageBox
    messageBox.append(div)

    //Create Img Tag
    let imageTag = document.createElement("img")
    imageTag.src = `./uploads/${message.imageSrc}`
    imageTag.alt = "user profile picture"
    //Append imageTag to div
    div.append(imageTag)

    //create Message Div to hold username, time and message
    let messageDiv = document.createElement("div")
    messageDiv.classList.add("name-message-box")
    //Append Message Div to Div
    div.append(messageDiv)

    //Create usernameDiv to hold username and time
    let usernameDiv = document.createElement('div')
    usernameDiv.classList.add("username-time")
    //Append UsernameDiv to messageDiv
    messageDiv.append(usernameDiv)

    //Create Username Tag to hold the username
    let usernameTag = document.createElement("p")
    usernameTag.classList.add("username-message")
    usernameTag.innerHTML = message.username
    //Append username tag to usernameDiv
    usernameDiv.append(usernameTag)

    //create time tag to hold the time of message
    let timeTag = document.createElement("p")
    timeTag.classList.add("time-message")
    timeTag.innerHTML = message.time
    //Append timeTag to usernameDiv
    usernameDiv.append(timeTag)

    //Create chatMessageDiv to hold sentMessage
    let chatMessageDiv = document.createElement("div")
    chatMessageDiv.classList.add("message-message-box")
    chatMessageDiv.innerHTML = message.text 
    //Append chatMessageDiv to messageDiv
    messageDiv.append(chatMessageDiv)

    //Scroll Down to bottom
    messageBox.scrollTop = messageBox.scrollHeight
}

function emitUserServerMessage(message) {
    //Display message gotten from the server on the Dom
    let div = document.createElement("div")
    div.classList.add("personal-messages")
    //Append Div to messageBox
    messageBox.append(div)

    //create Message Div to hold username, time and message
    let messageDiv = document.createElement("div")
    messageDiv.classList.add("name-message-box")
    //Append Message Div to Div
    div.append(messageDiv)

    //Create usernameDiv to hold username and time
    let usernameDiv = document.createElement('div')
    usernameDiv.classList.add("username-time")
    //Append UsernameDiv to messageDiv
    messageDiv.append(usernameDiv)

    //Create Username Tag to hold the username
    let usernameTag = document.createElement("p")
    usernameTag.classList.add("username-message")
    usernameTag.innerHTML = "You"
    //Append username tag to usernameDiv
    usernameDiv.append(usernameTag)

    //create time tag to hold the time of message
    let timeTag = document.createElement("p")
    timeTag.classList.add("time-message")
    timeTag.innerHTML = message.time
    //Append timeTag to usernameDiv
    usernameDiv.append(timeTag)

    //Create chatMessageDiv to hold sentMessage
    let chatMessageDiv = document.createElement("div")
    chatMessageDiv.classList.add("message-message-box")
    chatMessageDiv.innerHTML = message.text 
    //Append chatMessageDiv to messageDiv
    messageDiv.append(chatMessageDiv)

    //Create Img Tag
    let imageTag = document.createElement("img")
    imageTag.src = `./uploads/${message.imageSrc}`
    imageTag.alt = "user profile picture"
    //Append imageTag to div
    div.append(imageTag)

    //Scroll Down to bottom
    messageBox.scrollTop = messageBox.scrollHeight
}

//Socket for room info and users
socket.on("roomUsers", ({room, users}) => {
    serverRoom(room)
    serverUsers(users)
    addUsersInfo(users)
}) 

function serverRoom(room) {
    chatRoomName.innerHTML = room
    chatRoomImg.src = `./images/${room.toLocaleLowerCase()}.png`
    chatRoomImg.alt = room
    
    //Highlight the current room in all rooms ul
    editCurrentRoom(room)
}

function editCurrentRoom(currentRoom) {
    //A Function to edit current room in all rooms ul
    //loop through all rooms Ul and remove active from all
    let children = allRoomUl.children
    for(let i = 0; i < children.length; i++) {
        children[i].classList.remove("active")
        //Get The room name
        let childrenName = children[i].querySelector("h4")
        //check if room name is equal to current room
        if(childrenName.innerHTML.toLocaleLowerCase() === currentRoom.toLocaleLowerCase()) {
            //add active if it is
            children[i].classList.add("active")
            break
        }
    }

} 

function serverUsers(users) {
    let userLi = "" 
    //get current User Info from sessionStorage
    let currentUser = sessionStorage.getItem("username")
    let currentUserRoom = sessionStorage.getItem("room")
    let currentUserImage = sessionStorage.getItem('imageSrc')
    //Loop Through users info from server
    users.forEach(user => {
        let info = ""
        if(user.username === currentUser && user.imageSrc === currentUserImage && user.room === currentUserRoom) {
            //if current user info is equal to user info add active to user info
            info += "<li class='active'>"
            //Edit userInfoDiv
            //First Get The Image Tag
            let userImage = userInfoDiv.querySelector("img")
            userImage.src = `./uploads/${user.imageSrc}`
            let username = userInfoDiv.querySelector(".user-info-info .user-username")
            username.innerHTML = user.username
        } else {
            info += "<li>"
        }
        info += `
            <img src="./uploads/${user.imageSrc}" alt="profilePicture">
            <h4>${user.username}</h4>
        </li>`
        userLi += info
    })
    //edit sideAllUsersUl to hold all users from server
    //Indicating all users in the room
    sideAllUsers.innerHTML = userLi
}

function addUsersInfo(users) {
    //A Function to add Users Info to the head of the room chat.

    //Get The Image Container
    let imageDivContainer = ChatsRoomUsers.querySelector(".image-container-img")
    let numberDivContainer = ChatsRoomUsers.querySelector(".number-count")

    if(users.length <= 3) {
        let imageHtml = ""
        users.forEach(user => {
            imageHtml += `
            <img src='./uploads/${user.imageSrc}' alt='profilePicture'>`
        })
        imageDivContainer.innerHTML = imageHtml
        numberHtml = `
        <p class="count-user">${users.length}</p>
        <p class="count-user main-count">0</p>`
        numberDivContainer.innerHTML = numberHtml
        numberDivContainer.classList.add("active")
    } else {
        let imageHtml = ""
        let userImageDiv = users.slice(0, 3) //Get The First 3 Elements in users
        userImageDiv.forEach(user => {
            imageHtml += `
            <img src='./uploads/${user.imageSrc}' alt='profilePicture'>`
        })
        imageDivContainer.innerHTML = imageHtml
        numberHtml = `
        <p class="count-user">${users.length}</p>
        <p class="count-user main-count">${users.length - 3}</p>`
        numberDivContainer.innerHTML = numberHtml
        numberDivContainer.classList.remove("active")
    }
}

//Scroll Down to bottom
messageBox.scrollTop = messageBox.scrollHeight
const container = document.querySelector(".container") //The Body Container
const form = document.querySelector(".main-main-design form")
//Get The username
const username = form.querySelector("#username-id")
//Get The Room
const roomInput = document.querySelector("form #room")
//Select Tag To Pick A room
const optionMenu = document.querySelector(".select-menu"),
selectBtn = optionMenu.querySelector(".select-btn")
//Options Tag for various room
options = optionMenu.querySelectorAll(".option")
//Text Tag to hold room picked
sBtn_text = optionMenu.querySelector(".sBtn-text");
//Get The Profile Picture
const profilePicture = form.querySelector(".image-wrapper #image-file")
//Get The Profile Picture wrapper
const profileWrapper = form.querySelector(".image-wrapper")
//Get the preview profile picture box
const previewProfileBox = form.querySelector(".preview-wrapper .preview-image img")

selectBtn.addEventListener("click", () => {
  selectBtn.classList.remove("error")
  optionMenu.classList.toggle("active")
  window.scrollTo({
    top: container.scrollHeight,
    behavior: 'smooth'
  });
});

options.forEach((option) => {
  option.addEventListener("click", () => {
    let selectedOption = option.querySelector("h4").innerText;
    sBtn_text.innerText = selectedOption;
    roomInput.value = selectedOption;
    optionMenu.classList.remove("active");
  });
});


username.addEventListener('click', ()=> {
  username.classList.remove("error")
})

form.addEventListener("submit", async(e)=> {
  e.preventDefault()
  let file = profilePicture.files[0] 
  let type;
  if(file != undefined) {
    type = file.type.split("/")[0] //Get The File Type
  } else type = "video"
  if (username.value == "" && roomInput.value == "" && (file == undefined || type != "image")) {
    username.classList.add("error")
    selectBtn.classList.add("error")
    profileWrapper.classList.add("error")
    e.preventDefault()
  }else if(username.value == "") {
    username.classList.add("error")
    e.preventDefault()
  } else if(roomInput.value == "") {
    selectBtn.classList.add("error")
    e.preventDefault()
  } else if(file == undefined || type != "image") {
    e.preventDefault()
    profileWrapper.classList.add("error")
  } else {
    const form = new FormData()
    form.append('username', username.value)
    form.append("room", roomInput.value)
    form.append("image-file", file)
    let {data} = await axios.post("/upload", form)
    console.log(data)
    sessionStorage.setItem("username", username.value)
    sessionStorage.setItem("room", roomInput.value)
    sessionStorage.setItem("imageSrc", data)
    window.location.assign('/chat.html')
  }
})

//Add EventListener to file Upload
profilePicture.addEventListener('change', ()=> {
  let file = profilePicture.files[0]
  console.log(file, file.type.includes("image"))
  if(file.type.includes("image")) {
    profileWrapper.classList.add("uploaded")
    //create a bob file
    let blobURL = URL.createObjectURL(file) //convert it to a blob
    // let type = file.type.split("/")[0] //Get The File Type
    previewProfileBox.src = blobURL
  } else {
    profileWrapper.classList.remove("uploaded")
  }
})

console.log(profilePicture.files)
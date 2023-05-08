const rightContainer = document.querySelector(".right");
async function removeUserFromScreen(id){
  console.log(id)
  const usersContainer = rightContainer.querySelector(".users-list");
  const userLi = document.querySelectorAll(`.user`)
  userLi.forEach(item=>{
    if(item.id === id){
      item.remove();
    }
    
  })
 // console.log(userLi)
  
}
async function removeUserFromGroup(userId, groupId) {
  const token = localStorage.getItem("token");

  console.log("this is the user id", userId);
  const removeUser = await axios.delete(
    "http://localhost:3000/groups/removeuser",
    {
      headers: { Authorization: token },
      data: { userId, groupId },
    }
  );
  console.log(removeUser);
  removeUserFromScreen(userId)
  alert(`${removeUser.data.massage}`);
}

async function makeAdmin(userId, groupId) {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    const makeAdmin = await axios.put(
      "http://localhost:3000/groups/makeadmin",
      { userId, groupId },
      { headers: { Authorization: token } }
    );
    alert(`${makeAdmin.data.massage}`);
  } catch (error) {
    alert(error.response.data.massage);
  }
}

async function getGroupMessages(clickedGroup) {
  const token = localStorage.getItem("token");
  const getGroupMsg = await axios.get("http://localhost:3000/groups/groupmsg", {
    params: { clickedGroup },
  });
  console.log(getGroupMsg.data.getMsg[0].user.username)
  const messagesContainer = centerContainer.querySelector(".messages");
  messagesContainer.innerHTML = "";
  const getmsg = getGroupMsg.data.getMsg;
  getmsg.forEach((msg) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.innerHTML =
      '<div class="message-content">' +`${msg.user.username} : ${msg.groupmsg}` + "</div>";
    messagesContainer.appendChild(messageElement);
  });

  const getUsers = await axios.get("http://localhost:3000/groups/users", {
    params: { clickedGroup },
    headers: { Authorization: token },
  });
  const usersContainer = rightContainer.querySelector(".users-list");
  usersContainer.innerHTML = "";
  const getUsersData = getUsers.data.users;
  //console.log(getUsersData)
  getUsersData.forEach((user) => {
    const userElement = document.createElement("li");
    userElement.classList.add("user");
    userElement.id = `${user.id}`;
    userElement.innerHTML = user.username;
    userElement.addEventListener("click", async (event) => {
      const clickedUser = event.target.getAttribute("id");
      const options = ["Make Admin", "Remove User"];
      const confirmation = confirm(
        `Do you want to make ${clickedUser} an admin or remove them from the group?`
      );

      if (confirmation) {
        const selectedOption = prompt(
          `What action do you want to perform for ${clickedUser}? (Type "admin" or "remove")`
        );

        if (selectedOption === "admin") {
          await makeAdmin(clickedUser, clickedGroup);
        } else if (selectedOption === "remove") {
          await removeUserFromGroup(clickedUser, clickedGroup);
        } else {
         
          alert("Invalid option selected. Please try again.");
        }
      }
    });
    usersContainer.appendChild(userElement);
  });

  console.log(`Switching to group "${clickedGroup}"`);
}

async function postGroupMessage(event, clickedGroup) {
  event.preventDefault();
  const message = inputElement.value;
  const token = localStorage.getItem("token");
  const response = await axios.post(
    "http://localhost:3000/groups/groupmsg",
    { message, id: clickedGroup },
    { headers: { Authorization: token } }
  );
  const user =response.data.user.username
  const msg = response.data.groupmsg;
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.innerHTML =
    '<div class="message-content">' +`${user} : ${message}`+ "</div>";
  centerContainer.querySelector(".messages").appendChild(messageElement);
  inputElement.value = "";
}

async function addUserToGroup(groupId) {
  try {
    const invite = document.getElementById("invite");
    invite.addEventListener("click", async (e) => {
      e.preventDefault();
      const email = prompt("add email adress");
      const emailRegex = /\S+@\S+\.\S+/;
      if (email && emailRegex.test(email)) {
        const response = await axios.post(
          `http://localhost:3000/groups/adduser`,
          { email, groupId }
        );
        console.log(response.data);
        const usersContainer = rightContainer.querySelector(".users-list");
        const userElement = document.createElement("li");
        userElement.classList.add("user");
        userElement.id = `${response.data.user.id}`;
        userElement.innerHTML += `${response.data.user.username}`;
        userElement.addEventListener("click", async (event) => {
          const clickedUser = event.target.getAttribute("id");
          const options = ["Make Admin", "Remove User"];
          const confirmation = confirm(
            `Do you want to make ${clickedUser} an admin or remove them from the group?`
          );
    
          if (confirmation) {
            const selectedOption = prompt(
              `What action do you want to perform for ${clickedUser}? (Type "admin" or "remove")`
            );
    
            if (selectedOption === "admin") {
              await makeAdmin(clickedUser, groupId);
            } else if (selectedOption === "remove") {
              await removeUserFromGroup(clickedUser, groupId);
            } else {
              
              alert("Invalid option selected. Please try again.");
            }
          }
        });
        usersContainer.appendChild(userElement);
        
      } else {
        alert("Invalid email address");
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function createGroupList() {
 
    const token = localStorage.getItem("token");
  const getAllGroups = await axios.get("http://localhost:3000/groups/group", {
    headers: { Authorization: token },
  });
  const allGroups = getAllGroups.data.getGroups;
  const groupUl = document.querySelector("#group");
 
  
  allGroups.forEach((group) => {
    const newLi = document.createElement("li");
    newLi.classList.add("group-item");
    newLi.textContent = group.groupname;
    newLi.setAttribute("data-group", group.groupname);
    newLi.id = `${group.id}`;
    newLi.addEventListener("click", async (event) => {
      const clickedGroup = event.target.getAttribute("id");
      await addUserToGroup(clickedGroup);
      await getGroupMessages(clickedGroup);
      buttonElement.addEventListener("click", (event) =>
        postGroupMessage(event, clickedGroup)
      );
    });
    groupUl.appendChild(newLi);
  });
  
}

function initialize() {
  centerContainer = document.querySelector(".middle");
  inputElement = document.querySelector("input[type=text]");
  buttonElement = document.querySelector("button");
  createGroupList();
}

window.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  initialize();
});

const backtochat = document.getElementById('backtochat')
backtochat.addEventListener('click', async(e)=>{
  e.preventDefault();
  window.location.href = 'index.html'
})

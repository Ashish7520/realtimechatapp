var rightContainer = document.querySelector(".right");


var inputElement = document.querySelector("input[type=text]");
var buttonElement = document.querySelector("button");


const groupUl = document.querySelector(".group-list");



window.addEventListener("DOMContentLoaded", async (event) => {
  event.preventDefault();
  const getAllGroups = await axios.get("http://localhost:3000/groups/group");
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
      const getGroupMsg = await axios.get(
        "http://localhost:3000/groups/groupmsg"
      , { params: { clickedGroup } });
      //console.log('this is what i want', getGroupMsg)
      const messagesContainer = rightContainer.querySelector(".messages");
      messagesContainer.innerHTML = '';
      const getmsg = getGroupMsg.data.getMsg;
      getmsg.forEach((msg) => {
        var messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.innerHTML =
          '<div class="message-content">' + msg.groupmsg + "</div>";
        rightContainer.querySelector(".messages").appendChild(messageElement);
      });
      console.log(`Switching to group "${clickedGroup}"`);
      const id = clickedGroup
      buttonElement.addEventListener("click", async function (event) {
        event.preventDefault();
        
      
        var message = inputElement.value;
        const token = localStorage.getItem("token");
        
      
        const response = await axios.post(
          "http://localhost:3000/groups/groupmsg",
          {
            message,id
          },
          { headers: { Authorization: token } }
        );
        
        const msg = response.data.groupmsg;
      
        var messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.innerHTML =
          '<div class="message-content">' + message + "</div>";
        rightContainer.querySelector(".messages").appendChild(messageElement);
      
       
        inputElement.value = "";
      });
    });
    groupUl.appendChild(newLi);
  });
});



// groupItems.forEach(function (groupItem) {
//   groupItem.addEventListener("click", function () {
//     // Retrieve selected group name from data attribute
//     var groupName = groupItem.getAttribute("data-group");

//     // Remove active class from all group items
//     groupItems.forEach(function (item) {
//       item.classList.remove("active");
//     });

//     // Add active class to selected group item
//     groupItem.classList.add("active");

//     // Set the group name in the right container
//     rightContainer.querySelector(".group-name").textContent = groupName;

//     // Clear the messages in the right container
//     rightContainer.querySelector(".messages").innerHTML = "";
//   });
// });

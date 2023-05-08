async function showmsg(event) {
  event.preventDefault();
  const massage = event.target.massage.value;
 // console.log(massage);
  const token = localStorage.getItem("token");
  const body = {
    massage: event.target.massage.value,
  };

  const response = await axios.post(
    "http://localhost:3000/massages/chatbox",
    body,
    { headers: { Authorization: token } }
  );
  const msg = response.data.massages.massage
  const username = response.data.username
  const ul = document.getElementById("spaceformsg");
  ul.innerHTML += `<h5>${username}: ${msg}</h5>`;
  event.target.massage.value = ''
  event.target.massage.focus()
}


window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const ul = document.getElementById("spaceformsg");
  
  //setInterval(async () => {
    ul.innerHTML = "";
    const users = await axios.get("http://localhost:3000/user/loggeduser", {
      headers: { Authorization: token },
    });
    const newUser = users.data.users;
    newUser.forEach((users) => {
      const onlineUsers = `${users.username} is online`;
      const ul = document.getElementById("spaceformsg");
      ul.innerHTML += `<h5>${onlineUsers}</h5>`;
    });

    
    const getMsgFromLs = localStorage.getItem('massage')
    const parsedMsg = JSON.parse(getMsgFromLs)
    console.log(parsedMsg)
    let lastObjId
    if(parsedMsg == null || undefined){
     lastObjId = 0
    }else{
      lastObjId = parsedMsg[parsedMsg.length - 1].id
    }
    console.log(lastObjId)


    const userMsg = await axios.get(`http://localhost:3000/massages/chatbox?id=${lastObjId}`, {
      headers: { Authorization: token },
    });
    
    const getFromLs =localStorage.getItem('massage')
    const parsedGetFromLs = JSON.parse(getFromLs)
    const msg = userMsg.data.msg;
    const mergedArray = parsedGetFromLs.concat(msg)
    if(mergedArray[mergedArray.length-1].id > 1000){
        mergedArray.slice(-1000)
        localStorage.setItem('massage', JSON.stringify(mergedArray))
      }else{
        localStorage.setItem('massage', JSON.stringify(mergedArray))
      }
    console.log('this is what i need', mergedArray)
    //const stringifyMsg = JSON.stringify(msg)

     //localStorage.setItem('massage', JSON.stringify(msg))
  //  const getMsgFromLs = localStorage.getItem('massage')
  //  const parsedarray = JSON.parse(getMsgFromLs)
  //  const lastobj = parsedarray[parsedarray.length-1].id
  //  console.log(lastobj)
  // const mergedArray = getMsgFromLs.concat(msg)
  // if(mergedArray[mergedArray.length-1].id > 1000){
  //   mergedArray.slice(-1000)
  //   localStorage.setItem('massage', JSON.stringify(mergedArray))
  // }else{
  //   localStorage.setItem('massage', JSON.stringify(mergedArray))
  // }

const lastmsg = localStorage.getItem('massage')
const parsedlast10msg = JSON.parse(lastmsg)
const last10msg = parsedlast10msg.slice(-10)
console.log("last10msg",last10msg)
  

last10msg.forEach((item) => {
      const msg = item.massage;
      const username = item["user.username"];
     // console.log(username, msg);
      const ul = document.getElementById("spaceformsg");
      ul.innerHTML += `<h5>${username}: ${msg}</h5>`;
    });
 // }, 1000);
});


const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  //console.log(token);
  const logout = await axios.post("http://localhost:3000/user/logout", null, {
    headers: { Authorization: token },
  });
  const username = logout.data.username
  if (logout.data.success == true) {
    localStorage.setItem("token", logout.data.token);
    alert("user logged out successfully");
    window.location.href = "login.html";
  }
});

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}


const creategroup = document.getElementById('createGroup')
creategroup.addEventListener('click', async(e)=>{
   e.preventDefault();
   const groupName = prompt("Please enter the group name:", "");
   
   if(groupName.length === 0||null|| undefined){
    alert('group name is minimum of one character')
   }else{
    const token = localStorage.getItem('token')
    const postgroup =await axios.post('http://localhost:3000/groups/group', {groupName},{headers:{ Authorization: token}})
    console.log(postgroup)
    window.location.href = 'group.html'
   }
})

const getGroups = document.getElementById('showgroup')
getGroups.addEventListener('click',async(e)=>{
  e.preventDefault();
  window.location.href='group.html'
})


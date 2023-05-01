async function showmsg(event) {
  event.preventDefault();
  const massage = event.target.massage.value;
  console.log(massage);
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
  
  setInterval(async () => {
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

    const userMsg = await axios.get("http://localhost:3000/massages/chatbox", {
      headers: { Authorization: token },
    });
    const msg = userMsg.data.msg;
    msg.forEach((item) => {
      const msg = item.massage;
      const username = item["user.username"];
      console.log(username, msg);
      const ul = document.getElementById("spaceformsg");
      ul.innerHTML += `<h5>${username}: ${msg}</h5>`;
    });
  }, 1000);
});


const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  console.log(token);
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

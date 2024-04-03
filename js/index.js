var loginBtn = document.getElementById("loginBtn")
loginBtn.addEventListener("click",function(){redirect()})

async function redirect(){
    window.location.replace("../pages/home.html");
}

document.addEventListener("DOMContentLoaded", function() {

    displayLogoutMessage();
});


// Call this function when the user logs out
function displayLogoutMessage() {
    var logoutMessage = document.getElementById("logoutMessage");
    logoutMessage.style.display = "block";
    
    clearStorage();

}



function clearStorage(){
    
    // Clear session storage
    sessionStorage.clear();

    // Clear local storage
    localStorage.clear();

    // setTimeout is a built-in JavaScript function used to execute a specified function 
    // after a specified delay (in milliseconds).
    setTimeout(redirect(), 12000000);
}

function redirect() {
    
    // After signing out, redirect to the dashboard
    
    window.location.href = '../../pages/index.html';
    alert("signed out")
}
document.getElementById("sign-in-btn").addEventListener("click", function () {
  // Get the UserName & Passwword

  const userName = document.getElementById("Username").value.trim();
  const userPassword = document.getElementById("password").value.trim();

  if (userName === "admin" && userPassword === "admin123") {
    alert("Login Success");
    window.location.assign("/home.html");
  }
  else {
    alert("log In failed");
    return;
  }
});

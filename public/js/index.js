function check() {
    form = document.getElementById("loginform")
    let login = form.children[0].value
    let password = form.children[1].value
    let button = form.children[3].children[0]
    
    if(login.length > 0 && password.length > 0) {
        button.classList.add("btn-active")
        button.disabled = false
    } else {
        button.classList.remove("btn-active")
        button.disabled = true
    }
}

function RedirectRegister(){
    window.location.href = "/signup";
}

function RedirectLogin(){
    window.location.href = "/login";
}

function SendRegister(){
    document.getElementById("RegisterForm").submit();
}

function NextRegister(){
    document.getElementById("floatLeft").style.display="none";
    document.getElementById("floatRight").style.display="block";
}

function BackRegister(){
    document.getElementById("floatLeft").style.display="block";
    document.getElementById("floatRight").style.display="none";
}

function closeAlert(){
    document.getElementById("alert").style.display="none";
    document.getElementById("alertGreen").style.display="none";
}

function LoadingRegister(){
    //You may use special effects for each loading
    //for example integrity check
    document.getElementById("registerform").submit();
    document.getElementById("login-body").style.display="none";
    document.getElementById("loading").style.display="block";
}

function LoadingLogin(){
    //You may use special effects for each loading
    //for example integrity check
    document.getElementById("login-body").style.display="none";
    document.getElementById("loading").style.display="block";
}
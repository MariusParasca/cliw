function initPage() {
    setBarEventListeners();
}

function setBarEventListeners() {
    document.getElementsByClassName("dropdownContent")[0].addEventListener("mouseover", maitainMenuHover);
    document.getElementsByClassName("dropdownContent")[0].addEventListener("mouseout", disableMenuHover);
    document.getElementsByClassName("menuLink")[0].addEventListener("mouseover", maitainMenuHover);
    document.getElementsByClassName("menuLink")[0].addEventListener("mouseout", disableMenuHover);
    document.getElementById("navUser").addEventListener("mouseover", maitainUserNameHover);
    document.getElementById("navUser").addEventListener("mouseout", disableUserNameHover);
    document.getElementsByClassName("userName")[0].addEventListener("mouseover", maitainUserNameHover);
    document.getElementsByClassName("userName")[0].addEventListener("mouseout", disableUserNameHover)
}

function maitainMenuHover() {
    document.getElementById("navMenu").style.backgroundImage ="url('./all_icons/menu_gray_40px.png')";
}

function disableMenuHover() {   
    document.getElementById("navMenu").style.backgroundImage = "url('./all_icons/menu_40px.png')";
}

function maitainUserNameHover() {
    document.getElementById("navUser").style.backgroundImage = "url('./all_icons/user_avatar_gray_40px.png')"
    document.getElementsByClassName("userName")[0].style.color = "#bbbbbb"
}

function disableUserNameHover() {
    document.getElementById("navUser").style.backgroundImage = "url('./all_icons/user_avatar_white_40px.png')"
    document.getElementsByClassName("userName")[0].style.color = "#ffffff"
}

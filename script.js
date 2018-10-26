window.onload = function () {
    if ((location.href.split("/").slice(-1) == "accessory_page_list.html")) {
        onLoadAccessoryPage();
    } else {
        onLoadPage();
    }
};

//------------------------ Tool bar ------------------------//
function onLoadPage() {
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
    document.getElementById("navMenu").style.backgroundImage ="url('./Icons/menu_gray_40px.png')";
}

function disableMenuHover() {   
    document.getElementById("navMenu").style.backgroundImage = "url('./Icons/menu_40px.png')";
}

function maitainUserNameHover() {
    document.getElementById("navUser").style.backgroundImage = "url('./Icons/user_avatar_gray_40px.png')"
    document.getElementsByClassName("userName")[0].style.color = "#bbbbbb"
}

function disableUserNameHover() {
    document.getElementById("navUser").style.backgroundImage = "url('./Icons/user_avatar_white_40px.png')"
    document.getElementsByClassName("userName")[0].style.color = "#ffffff"
}

//------------------------ Accessory Page ------------------------//

function onLoadAccessoryPage() {
    document.getElementById("navUser").addEventListener("mouseover", maitainUserNameHover);
    document.getElementById("navUser").addEventListener("mouseout", disableUserNameHover);
    document.getElementsByClassName("userName")[0].addEventListener("mouseover", maitainUserNameHover);
    document.getElementsByClassName("userName")[0].addEventListener("mouseout", disableUserNameHover)
}
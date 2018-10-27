window.onload = function () {
    if ((location.href.split("/").slice(-1) == "accessory_page_list.html")) {
        onLoadAccessoryPage();
    } else if ((location.href.split("/").slice(-1) == "item_page.html")) {
        onLoadItemPage();
        onLoadPage();
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
    document.getElementById("navMenu").style.backgroundImage ="url('./icons/menu_gray_40px.png')";
}

function disableMenuHover() {   
    document.getElementById("navMenu").style.backgroundImage = "url('./icons/menu_40px.png')";
}

function maitainUserNameHover() {
    document.getElementById("navUser").style.backgroundImage = "url('./icons/user_avatar_gray_40px.png')"
    document.getElementsByClassName("userName")[0].style.color = "#bbbbbb"
}

function disableUserNameHover() {
    document.getElementById("navUser").style.backgroundImage = "url('./icons/user_avatar_white_40px.png')"
    document.getElementsByClassName("userName")[0].style.color = "#ffffff"
}

//------------------------ Accessory Page ------------------------//

function onLoadAccessoryPage() {
    setAccesoryEventListeners();
}

function setAccesoryEventListeners() {
    document.getElementById("navUser").addEventListener("mouseover", maitainUserNameHover);
    document.getElementById("navUser").addEventListener("mouseout", disableUserNameHover);
    document.getElementsByClassName("userName")[0].addEventListener("mouseover", maitainUserNameHover);
    document.getElementsByClassName("userName")[0].addEventListener("mouseout", disableUserNameHover);
}

//------------------------ Item Page ------------------------//

function onLoadItemPage() {
    setItemEventListeners();
}

function setItemEventListeners() {
    document.getElementsByClassName("addToCart")[0].addEventListener("mouseover", enableCartImgHover);
    document.getElementsByClassName("addToCart")[0].addEventListener("mouseout", disableCartImgHover);
    document.getElementById("tryIt").addEventListener("mouseover", enableHatImgHover);
    document.getElementById("tryIt").addEventListener("mouseout", disableHatImgHover);
    document.getElementById("tryIt").addEventListener("click", changeToWebCam);
    document.getElementById("backToItem").addEventListener("click", backToItemPage);
}

function enableCartImgHover() {
    document.getElementById("imgCart").style.backgroundImage = "url('./icons/cart_black_40x35px.png')"
}

function disableCartImgHover() {
    document.getElementById("imgCart").style.backgroundImage = "url('./icons/cart_gray_40x35px.png')"
}

function enableHatImgHover() {
    document.getElementById("imgHat").style.backgroundImage = "url('./icons/hat_black_40px.png')"
}

function disableHatImgHover() {
    document.getElementById("imgHat").style.backgroundImage = "url('./icons/hat_gray_40px.png')"
}

function changeToWebCam() {
    document.getElementById("mainItemPage").style.display = "none";
    document.getElementById("mainWebcamPage").style.display = "flex";
    document.getElementById("itemPageFooter").style.display = "none";
    document.getElementById("bodyItemPage").style.overflow = "hidden";
    
}

function backToItemPage() {
    document.getElementById("mainItemPage").style.display = "flex";
    document.getElementById("mainWebcamPage").style.display = "none";
    document.getElementById("itemPageFooter").style.display = "inline-block";
    document.getElementById("bodyItemPage").style.overflow = "auto";
}
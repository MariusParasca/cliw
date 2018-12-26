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

//------------------------ Firebase ------------------------//

var config = {
    apiKey: "AIzaSyBHnTWJNR2XeCF9lwpqA4H-65cXcC5ackQ",
    authDomain: "cliw-c5b4b.firebaseapp.com",
    databaseURL: "https://cliw-c5b4b.firebaseio.com",
    projectId: "cliw-c5b4b",
    storageBucket: "cliw-c5b4b.appspot.com",
    messagingSenderId: "330716252761"
};
firebase.initializeApp(config);
const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);
const db = firebase.firestore();
const storage = firebase.storage();

//------------------------ COMMON ------------------------//

//db.collection("beanie").get().then(test);
// function test(querySnapshot){
//     querySnapshot.forEach((doc) => {
//         console.log(doc);
//     });
// }

const SITE_FOLDER = 'site/'
function addElementsToContainer(container, doc, category) {
    let div = document.createElement('DIV');
    container.appendChild(div);
    div.setAttribute("class", "lastAccessoryAdded");

    let a = document.createElement('A');
    a.setAttribute("class", "accessoryLink");
    a.setAttribute("href", "#item_page?name=" + doc.data().name + "&&category=" + category);
    div.appendChild(a);

    let img = document.createElement('IMG');
    img.setAttribute("class", "lastAccessoryImage");
    img.setAttribute("alt", doc.data().name);
    renderImage(img, doc);

    a.appendChild(img);
    let p = document.createElement('P');
    p.setAttribute("class", "accessoryTitle");
    p.innerHTML = doc.data().name;
    a.appendChild(p);
}

function renderImage(img, doc) {
    let imgPath = SITE_FOLDER + doc.data().img_name;
    let imageSource = null; //localStorage.getItem(imgPath);

    if (imageSource === null) {
        storage.ref(imgPath).getDownloadURL().then(
            (url) => {
                // let xhr = new XMLHttpRequest();
                // xhr.responseType = 'blob';
                // xhr.onload = (event) => {
                //     let blob = xhr.response;
                //     let dataURL = URL.createObjectURL(blob);
                //     // img.setAttribute("src", dataURL);
                //     // localStorage.setItem(imgPath, dataURL);
                // };
                // xhr.open('GET', url);
                // xhr.send();
                img.setAttribute("src", url);
                // localStorage.setItem(imgPath, url);
            }
        );
    } else {
        img.setAttribute("src", imageSource);
    }
}

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
    //document.getElementById("bodyItemPage").style.overflow = "hidden";
    
}

function backToItemPage() {
    document.getElementById("mainItemPage").style.display = "flex";
    document.getElementById("mainWebcamPage").style.display = "none";
    document.getElementById("itemPageFooter").style.display = "inline-block";
    document.getElementById("bodyItemPage").style.overflow = "auto";
}
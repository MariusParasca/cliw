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

const SITE_FOLDER = 'site/';
const WEB_FOLDER = 'web/';
const WEBCAM_FOLDER = 'webcam/'
const FAVORITE = "favorite_";
const CART = "cart_";

function addElementsToContainer(container, doc, category) {
    let div = document.createElement('DIV');
    container.appendChild(div);
    div.setAttribute("class", "lastAccessoryAdded");
    div.setAttribute("imtepscope", "");
    div.setAttribute("itemptype", "https://schema.org/Offer");

    let a = document.createElement('A');
    a.setAttribute("class", "accessoryLink");
    a.setAttribute("href", "#item_page?name=" + doc.data().name + "&&category=" + category);
    div.appendChild(a);

    let img = document.createElement('IMG');
    img.setAttribute("alt", category + ":" + doc.data().name);
    img.setAttribute("itemprop", "image");

    img.style.height = "200px";
    img.style.width = "200px";
    img.style.visibility = "hidden";
    img.onload = () => {
        img.style.visibility = "visible";
        img.style.objectFit = "contain";
        img.setAttribute("class", "lastAccessoryImage");
    }

    renderImage(img, doc);

    a.appendChild(img);
    let p = document.createElement('P');
    p.setAttribute("class", "accessoryTitle");
    p.setAttribute("itemprop", "name");
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

function toFirstUpperAndSpaceBetween(string) {
    let aux = string.replace('_', ' ');
    return aux.charAt(0).toUpperCase() + aux.slice(1);
}

function renderCategoriesContainer(querySnapshot) {
    querySnapshot.forEach((doc) => {
        let categories = doc.data().categories;
        renderCategories(categories.sort(), this.container);
    });
}

function renderCategories(categories, container) {
    let ul = document.createElement('UL');
    let li = document.createElement('LI');
    let a = document.createElement('A');
    a.href = "#accessory_page_list?category=all_categories";
    a.innerText = "All Categories";
    li.appendChild(a);
    ul.appendChild(li);
    for (let category of categories) {
        li = document.createElement('LI');
        a = document.createElement('A');
        a.href = "#accessory_page_list?category=" + category;
        a.innerText = toFirstUpperAndSpaceBetween(category);
        li.appendChild(a);
        ul.appendChild(li);
    }
    container.appendChild(ul);
}

function addHeartHoverStyle(mouseOnimgURL, mouseOutImgURL, container) {
    container.addEventListener("mouseover", (event) => {
        container.style.backgroundImage = mouseOnimgURL;
    });
    container.addEventListener("mouseout", (event) => {
        container.style.backgroundImage = mouseOutImgURL;
    });
}

function toggleFavoriteItem(container, img, unfilledHeartImgPath, filledHeartImgPath, secondContainer) {
    let isFavorite = localStorage.getItem(FAVORITE + img.alt);
    if (isFavorite == null) {
        container.style.backgroundImage = filledHeartImgPath;
        localStorage.setItem(FAVORITE + img.alt, img.alt);
        addHeartHoverStyle(unfilledHeartImgPath, filledHeartImgPath, container);
        if (secondContainer !== undefined) {
            secondContainer.style.backgroundImage = filledHeartImgPath;
            addHeartHoverStyle(unfilledHeartImgPath, filledHeartImgPath, secondContainer);
        }
    } else {
        container.style.backgroundImage = unfilledHeartImgPath;
        localStorage.removeItem(FAVORITE + img.alt);
        addHeartHoverStyle(filledHeartImgPath, unfilledHeartImgPath, container);
        if (secondContainer !== undefined) {
            secondContainer.style.backgroundImage = unfilledHeartImgPath;
            addHeartHoverStyle(filledHeartImgPath, unfilledHeartImgPath, secondContainer);
        }
    }
}

//------------------------ Index ------------------------//
function getAndRenderCategories() {
    container = document.getElementsByClassName("dropdownContent")[0];
    containerBox = document.getElementsByClassName("dropdown")[0];
    if (containerBox.style.display == 'none' || container.children.length == 1) {
        db.collection("categories").get().then(renderCategoriesContainer.bind({ container: container }));
    }
}

//------------------------ Tool bar ------------------------//

function setBarEventListeners() {
    document.getElementsByClassName("dropdown")[0].style.display = "block";
    document.getElementsByClassName("dropdownContent")[0].addEventListener("mouseover", maitainMenuHover);
    document.getElementsByClassName("dropdownContent")[0].addEventListener("mouseout", disableMenuHover);
    document.getElementsByClassName("menuLink")[0].addEventListener("mouseover", maitainMenuHover);
    document.getElementsByClassName("menuLink")[0].addEventListener("mouseout", disableMenuHover);
    document.getElementById("navUser").addEventListener("mouseover", maitainUserNameHover);
    document.getElementById("navUser").addEventListener("mouseout", disableUserNameHover);
}

function maitainMenuHover() {
    document.getElementById("navMenu").style.backgroundImage = "url('./all_icons/menu_gray_40px.png')";
}

function disableMenuHover() {
    document.getElementById("navMenu").style.backgroundImage = "url('./all_icons/menu_40px.png')";
}

function maitainUserNameHover() {
    document.getElementById("navUser").style.backgroundImage = "url('./all_icons/user_avatar_gray_40px.png')"
}

function disableUserNameHover() {
    document.getElementById("navUser").style.backgroundImage = "url('./all_icons/user_avatar_white_40px.png')"
}

//db.collection("beanie").get().then(test);
// function test(querySnapshot){
//     querySnapshot.forEach((doc) => {
//         console.log(doc);
//     });
// }

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    return canvas.toDataURL();
}

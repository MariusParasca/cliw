export function initPage(params) {
    setAccesoryEventListeners();
    getDataFromDB();
    if (params['category'] != 'all_categories') {
        db.collection(params['category']).orderBy("name").get().then(renderItems.bind({ category: params['category'] }));
    }
}

const unfilledHeartImgPath = 'url("./all_icons/circle_red_heart_30px.png")';
const filledHeartImgPath = 'url("./all_icons/circle_red_heart_filled_30px.png")';

function setAccesoryEventListeners() {
    document.getElementsByClassName("dropdown")[0].style.display = "none";
    document.getElementById("navUser").addEventListener("mouseover", maitainUserNameHover);
    document.getElementById("navUser").addEventListener("mouseout", disableUserNameHover);
    document.getElementsByClassName("userName")[0].addEventListener("mouseover", maitainUserNameHover);
    document.getElementsByClassName("userName")[0].addEventListener("mouseout", disableUserNameHover);
}

function getDataFromDB() {
    let container = document.getElementsByClassName("categories")[0];
    db.collection("categories").get().then(renderCategoriesContainer.bind({container: container}));
}

function renderItems(querySnapshot) {
    let container = document.getElementsByClassName("accesoryItemsList")[0];
    querySnapshot.forEach((doc) => {
        addAccessoryItem(container, doc, this.category);
    });
}

function toggleFavoriteItemOnAccessoryListPage(event) {
    let container = event.target;
    let img = container.parentElement.firstChild.firstChild;
    toggleFavoriteItem(container, img, unfilledHeartImgPath, filledHeartImgPath);
}

function initIfItemLoved(key, tag, background) {
    let localKeys = Object.keys(localStorage);
    for (let localKey of localKeys) {
        if (localKey ==  FAVORITE + key) {
            tag.style.backgroundImage = background;
        }
    }
}

function addAccessoryItem(container, doc, category) {
    let div = document.createElement('DIV');
    div.setAttribute("class", "accesoryItem");
    container.appendChild(div);

    let a = document.createElement('A');
    a.setAttribute("class", "accessoryLink");
    a.setAttribute("href", "#item_page?name=" + doc.data().name + "&&category=" + category);
    div.appendChild(a);

    let img = document.createElement('IMG');
    img.setAttribute("class", "accessoryImage");
    img.setAttribute("alt", category + ":" + doc.data().name);
    a.appendChild(img);
    renderImage(img, doc);

    let p = document.createElement('P');
    p.setAttribute("class", "accessoryTitle");
    p.innerHTML = doc.data().name;
    a.appendChild(p);

    let itemHeart = document.createElement('DIV');
    itemHeart.setAttribute("class", "itemHeart");
    itemHeart.setAttribute("id", img.alt);
    itemHeart.addEventListener("click", toggleFavoriteItemOnAccessoryListPage);
    div.appendChild(itemHeart);
    initIfItemLoved(img.alt, itemHeart, filledHeartImgPath);

    let price = document.createElement('P');
    price.setAttribute("class", "accesoryPrice");
    price.innerHTML = doc.data().price;
    div.appendChild(price);
}




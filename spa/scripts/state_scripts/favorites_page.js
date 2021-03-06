export function initPage(params) {
    addFavoriteItems();
    setBarEventListeners();
    getAndRenderCategories();
}

function addFavoriteItems() {
    let localKeys = Object.keys(localStorage);
    let container = document.getElementsByClassName("favoritesItemsList")[0];
    let foundFavorites = false;
    for (let localKey of localKeys) {
        if (localKey.includes(FAVORITE)) {
            foundFavorites = true;
            let data = localStorage[localKey].split(":");
            db.collection(data[0]).where("name", "==", data[1].replace(/_/g, ' '))
                .limit(1).get().then(function (querySnapshot) {
                    querySnapshot.forEach((doc) => {
                        addFavoriteItem(container, doc, this.category);
                    });
                }.bind({ category: data[0] }));
        }
    }
    if (!foundFavorites) {
        showEmptyMessage();
    }
}

function deleteFavoriteItem(event) {
    let currentElement = event.target;
    let localKey = FAVORITE + currentElement.id;
    let favoriteLocalItem = localStorage.getItem(localKey);
    if (favoriteLocalItem != null) {
        localStorage.removeItem(localKey);
        let favoriteItemsContainer = currentElement.parentElement.parentElement;
        let favoriteItem = currentElement.parentElement;
        favoriteItemsContainer.removeChild(favoriteItem)
    }
    let favoritesItemsListElement = document.getElementsByClassName("favoritesItemsList")[0];
    if (favoritesItemsListElement.childElementCount === 0) {
        showEmptyMessage();
    }
}

function addFavoriteItem(container, doc, category) {
    let div = document.createElement('DIV');
    div.setAttribute("class", "favoritesItem");
    div.setAttribute("itemscope", "");
    div.setAttribute("itemtype", "https://schema.org/Offer");
    container.appendChild(div);

    let a = document.createElement('A');
    a.setAttribute("class", "favoritesLink");
    a.setAttribute("href", encodeURI("#item_page?name=" + doc.data().name + "&&category=" + category));
    div.appendChild(a);

    let img = document.createElement('IMG');
    img.setAttribute("alt", category + ":" + doc.data().name);
    img.setAttribute("itemprop", "image");
    a.appendChild(img);

    waitImage(img, "250px", "250px", "favoritesImage");
    renderImage(img, doc);

    let p = document.createElement('P');
    p.setAttribute("class", "favoritesTitle");
    p.setAttribute("itemprop", "name");
    p.innerHTML = doc.data().name;
    a.appendChild(p);

    let favoriteHeart = document.createElement('DIV');
    favoriteHeart.setAttribute("class", "favoritesHeart");
    favoriteHeart.setAttribute("id", img.alt.replace(/\s+/g, '_'));
    favoriteHeart.addEventListener('click', deleteFavoriteItem);
    div.appendChild(favoriteHeart);

    let price = document.createElement('P');
    price.setAttribute("class", "favoritesPrice");
    price.setAttribute("itemprop", "price");
    price.innerHTML = doc.data().price + " " + CURRENCY;;
    div.appendChild(price);
}

function showEmptyMessage() {
    let container = document.getElementsByClassName("favoritesItemsList")[0];
    let messageDiv = document.createElement("div");
    messageDiv.classList += 'messageDiv';
    messageDiv.innerText = 'Your favorite accessories will be shown here \n \
                            Click on the small heart to add them';
    container.appendChild(messageDiv);
}
export function initPage(params) { 
    addFavoriteItems();
}

function deleteFavoriteItem(event) {
    let currentElement = event.target;
    let localKey = FAVORITE + currentElement.id;
    let favoriteLocalItem = localStorage.getItem(localKey);
    if(favoriteLocalItem != null) {
        localStorage.removeItem(localKey);
        let favoriteItemsContainer = currentElement.parentElement.parentElement;
        let favoriteItem = currentElement.parentElement;
        favoriteItemsContainer.removeChild(favoriteItem)
    }
}

function addFavoriteItems() {
    let localKeys = Object.keys(localStorage);
    let container = document.getElementsByClassName("favoritesItemsList")[0];
    for (let localKey of localKeys) {
        if (localKey.includes(FAVORITE)) {
            let data = localStorage[localKey].split(":");
            db.collection(data[0]).where("name", "==", data[1])
                .limit(1).get().then(function (querySnapshot) {
                    querySnapshot.forEach((doc) => {
                        addFavoriteItem(container, doc, this.category);
                    });
                }.bind({ category: data[0] }));
        }
    }
}

function addFavoriteItem(container, doc, category) {
    let div = document.createElement('DIV');
    div.setAttribute("class", "favoritesItem");
    container.appendChild(div);

    let a = document.createElement('A');
    a.setAttribute("class", "favoritesLink");
    a.setAttribute("href", "#item_page?name=" + doc.data().name + "&&category=" + category);
    div.appendChild(a);

    let img = document.createElement('IMG');
    img.setAttribute("class", "favoritesImage");
    img.setAttribute("alt", category + ":" + doc.data().name);
    a.appendChild(img);
    renderImage(img, doc);

    let p = document.createElement('P');
    p.setAttribute("class", "favoritesTitle");
    p.innerHTML = doc.data().name;
    a.appendChild(p);

    let favoriteHeart = document.createElement('DIV');
    favoriteHeart.setAttribute("class", "favoritesHeart");
    favoriteHeart.setAttribute("id", img.alt);
    favoriteHeart.addEventListener('click', deleteFavoriteItem);
    div.appendChild(favoriteHeart);

    let price = document.createElement('P');
    price.setAttribute("class", "favoritesPrice");
    price.innerHTML = doc.data().price;
    div.appendChild(price);
}
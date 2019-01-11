export function initPage(params) {
    iniItemstFromSeasonStorage();
    setBarEventListeners();
    getAndRenderCategories();
    document.getElementById("checkOutButton").addEventListener("click", checkOutAction);
}

var totalPrice = 0;

function checkOutAction() {
    alert("This feature will be coming soon \n\nThank you for choosing HEGE");
}

function iniItemstFromSeasonStorage() {
    totalPrice = 0;
    let localKeys = Object.keys(sessionStorage);
    let container = document.getElementsByClassName("usersOrder")[0];
    let firstContainerChild = container.children[0];
    let foundItems = false;
    for (let localKey of localKeys) {
        if (localKey.includes(CART)) {
            foundItems = true;
            let data = sessionStorage[localKey].split(":");
            totalPrice += parseInt(data[2]);
            let itemCartId = +localKey.split("_")[1];
            addItemToUserCart(container, firstContainerChild, data[0], data[1].replace(/\_/g, ' '), itemCartId);
        }
    }
    if (!foundItems) {
        showEmptyMessage();
    } else {
        document.getElementsByClassName("totalPrice")[0].innerText = totalPrice + " " + CURRENCY;
    }
}

function addItemToUserCart(container, firstContainerChild, category, title, itemCartId) {
    db.collection(category).where("name", "==", title)
        .limit(1).get().then(function (querySnapshot) {
            querySnapshot.forEach((doc) => {
                renderItemsToUserCart(doc, this.container, this.firstContainerChild, this.category, itemCartId)
            });
        }.bind({ category: category, container: container, firstContainerChild: firstContainerChild })
        );
}

function deletItemFromCart(event) {
    let currentElement = event.target;
    let localKey = CART + currentElement.id;
    let cartSeasonItem = sessionStorage.getItem(localKey);
    if (cartSeasonItem != null) {
        let data = cartSeasonItem.split(":");
        let itemPirce = parseInt(data[2]);
        totalPrice -= itemPirce;
        document.getElementsByClassName("totalPrice")[0].innerText = totalPrice + " " + CURRENCY;
        sessionStorage.removeItem(localKey);
        let cartItemsContainer = currentElement.parentElement.parentElement.parentElement;
        let currentCartItem = currentElement.parentElement.parentElement;
        cartItemsContainer.removeChild(currentCartItem)
    }
    if (totalPrice === 0) {
        showEmptyMessage();
    }
}

function renderItemsToUserCart(doc, container, firstContainerChild, category, itemCartId) {
    let div = document.createElement('DIV');
    div.setAttribute("class", "cartSingleOrder");
    div.setAttribute("itemscope", "");
    div.setAttribute("itemtype", "https://schema.org/Offer");
    container.insertBefore(div, firstContainerChild);

    let a = document.createElement('A');
    a.setAttribute("href", encodeURI("#item_page?name=" + doc.data().name + "&&category=" + category));
    div.appendChild(a);

    let img = document.createElement('IMG');
    img.setAttribute("alt", category + ":" + doc.data().name);
    img.setAttribute("itemprop", "image");
    a.appendChild(img);

    waitImage(img, null, null, "orderImage");
    renderImage(img, doc);

    let interiorDiv = document.createElement('DIV');
    div.appendChild(interiorDiv);
    interiorDiv.setAttribute("class", "orderDescription");
    div.setAttribute("itemprop", "description");

    let span = document.createElement('SPAN');
    span.setAttribute("class", "deleteOrder");
    span.addEventListener('click', deletItemFromCart);
    span.setAttribute("id", itemCartId + "_" + img.alt.replace(/\s+/g, '_'));
    interiorDiv.appendChild(span);

    let title = document.createElement('P');
    title.setAttribute("class", "orderTitle");
    title.setAttribute("itemprop", "name");
    title.innerHTML = doc.data().name;
    interiorDiv.appendChild(title);

    let price = document.createElement('P');
    price.setAttribute("class", "orderPrice");
    price.setAttribute("itemprop", "price");
    price.innerHTML = doc.data().price + " " + CURRENCY;
    interiorDiv.appendChild(price);
}

function showEmptyMessage() {
    let orderTotalElement = document.getElementsByClassName("orderTotal")[0];
    orderTotalElement.style.display = "none";
    let usersOrderElement = orderTotalElement.parentElement;

    let messageDiv = document.createElement("div");
    messageDiv.classList += 'messageDiv';
    messageDiv.innerText = 'Your desired accessories will wait for you here';
    usersOrderElement.appendChild(messageDiv);
}
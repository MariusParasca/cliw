export function initPage(params) { 
    iniItemstFromSeasonStorage();
    setBarEventListeners();
}

var totalPrice = 0;

function iniItemstFromSeasonStorage() {
    totalPrice = 0;
    let localKeys = Object.keys(sessionStorage);
    let container = document.getElementsByClassName("usersOrder")[0];
    let firstContainerChild = container.children[0];
    for (let localKey of localKeys) {
        if (localKey.includes(CART)) {
            let data = sessionStorage[localKey].split(":");
            totalPrice += parseInt(data[2]);
            addItemToUserCart(container, firstContainerChild, data[0], data[1]);
        }     
    }
    document.getElementsByClassName("totalPrice")[0].innerText = totalPrice;
}

function addItemToUserCart(container, firstContainerChild, category, title) {
    db.collection(category).where("name", "==", title)
        .limit(1).get().then(function (querySnapshot) {
            querySnapshot.forEach((doc) => {
                renderItemsToUserCart(doc, this.container, this.firstContainerChild, this.category)
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
        document.getElementsByClassName("totalPrice")[0].innerText = totalPrice;
        sessionStorage.removeItem(localKey);
        let cartItemsContainer = currentElement.parentElement.parentElement.parentElement;
        let currentCartItem = currentElement.parentElement.parentElement;
        cartItemsContainer.removeChild(currentCartItem)
    }
    
}

function renderItemsToUserCart(doc, container, firstContainerChild, category) {
    let div = document.createElement('DIV');
    div.setAttribute("class", "cartSingleOrder");
    container.insertBefore(div, firstContainerChild);

    let img = document.createElement('IMG');
    img.setAttribute("class", "orderImage");
    img.setAttribute("alt", category + ":" + doc.data().name);
    div.appendChild(img);
    renderImage(img, doc);

    let interiorDiv = document.createElement('DIV');
    div.appendChild(interiorDiv);
    interiorDiv.setAttribute("class", "orderDescription");

    let span = document.createElement('SPAN');
    span.setAttribute("class", "deleteOrder");
    span.addEventListener('click', deletItemFromCart);
    span.setAttribute("id", img.alt);
    interiorDiv.appendChild(span);

    let title = document.createElement('P');
    title.setAttribute("class", "orderTitle");
    title.innerHTML = doc.data().name;
    interiorDiv.appendChild(title);

    let price = document.createElement('P');
    price.setAttribute("class", "orderPrice");
    price.innerHTML = doc.data().price;
    interiorDiv.appendChild(price);
}
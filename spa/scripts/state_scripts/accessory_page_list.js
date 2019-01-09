export function initPage(params) {
    setAccesoryEventListeners();
    getDataFromDB(params);
    initFilters();
    initAlternativeMenuAndFooter();
}

const unfilledHeartImgPath = 'url("./all_icons/circle_red_heart_30px.png")';
const filledHeartImgPath = 'url("./all_icons/circle_red_heart_filled_30px.png")';
const filterGender = 'gender';
const filterPrice = 'price';
let allItems = [];

var filters = {
    color: null,
    gender: null,
    price: null
};

function initAlternativeMenuAndFooter() {
    document.getElementById('navMenuAlt').addEventListener('mouseover', maintainAlternativeDropdown);
    document.getElementsByClassName('selectionMenus')[0].addEventListener('mouseover', maintainAlternativeDropdown);
    document.getElementById('navMenuAlt').addEventListener('mouseout', closeAlternativeDropdown);
    document.getElementsByClassName('selectionMenus')[0].addEventListener('mouseout', closeAlternativeDropdown);

    window.matchMedia('(min-width: 500px)').addEventListener('change', event => {
        if (event.matches) {
            maintainAlternativeDropdown();
        } else {
            closeAlternativeDropdown();
        }
    });
}

function maintainAlternativeDropdown() {
    let categories = document.getElementsByClassName('categories')[0];
    if (categories !== undefined) {
        categories.style.display = 'block'
    }

    let filters = document.getElementsByClassName('filters')[0];
    if (filters !== undefined) {
        filters.style.display = 'block'
    }
}

function closeAlternativeDropdown() {
    if (window.matchMedia('(max-width: 500px)').matches) {
        let categories = document.getElementsByClassName('categories')[0];
        if (categories !== undefined) {
            categories.style.display = 'none'
        }

        let filters = document.getElementsByClassName('filters')[0];
        if (filters !== undefined) {
            filters.style.display = 'none'
        }
    }
}

function initFilters() {
    addFilterListener("genderMan", filterGender, "man");
    addFilterListener("genderWoman", filterGender, "woman");
    addFilterListener("priceAscending", filterPrice, "asc");
    addFilterListener("priceDescending", filterPrice, "desc");

    addColorFilters();

    document.getElementById("resetAll").addEventListener('click', resetFilters);
}

function addColorFilters() {
    let colorChoise = document.getElementById('colorChoice');
    colorChoise.style.paddingLeft = '15px';
    colorChoise.style.display = 'flex';

    for (let colorName in COLORS) {
        let colorDiv = document.createElement('LI');
        colorDiv.style.backgroundColor = COLORS[colorName];
        colorDiv.style.height = '15px';
        colorDiv.style.width = '15px';
        colorDiv.style.margin = '3px';

        let colorAnchr = document.createElement('a');
        colorAnchr.id = COLORS[colorName];
        colorAnchr.style.height = '15px';
        colorAnchr.style.display = 'block';
        colorAnchr.title = colorName;

        colorDiv.appendChild(colorAnchr);
        colorChoise.appendChild(colorDiv);

        addFilterListener(COLORS[colorName], 'color', colorName);
    }
}

function addFilterListener(elementId, filterName, filterValue) {
    let targetedElement = document.getElementById(elementId);
    targetedElement.addEventListener('click', () => {
        for (let child of targetedElement.parentNode.parentNode.children) {
            child.firstChild.style.borderStyle = 'none';
        }
        targetedElement.style.borderStyle = 'none none solid none';
        targetedElement.style.borderColor = 'white';
        filters[filterName] = filterValue;
        applyFilters();
    });
}

function applyFilters() {
    let accessoriesElems = document.getElementsByClassName('accessoryTitle');
    for (let elem of accessoriesElems) {
        let hasColor = true;
        let hasGender = true;
        if (filters.color !== null) {
            hasColor = allItems.find(item => item.name === elem.innerHTML).color === filters.color;
        }
        if (filters.gender !== null) {
            hasGender = allItems.find(item => item.name === elem.innerHTML).gender === filters.gender;
        }

        if (hasColor && hasGender) {
            elem.parentNode.parentNode.style.display = 'block';
        } else {
            elem.parentNode.parentNode.style.display = 'none';
        }
    }

    if (filters.price !== null) {
        orderItems();
    }

    checkIfEmpty();
}

function orderItems() {
    allItems.sort(comparePrice);
    if (filters.price === 'desc') {
        allItems.reverse();
    }
    let accessoriesElems = document.getElementsByClassName('accessoryTitle');
    for (let elem of accessoriesElems) {
        let itemIndex = allItems.findIndex(item => item.name === elem.innerHTML);
        elem.parentNode.parentNode.style.order = itemIndex;
    }
}

function comparePrice(itemA, itemB) {
    if (itemA.price < itemB.price) {
        return -1;
    }
    if (itemA.price > itemB.price) {
        return 1;
    }
    return 0
}

function checkIfEmpty() {
    let parentElement = document.getElementsByClassName('accesoryItemsList')[0];
    let hasChildren = false;
    for (let child of parentElement.children) {
        if (child.style.display !== 'none' && !child.classList.contains('messageDiv')) {
            hasChildren = true;
            break;
        }
    }

    if (!hasChildren) {
        let messageDiv = document.getElementsByClassName('messageDiv')[0];
        if (messageDiv === undefined) {
            let newMessageDiv = document.createElement("div");
            newMessageDiv.classList += 'messageDiv';
            newMessageDiv.innerText = 'At the moment we don\'t have what you are looking for \n \
                                Please come back later';
            parentElement.appendChild(newMessageDiv);
        }
    } else {
        let messageDiv = document.getElementsByClassName('messageDiv')[0];
        if (messageDiv !== undefined) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }
}

function resetFilters() {
    let accessoriesElems = document.getElementsByClassName('accessoryTitle');
    for (let elem of accessoriesElems) {
        elem.parentNode.parentNode.style.display = 'block';
    }

    document.getElementById('genderMan').style.borderStyle = 'none';
    document.getElementById('genderWoman').style.borderStyle = 'none';
    document.getElementById('priceAscending').style.borderStyle = 'none';
    document.getElementById('priceDescending').style.borderStyle = 'none';

    let colorChoise = document.getElementById('colorChoice');
    for (let child of colorChoise.children) {
        child.firstChild.style.borderStyle = 'none';
    }

    filters = {
        color: null,
        gender: null,
        price: null
    };

    let messageDiv = document.getElementsByClassName('messageDiv')[0];
    if (messageDiv !== undefined) {
        messageDiv.parentNode.removeChild(messageDiv);
    }
}

function searchInAllCategories(querySnapshot) {
    querySnapshot.forEach((doc) => {
        let categories = doc.data().categories;
        for (let i in categories) {
            db.collection(categories[i]).orderBy("name").get().then(renderItems.bind({ category: categories[i] }));
        }
    });
}

function setAccesoryEventListeners() {
    document.getElementsByClassName("dropdown")[0].style.display = "none";
    document.getElementById("navUser").addEventListener("mouseover", maitainUserNameHover);
    document.getElementById("navUser").addEventListener("mouseout", disableUserNameHover);
}

function getDataFromDB(params) {
    allItems.length = 0;
    let container = document.getElementsByClassName("categories")[0];
    db.collection("categories").get().then(renderCategoriesContainer.bind({ container: container }));
    if (params['category'] != 'all_categories') {
        db.collection(params['category']).orderBy("name").get().then(renderItems.bind({ category: params['category'] }));

        let titleHeading = params['category'].replace('_', ' ');
        titleHeading = titleHeading[0].toUpperCase() + titleHeading.slice(1);
        document.getElementsByClassName("accesoryListHeading")[0].innerText = titleHeading;
    } else {
        db.collection('categories').get().then(searchInAllCategories);
        document.getElementsByClassName("accesoryListHeading")[0].innerText = "All accessories";
    }
}

function renderItems(querySnapshot) {
    let container = document.getElementsByClassName("accesoryItemsList")[0];
    querySnapshot.forEach((doc) => {
        if (doc.data().name) {
            allItems.push(doc.data());
            addAccessoryItem(container, doc, this.category);
        }
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
        if (localKey == FAVORITE + key) {
            tag.style.backgroundImage = background;
        }
    }
}

function addAccessoryItem(container, doc, category) {
    let div = document.createElement('DIV');
    div.setAttribute("class", "accesoryItem");
    container.appendChild(div);
    container.setAttribute("itemscope", "");
    container.setAttribute("itemtype", "https://schema.org/Offer");

    let a = document.createElement('A');
    a.setAttribute("class", "accessoryLink");
    a.setAttribute("href", encodeURI("#item_page?name=" + doc.data().name + "&&category=" + category));
    div.appendChild(a);

    let img = document.createElement('IMG');
    img.setAttribute("alt", category + ":" + doc.data().name);
    img.setAttribute("itemprop", "image");
    a.appendChild(img);

    waitImage(img, "250px", "250px", "accessoryImage");
    renderImage(img, doc);

    let p = document.createElement('P');
    p.setAttribute("class", "accessoryTitle");
    p.setAttribute("itemprop", "title");
    p.innerHTML = doc.data().name;
    a.appendChild(p);

    let itemHeart = document.createElement('DIV');
    itemHeart.setAttribute("class", "itemHeart");
    let imgAlt = img.alt.replace(/\s+/g, '_')
    itemHeart.setAttribute("id", imgAlt);
    itemHeart.addEventListener("click", toggleFavoriteItemOnAccessoryListPage);
    div.appendChild(itemHeart);
    initIfItemLoved(imgAlt, itemHeart, filledHeartImgPath);

    let price = document.createElement('P');
    price.setAttribute("class", "accesoryPrice");
    price.setAttribute("itemprop", "price");
    price.innerHTML = doc.data().price + " " + CURRENCY;
    div.appendChild(price);
}

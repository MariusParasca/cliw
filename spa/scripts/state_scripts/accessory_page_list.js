export function initPage(params) {
    setAccesoryEventListeners();
    getDataFromDB();
}

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


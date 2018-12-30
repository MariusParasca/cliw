export function initPage(params) { 
    db.collection("last_added")
        .orderBy("added_date")
        .get()
        .then(renderLastAdded);
    setBarEventListeners();
    getAndRenderCategories();
}

function renderLastAdded(querySnapshot) {
    querySnapshot.forEach((doc) => {
        let container = document.getElementsByClassName('mainHomeBottom')[0];
        addElementsToContainer(container, doc, doc.data().category);
    });   
}
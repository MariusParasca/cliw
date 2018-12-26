export function initPage(params) { 
    db.collection("last_added")
        .orderBy("added_date")
        .get()
        .then(renderLastAdded);
}

function renderLastAdded(querySnapshot) {
    querySnapshot.forEach((doc) => {
        let container = document.getElementsByClassName('mainHomeBottom')[0];
        addElementsToContainer(container, doc, doc.data().category);
    });   
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    return canvas.toDataURL();
}


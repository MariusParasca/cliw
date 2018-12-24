export function initPage(params) { 
    db.collection("last_added")
        .orderBy("added_date")
        .get()
        .then(renderLastAdded);
}

function renderLastAdded(querySnapshot) {
    querySnapshot.forEach((doc) => {
        let container = document.getElementsByClassName('mainHomeBottom')[0];
        addElementsToContainer(container, doc);
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

function addElementsToContainer(container, doc) {
    let div = document.createElement('DIV');
    container.appendChild(div);
    div.setAttribute("class", "lastAccessoryAdded");

    let a = document.createElement('A');
    a.setAttribute("class", "accessoryLink");
    a.setAttribute("href", "#item_page?name=" + doc.data().name + "&&category=" + doc.data().category);
    div.appendChild(a);

    let img = document.createElement('IMG');
    img.setAttribute("class", "lastAccessoryImage");
    img.setAttribute("alt", doc.data().img_name);
    renderImage(img, doc);

    a.appendChild(img);
    let p = document.createElement('P');
    p.setAttribute("class", "accessoryTitle");
    p.innerHTML = doc.data().name;
    a.appendChild(p);
}
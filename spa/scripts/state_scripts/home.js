export function initPage() { 
    db.collection("last_added")
        .orderBy("added_date")
        .get()
        .then(render_last_added);
}

function render_last_added(querySnapshot) {
    querySnapshot.forEach((doc) => {
        var container = document.getElementsByClassName('mainHomeBottom')[0];
        add_elements_to_container(container, doc);
    });   
}

function render_images(img, doc) {
    var imgPath = SITE_FOLDER + img.alt;
    var imageSource = localStorage.getItem(imgPath);
    
    if (imageSource === null) {
        storage.ref(SITE_FOLDER + doc.data().img_name).getDownloadURL().then(
            (url) => {
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = (event) => {
                    var blob = xhr.response;
                    var dataURL = URL.createObjectURL(blob);
                    img.setAttribute("src", dataURL);
                    localStorage.setItem(imgPath, dataURL);
                };
                xhr.open('GET', url);
                xhr.send();
            }
        );
    } else {
        img.src = imageSource;
    }   
}

function add_elements_to_container(container, doc) {
    var div = document.createElement('DIV');
    container.appendChild(div);
    div.setAttribute("class", "lastAccessoryAdded");

    var a = document.createElement('A');
    a.setAttribute("class", "accessoryLink");
    a.setAttribute("href", "#item_page");
    div.appendChild(a);

    var img = document.createElement('IMG');
    img.setAttribute("class", "lastAccessoryImage");
    img.setAttribute("alt", doc.data().img_name);
    render_images(img, doc);

    a.appendChild(img);
    var p = document.createElement('P');
    p.setAttribute("class", "accessoryTitle");
    p.innerHTML = doc.data().name;
    a.appendChild(p);
}
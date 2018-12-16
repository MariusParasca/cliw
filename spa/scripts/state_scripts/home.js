export function initPage() { 
    
}

const SITE_FOLDER = 'site/'

window.onload = function () {
   db.collection("last_added")
        .orderBy("added_date")
        .get()
       .then(render_last_added);
    // setTimeout(cacheImages, 3000);
}

// function cacheImages() {
//     const imgs = document.getElementsByClassName("lastAccessoryImage");
//     console.log(imgs)
//     for (var i = 0; i < imgs.length; i++) {
//         var img_path = SITE_FOLDER + imgs[i].alt
//         if (localStorage.getItem(img_path) === null) {
//             localStorage.setItem(img_path, getBase64Image(imgs[i]))
//         }
//     }
// }

function render_last_added(querySnapshot) {
    querySnapshot.forEach((doc) => {
        var container = document.getElementsByClassName('mainHomeBottom')[0];
        add_elements_to_container(container, doc);
    });   
}

// function getBase64Image(img) {
//     var canvas = document.createElement("canvas");
//     canvas.width = img.width;
//     canvas.height = img.height;

//     var ctx = canvas.getContext("2d");
//     ctx.drawImage(img, 0, 0);

//     var dataURL = canvas.toDataURL("image/png");

//     return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
// }

function add_elements_to_container(container, doc) {
    var div = document.createElement('DIV');
    container.appendChild(div);
    div.setAttribute("class", "lastAccessoryAdded");
    var a = document.createElement('A');
    a.setAttribute("class", "accessoryLink");
    a.setAttribute("href", "#item_page");
    div.appendChild(a)
    var img = document.createElement('IMG');
    img.setAttribute("class", "lastAccessoryImage");
    img.setAttribute("alt", doc.data().img_name);
    a.appendChild(img);
    storage.ref(SITE_FOLDER + doc.data().img_name).getDownloadURL().then(
        (url) => { img.setAttribute("src", url); }
    );
    var p = document.createElement('P');
    p.setAttribute("class", "accessoryTitle");
    p.innerHTML = doc.data().name;
    a.appendChild(p);
    
}
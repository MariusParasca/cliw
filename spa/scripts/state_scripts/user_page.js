export function initPage() {
    initLocalImages();
    initButtonActions();
}

function initLocalImages() {
    let imageContainer = document.getElementsByClassName("savedImagesCards")[0];

    let localKeys = Object.keys(localStorage);
    for (let localKey of localKeys) {
        let localKeySplit = localKey.split('_');
        if (localKeySplit.length < 2) {
            continue;
        }
        let keyWord = localKeySplit[0] + localKeySplit[1];
        if (keyWord === 'hegepicture') {
            let imageDate = localKeySplit[4] + ' ' + localKeySplit[5];
            let imageSource = localStorage.getItem(localKey);
            let imageCard = createImageCard(imageSource, imageDate, localKey);
            imageContainer.appendChild(imageCard);
        }
    }
}

function createImageCard(imageSource, imageDate, imageKey) {
    let imageCardDiv = document.createElement("div");
    imageCardDiv.classList += 'userImageTakenCard';

    let imageTag = document.createElement("img");
    imageTag.id = imageKey;
    imageTag.classList += 'userImageTaken';
    imageTag.src = imageSource;
    imageTag.alt = 'User Image';

    let imageTakenActions = document.createElement("div");
    imageTakenActions.classList += 'imageTakenActions';

    let deleteButton = document.createElement("button");
    deleteButton.classList.add('deleteImage', 'button');
    deleteButton.title = 'Delete image';

    let dateText = document.createElement("p");
    dateText.classList += 'imageDate';
    dateText.innerHTML = imageDate;

    let downloadButton = document.createElement("button");
    downloadButton.classList.add('downloadImage', 'button');
    downloadButton.title = 'Download image';

    imageTakenActions.appendChild(deleteButton);
    imageTakenActions.appendChild(dateText);
    imageTakenActions.appendChild(downloadButton);

    imageCardDiv.appendChild(imageTag);
    imageCardDiv.appendChild(imageTakenActions);

    return imageCardDiv;
}

function initButtonActions() {
    let deleteButtons = document.getElementsByClassName("deleteImage");
    for (let element of deleteButtons) {
        let imageId = element.parentElement.parentElement.getElementsByTagName('img')[0].id;
        element.addEventListener("click", () => deleteImage(imageId));
    }
    let downloadButtons = document.getElementsByClassName("downloadImage");
    for (let element of downloadButtons) {
        let imageId = element.parentElement.parentElement.getElementsByTagName('img')[0].id;
        element.addEventListener("click", () => downloadImage(imageId));
    }
}

function deleteImage(imageKey) {
    localStorage.removeItem(imageKey);

    let imageContainer = document.getElementsByClassName("savedImagesCards")[0];
    while (imageContainer.firstChild) {
        imageContainer.removeChild(imageContainer.firstChild);
    }

    initLocalImages();
    initButtonActions();
}

function downloadImage(imageKey) {
    var link = document.createElement('a');
    link.download = imageKey;
    link.href = localStorage.getItem(imageKey);
    link.click();
}
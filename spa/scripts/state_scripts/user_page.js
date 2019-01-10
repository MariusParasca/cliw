export function initPage(params) {
    initPreferedColors();
    initLocalImages();
    initButtonActions();
    setBarEventListeners();
    getAndRenderCategories();
}

var userColorPreference

function initPreferedColors() {
    let parentElement = document.getElementsByClassName("userSettingsPane")[0];
    
    for (let colorName in COLORS) {
        let colorChoiceDiv = document.createElement('div');
        colorChoiceDiv.setAttribute('class', 'colorChoice');
                
        let colorDiv = document.createElement('div');
        colorDiv.style.backgroundColor = COLORS[colorName];
        colorDiv.setAttribute('class', 'colorDiv');

        colorChoiceDiv.appendChild(colorDiv);

        let tickElem = document.createElement('img');
        tickElem.src = './all_icons/tick.png';
        tickElem.setAttribute('class', 'tick');
        tickElem.setAttribute('alt', 'tickColor');

        let colorLabel = document.createElement('p');
        colorLabel.innerText = colorName;
        colorLabel.setAttribute('class', 'colorLabel');
        
        colorChoiceDiv.appendChild(colorLabel);

        userColorPreference = localStorage.getItem('userColorPreference');
        if (userColorPreference !== null) {
            if (userColorPreference.includes(colorName)) {
                tickElem.style.visibility = 'visible';
            } else {
                tickElem.style.visibility = 'hidden';
            }
        }
        colorChoiceDiv.appendChild(tickElem);

        colorDiv.addEventListener('mouseover', event => {
            if ((userColorPreference !== null) && (!userColorPreference.includes(colorName))) {
                event.target.nextSibling.nextSibling.style.visibility = 'visible';
            }
        });
        colorDiv.addEventListener('mouseout', event => {
            if ((userColorPreference !== null) &&(!userColorPreference.includes(colorName))) {
                event.target.nextSibling.nextSibling.style.visibility = 'hidden';
            }
        });
        colorDiv.addEventListener('click', event => {
            toggleColor(colorName, event);
        });

        parentElement.appendChild(colorChoiceDiv);
    }
}

function toggleColor(colorName, event) {
    if (userColorPreference !== null && userColorPreference.includes(colorName)) {
        userColorPreference = userColorPreference.replace(colorName + ';', '');
        event.target.nextSibling.nextSibling.style.visibility = 'hidden';
    } else {
        if (userColorPreference === null) {
            userColorPreference = colorName + ';';    
        } else {
            userColorPreference += colorName + ';';    
        }
        event.target.nextSibling.nextSibling.style.visibility = 'visible';
    }
    localStorage.setItem('userColorPreference', userColorPreference);
    userColorPreference = localStorage.getItem('userColorPreference');
}

function initLocalImages() {
    let imageContainer = document.getElementsByClassName("savedImagesCards")[0];

    let foundKey = false;
    let localKeys = Object.keys(localStorage);
    for (let localKey of localKeys) {
        let localKeySplit = localKey.split('_');
        if (localKeySplit.length < 2) {
            continue;
        }
        let keyWord = localKeySplit[0] + localKeySplit[1];
        if (keyWord === 'hegepicture') {
            foundKey = true;
            let imageDate = localKeySplit[4] + ' ' + localKeySplit[5];
            let imageSource = localStorage.getItem(localKey);
            let imageCard = createImageCard(imageSource, imageDate, localKey);
            imageContainer.appendChild(imageCard);
        }
    }

    if (!foundKey) {
        createAndAppendMessage();
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
    let imageCard = document.getElementById(imageKey).parentNode;
    imageCard.classList.add('zoomOut');
    setTimeout(() => {
        localStorage.removeItem(imageKey);

        let imageContainer = document.getElementsByClassName("savedImagesCards")[0];
        while (imageContainer.firstChild) {
            imageContainer.removeChild(imageContainer.firstChild);
        }

        initLocalImages();
        initButtonActions();
    }, 300);
}

function downloadImage(imageKey) {
    let imgElem = document.getElementById(imageKey);
    let tempImg = document.createElement('img');
    tempImg.src = imgElem.src;
    tempImg.width = 320;
    tempImg.height = 240;
    tempImg.style.position = 'absolute';
    
    imgElem.parentElement.insertBefore(tempImg, imgElem);
    tempImg.classList.add('zoomOutDown');
    setTimeout(() => {
        imgElem.parentElement.removeChild(tempImg);
        var link = document.createElement('a');
        link.download = imageKey;
        link.href = localStorage.getItem(imageKey);
        link.click();
    }, 800);
}

function createAndAppendMessage() {
    let imageContainer = document.getElementsByClassName("savedImagesCards")[0];

    let messageDiv = document.createElement("div");
    messageDiv.classList += 'messageDiv';
    messageDiv.innerText = 'Your saved images will be shown here \n \
                            Explore our store to find what suits you best';

    imageContainer.appendChild(messageDiv);
}
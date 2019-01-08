export function initPage(params) {
    getDataFromDb(params);
    document.getElementsByClassName("addToCart")[0].addEventListener("mouseover", enableCartImgHover);
    document.getElementsByClassName("addToCart")[0].addEventListener("mouseout", disableCartImgHover);
    document.getElementById("tryIt").addEventListener("mouseover", enableHatImgHover);
    document.getElementById("tryIt").addEventListener("mouseout", disableHatImgHover);
    document.getElementById("tryIt").addEventListener("click", changeToWebCam);
    document.getElementById("backToItem").addEventListener("click", backToItemPage);
    document.getElementById("backToItem").addEventListener("mouseover", backToItemPageEnableHover);
    document.getElementById("backToItem").addEventListener("mouseout", backToItemPageDisableHover);
    document.getElementById("takePhoto").addEventListener("click", takePictureButton);
    document.getElementById("itemHeartItemPage").addEventListener("click", toggleFavoriteItemOnItemPage);
    document.getElementById("itemChoicesFavorites").addEventListener("click", toggleFavoriteItemOnItemPage);
    document.getElementsByClassName("itemChoicesCart")[0].addEventListener("click", storeInSeasonStorageItemCart);
    setBarEventListeners();
    initFavoriteItem(params);
    getAndRenderCategories();
}

const WEB_CAM_WIDTH_MAX = 640;
const WEB_CAM_HEIGHT_MAX = 480;
const WEB_CAM_WIDTH_MIN = 320;
const WEB_CAM_HEIGHT_MIN = 240;
const TRACKER_CONFIG = {
    // default 4 2 0.1
    initialScale: 1,
    stepSize: 1,
    edgesDensity: 0.1
}
const WEB_CAM_TIMEOUT = 250;

// global variables used
window.pageSizeMedia;
window.videoWebCam;
window.observer;
var imageConfig;

function backToItemPageEnableHover() {
    document.getElementById("backToItem").style.backgroundImage = "url('./all_icons/back_simple_arrow_black_50px.png')";
}

function backToItemPageDisableHover() {
    document.getElementById("backToItem").style.backgroundImage = "url('./all_icons/back_simple_arrow_gray_50px.png')";
}

function fromJulian(j) {
    j = (+j) + (30.0 / (24 * 60 * 60));
    var A = Date.julianArray(j, true);
    return new Date(Date.UTC.apply(Date, A));
}

function julianArray(j, n) {
    var F = Math.floor;
    var j2, JA, a, b, c, d, e, f, g, h, z;
    j += 0.5;
    j2 = (j - F(j)) * 86400.0;
    z = F(j);
    f = j - z;
    if (z < 2299161) a = z;
    else {
        g = F((z - 1867216.25) / 36524.25);
        a = z + 1 + g - F(g / 4);
    }
    b = a + 1524;
    c = F((b - 122.1) / 365.25);
    d = F(365.25 * c);
    e = F((b - d) / 30.6001);
    h = F((e < 14) ? (e - 1) : (e - 13));
    JA = [F((h > 2) ? (c - 4716) : (c - 4715)),
    h - 1, F(b - d - F(30.6001 * e) + f)];
    var JB = [F(j2 / 3600), F((j2 / 60) % 60), Math.round(j2 % 60)];
    JA = JA.concat(JB);
    if (typeof n == 'number') return JA.slice(0, n);
    return JA;
}

function getSeasons(y, wch) {
    y = y || new Date().getFullYear();
    if (y < 1000 || y > 3000) throw y + ' is out of range';
    var Y1 = (y - 2000) / 1000,
        Y2 = Y1 * Y1,
        Y3 = Y2 * Y1,
        Y4 = Y3 * Y1;
    var jd, t, w, d, est = 0,
        i = 0,
        Cos = Math.degCos,
        A = [y],
        e1 = [485, 203, 199, 182, 156, 136, 77, 74, 70, 58, 52, 50, 45, 44, 29, 18, 17, 16, 14, 12, 12, 12, 9, 8],
        e2 = [324.96, 337.23, 342.08, 27.85, 73.14, 171.52, 222.54, 296.72, 243.58, 119.81, 297.17, 21.02,
            247.54, 325.15, 60.93, 155.12, 288.79, 198.04, 199.76, 95.39, 287.11, 320.81, 227.73, 15.45],
        e3 = [1934.136, 32964.467, 20.186, 445267.112, 45036.886, 22518.443,
            65928.934, 3034.906, 9037.513, 33718.147, 150.678, 2281.226,
            29929.562, 31555.956, 4443.417, 67555.328, 4562.452, 62894.029,
            31436.921, 14577.848, 31931.756, 34777.259, 1222.114, 16859.074];
    while (i < 4) {
        switch (i) {
            case 0:
                jd = 2451623.80984 + 365242.37404 * Y1 + 0.05169 * Y2 - 0.00411 * Y3 - 0.00057 * Y4;
                break;
            case 1:
                jd = 2451716.56767 + 365241.62603 * Y1 + 0.00325 * Y2 + 0.00888 * Y3 - 0.00030 * Y4;
                break;
            case 2:
                jd = 2451810.21715 + 365242.01767 * Y1 - 0.11575 * Y2 + 0.00337 * Y3 + 0.00078 * Y4;
                break;
            case 3:
                jd = 2451900.05952 + 365242.74049 * Y1 - 0.06223 * Y2 - 0.00823 * Y3 + 0.00032 * Y4;
                break;
        }
        t = (jd - 2451545.0) / 36525;
        w = 35999.373 * t - 2.47;
        d = 1 + 0.0334 * Cos(w) + 0.0007 * Cos(2 * w);
        est = 0;
        for (var n = 0; n < 24; n++) {
            est += e1[n] * Cos(e2[n] + (e3[n] * t));
        }
        jd += (0.00001 * est) / d;
        A[++i] = Date.fromJulian(jd);
    }
    return wch && A[wch] ? A[wch] : A;
}

function degRad(d) {
    return (d * Math.PI) / 180.0;
}

function degSin(d) {
    return Math.sin(Math.degRad(d));
}

function degCos(d) {
    return Math.cos(Math.degRad(d));
}

function getCurrentSeason() {
    let mine = Date.getSeasons();
    let today = new Date(); //Date.parse('Jul 21, 2019')
    let firstSpring = mine[1];
    let firstSummer = mine[2];
    let firstFall = mine[3];
    let firstWinter = mine[4];

    if (today >= firstSpring && today < firstSummer) {
        return 'spring';
    } else if (today >= firstSummer && today < firstFall) {
        return 'summer';
    } else if (today >= firstFall && today < firstWinter) {
        return 'fall';
    } else if (today >= firstWinter || today < firstSpring) {
        return 'winter';
    }
}

//Methods for getting the current season
Date.fromJulian = fromJulian;
Date.julianArray = julianArray;
Date.getSeasons = getSeasons;
Math.degRad = degRad;
Math.degSin = degSin;
Math.degCos = degCos;

//Global variables
var MAX_NUMBER_OF_RECOMANDATIONS = 3;
var currentSeason = getCurrentSeason();
const unfilledHeartImgPath = 'url("./all_icons/circle_red_heart_50px.png")';
const filledHeartImgPath = 'url("./all_icons/circle_red_heart_filled_50px.png")';

function storeInSeasonStorageItemCart() {
    let price = document.getElementById("price").innerText.match(/\d+/)[0];
    let img = document.getElementsByClassName("itemImage")[0];

    if (img === undefined) {
        return;
    }

    let sessionKeys = Object.keys(sessionStorage);
    let lastItemCartId = -1;
    for (let sessionKey of sessionKeys) {
        if (sessionKey.includes(CART)) {
            let itemCartId = +sessionKey.split("_")[1];
            if (itemCartId > lastItemCartId) {
                lastItemCartId = itemCartId;
            }
        }
    }
    if (lastItemCartId === -1) {
        lastItemCartId = 0;
    } else {
        lastItemCartId++;
    }
    sessionStorage.setItem("cart_" + lastItemCartId + "_" + img.alt, img.alt + ":" + price);
}

function initFavoriteItem(params) {
    let localKeys = Object.keys(localStorage);
    let favoriteHeart = document.getElementById("itemHeartItemPage");
    let favoriteHeartWebCam = document.getElementById("itemChoicesFavorites");
    for (let localKey of localKeys) {
        if (localKey == FAVORITE + params["category"] + ":" + params["name"]) {
            favoriteHeart.style.backgroundImage = filledHeartImgPath;
            favoriteHeartWebCam.style.backgroundImage = filledHeartImgPath;
            addHeartHoverStyle(unfilledHeartImgPath, filledHeartImgPath, favoriteHeart);
            addHeartHoverStyle(unfilledHeartImgPath, filledHeartImgPath, favoriteHeartWebCam);
            break;
        }
    }
}

function toggleFavoriteItemOnItemPage() {
    let container = document.getElementById("itemHeartItemPage");
    let containerSecond = document.getElementById("itemChoicesFavorites");
    let img = document.getElementsByClassName("itemImage")[0];
    toggleFavoriteItem(container, img, unfilledHeartImgPath, filledHeartImgPath, containerSecond);
}

function getDataFromDb(params) {
    let imageContainer = document.getElementsByClassName('mainItemPageTopLeft')[0];
    let dataContainer = document.getElementsByClassName('mainItemPageTopRight')[0];
    db.collection(params["category"]).where("name", "==", params["name"])
        .limit(1).get().then(addMainItemPromise.bind({
            category: params["category"],
            imageContainer: imageContainer,
            dataContainer: dataContainer
        }));
    db.collection("categories").get().then(searchInAllCategories.bind({ currentItemName: params["name"] }));
}

function addMainItemPromise(querySnapshot) {
    querySnapshot.forEach((doc) => {
        addMainItem(this.imageContainer, this.dataContainer, doc, this.category);
    });
}

function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices.splice(index, 1);
}

function searchInAllCategories(querySnapshot) {  
    let userColorPreference = localStorage.getItem('userColorPreference');
    var color;
    if(userColorPreference != null) {
        let colors = userColorPreference.split(";");
        colors.pop();
        color = choose(colors)[0];
    }
    container = document.getElementsByClassName("mainItemPageBottom")[0];
    
    querySnapshot.forEach((doc) => {
        let categories = doc.data().categories;
        while (container.children.length != MAX_NUMBER_OF_RECOMANDATIONS) {
            let category = choose(categories)[0];
            if(category) {
                db.collection(category).get().then(getItemRecomandationsBySeason.
                    bind({ category: category, currentItemName: this.currentItemName, container: container }));
                if (typeof color != "undefined") {
                    db.collection(category).where("color", "==", color).get().then(addUserPreferenceItem.
                        bind({ category: category, currentItemName: this.currentItemName, container: container }));
                }
            } else {
                break;
            }    
        }
    });
}

function getItemRecomandationsBySeason(querySnapshot) {
    querySnapshot.forEach((doc) => {
        if(this.container.children.length <= MAX_NUMBER_OF_RECOMANDATIONS) {
            let seasons = doc.data().season;
            for (let i in seasons) {
                if (seasons[i] == currentSeason && doc.data().name != this.currentItemName) {
                    renderRecomandation(doc, this.category);
                    break;
                }
            }
        } 
    });
}

function addUserPreferenceItem(querySnapshot) {
    querySnapshot.forEach((doc) => {
        if (this.container.children.length < MAX_NUMBER_OF_RECOMANDATIONS) {
            if (doc.data().name != this.currentItemName) {
                renderRecomandation(doc, this.category);
            }
        }
    });
}

function renderRecomandation(doc, category) {
    let container = document.getElementsByClassName('mainItemPageBottom')[0];
    if (container !== undefined) {
        for(let children of container.children) {
            if (children.firstChild.firstChild.alt == category + ":" + doc.data().name) {
                return;
            }
        }
        addElementsToContainer(container, doc, category)
    }
}

function addMainItem(imageContainer, dataContainer, doc, category) {
    let parrentDataContainer = dataContainer.parentElement;
    parrentDataContainer.setAttribute("imtepscope", "");
    parrentDataContainer.setAttribute("itemptype", "https://schema.org/Offer");
    let img = document.createElement('IMG');
    img.setAttribute("alt", category + ":" + doc.data().name);
    img.setAttribute("itemprop", "image");

    waitImage(img, null, null, "itemImage");
    renderImage(img, doc).then(() => {
        let cartButton = document.getElementsByClassName("addToCart")[0];
        cartButton.addEventListener("click", storeInSeasonStorageItemCart);
        cartButton.parentElement.setAttribute("href", "#user_cart");
    });
    imageContainer.appendChild(img)

    let childRef = dataContainer.firstChild;
    let title = document.createElement('p');
    title.setAttribute("id", "title");
    title.setAttribute("itemprop", "name");
    title.innerText = doc.data().name;
    dataContainer.insertBefore(title, childRef);

    let price = document.createElement('p');
    price.setAttribute("id", "price");
    price.setAttribute("itemprop", "price");
    price.innerText = "Price: " + doc.data().price + " " + CURRENCY;
    dataContainer.insertBefore(price, childRef);

    let p = document.createElement('p');
    p.innerText = "Description: ";
    dataContainer.insertBefore(p, childRef);

    let description = document.createElement('p');
    description.setAttribute("itemprop", "description");
    description.innerText = doc.data().description;
    dataContainer.insertBefore(description, childRef);

    imageConfig = getWebCamConfig(doc);
}

function getWebCamConfig(doc) {
    let imageWebCamParam = doc.data().parameters.split('_');
    imageWebCamParam = imageWebCamParam.map(param => +param);

    let imageConfig = {
        filterX: imageWebCamParam[0],
        filterY: imageWebCamParam[1],
        filterWidth: imageWebCamParam[2],
        filterHeight: imageWebCamParam[3]
    };

    let imgPath = WEBCAM_FOLDER + doc.data().img_name.replace('jpg', 'png');
    storage.ref(imgPath).getDownloadURL().then(
        url => imageConfig.src = url
    );

    return imageConfig;
}

function enableCartImgHover() {
    document.getElementById("imgCart").style.backgroundImage = "url('./all_icons/cart_black_40x35px.png')"
}

function disableCartImgHover() {
    document.getElementById("imgCart").style.backgroundImage = "url('./all_icons/cart_gray_40x35px.png')"
}

function enableHatImgHover() {
    document.getElementById("imgHat").style.backgroundImage = "url('./all_icons/hat_black_simple_40px.png')"
}

function disableHatImgHover() {
    document.getElementById("imgHat").style.backgroundImage = "url('./all_icons/hat_gray_simple_40px.png')"
}

function changeToWebCam() {
    initObserver();

    document.getElementById("mainItemPage").style.display = "none";
    document.getElementById("mainWebcamPage").style.display = "flex";

    window.pageSizeMedia = window.matchMedia('(max-width: 825px)');
    window.pageSizeMedia.addListener(resizeWebcam);

    resizeWebcam(window.pageSizeMedia);
}

function resizeWebcam(mediaEvent) {
    window.videoWebCam = document.getElementById('videoWebCam');
    let canvasAccessoryLayer = document.getElementById('canvasAccessoryLayer');
    let webcamDiv = document.getElementById('webcam');
    let takePictureButton = document.getElementById('takePhoto');

    if (window.videoWebCam.srcObject !== null) {
        stopStreamedVideo(window.videoWebCam);
    }

    if ((mediaEvent !== undefined) && (mediaEvent.matches)) {
        window.videoWebCam.width = canvasAccessoryLayer.width = WEB_CAM_WIDTH_MIN;
        window.videoWebCam.height = canvasAccessoryLayer.height = WEB_CAM_HEIGHT_MIN;
        webcamDiv.style.width = WEB_CAM_WIDTH_MIN + 'px';
        webcamDiv.style.height = WEB_CAM_HEIGHT_MIN + 45 + 'px';
        takePictureButton.style.marginTop = WEB_CAM_HEIGHT_MIN + 10 + 'px';
    } else {
        window.videoWebCam.width = canvasAccessoryLayer.width = WEB_CAM_WIDTH_MAX;
        window.videoWebCam.height = canvasAccessoryLayer.height = WEB_CAM_HEIGHT_MAX;
        webcamDiv.style.width = WEB_CAM_WIDTH_MAX + 'px';
        webcamDiv.style.height = WEB_CAM_HEIGHT_MAX + 50 + 'px';
        takePictureButton.style.marginTop = WEB_CAM_HEIGHT_MAX + 15 + 'px';
    }

    enableFaceTracking();
}

function enableFaceTracking() {
    let canvasAccessoryLayer = document.getElementById('canvasAccessoryLayer');
    initTracking('#videoWebCam', canvasAccessoryLayer, imageConfig);
}

function initTracking(videoId, drawingCanvas, imageConfig) {
    let drawingContext = drawingCanvas.getContext('2d');
    // for flipping the webcam
    drawingContext.translate(drawingCanvas.width, 0);
    drawingContext.scale(-1, 1);

    let tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(TRACKER_CONFIG.initialScale);
    tracker.setStepSize(TRACKER_CONFIG.stepSize);
    tracker.setEdgesDensity(TRACKER_CONFIG.edgesDensity);
    tracking.track(videoId, tracker, { camera: true });

    const accessoryLayerImage = new Image();
    accessoryLayerImage.crossOrigin = "Anonymous";
    accessoryLayerImage.src = imageConfig.src;

    tracker.on('track', function (event) {
        drawingContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);

        event.data.forEach(function (trackData) {
            setTimeout(drawingContext.drawImage(accessoryLayerImage,
                trackData.x + (imageConfig.filterX * trackData.width),
                trackData.y + (imageConfig.filterY * trackData.height),
                trackData.width * imageConfig.filterWidth,
                trackData.height * imageConfig.filterHeight
            ), WEB_CAM_TIMEOUT);
        });
    });
}

function takePictureButton() {
    let canvasAccessoryLayer = document.getElementById('canvasAccessoryLayer');
    let videoWebCamWidth = window.videoWebCam.width;
    let videoWebCamHeight = window.videoWebCam.height;

    let flashCanvas = document.createElement('canvas');
    flashCanvas.style.position = 'absolute';
    flashCanvas.width = videoWebCamWidth;
    flashCanvas.height = videoWebCamHeight;
    flashCanvas.style.backgroundColor = 'white';
    canvasAccessoryLayer.parentElement.appendChild(flashCanvas);
    flashCanvas.classList.add('flash');
    setTimeout(() => {
        canvasAccessoryLayer.parentElement.removeChild(flashCanvas);
    }, 200);

    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = videoWebCamWidth;
    tempCanvas.height = videoWebCamHeight;

    let tempContext = tempCanvas.getContext('2d');
    tempContext.translate(tempCanvas.width, 0);
    tempContext.scale(-1, 1);
    tempContext.drawImage(window.videoWebCam, 0, 0, videoWebCamWidth, videoWebCamHeight);

    tempContext.translate(tempCanvas.width, 0);
    tempContext.scale(-1, 1);
    tempContext.drawImage(canvasAccessoryLayer, 0, 0);

    let localeDate = new Date().toLocaleString('en-GB').replace(',', '').replace(' ', '_');
    let localKey = 'hege_picture_' + videoWebCamWidth + '_' + videoWebCamHeight + '_' + localeDate;
    localStorage.setItem(localKey, tempCanvas.toDataURL());
}

function initObserver() {
    window.observer = new MutationObserver(checkAndDisableWebcam);

    window.observer.observe(document, {
        atributes: true,
        childList: true,
        subtree: true
    });
}

function checkAndDisableWebcam(mutation) {
    if ((window.videoWebCam !== null) && (window.videoWebCam !== undefined)) {
        if ((mutation[0].addedNodes[0] !== undefined) && (!mutation[0].addedNodes[0].classList.contains('flash'))) {
            stopStreamedVideo(window.videoWebCam);
            window.observer.disconnect();
            window.videoWebCam = null;
        }
    }
}

function backToItemPage() {
    document.getElementById("mainItemPage").style.display = "flex";
    document.getElementById("mainWebcamPage").style.display = "none";
    window.pageSizeMedia.removeListener(resizeWebcam);
    stopStreamedVideo(window.videoWebCam);
}

function stopStreamedVideo(videoElem) {
    let stream = videoElem.srcObject;
    if (stream !== null) {
        let tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoElem.srcObject = null;
    }
}

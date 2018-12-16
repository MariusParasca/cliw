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

var imageConfig = {
    src: './images_with_no_background/red_hat_no_bkgd.png',
    filterX: 0,
    filterY: -0.75,
    filterWidth: 1.1,
    filterHeight: 1.2
};

// global variables used
window.pageSizeMedia;
window.videoWebCam;
window.observer;

export function initPage() {
    document.getElementsByClassName("addToCart")[0].addEventListener("mouseover", enableCartImgHover);
    document.getElementsByClassName("addToCart")[0].addEventListener("mouseout", disableCartImgHover);
    document.getElementById("tryIt").addEventListener("mouseover", enableHatImgHover);
    document.getElementById("tryIt").addEventListener("mouseout", disableHatImgHover);
    document.getElementById("tryIt").addEventListener("click", changeToWebCam);
    document.getElementById("backToItem").addEventListener("click", backToItemPage);
    document.getElementById("takePhoto").addEventListener("click", takePictureButton);
    initObserver();
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

    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = videoWebCamWidth;
    tempCanvas.height = videoWebCamHeight;
    tempCanvas.getContext('2d').drawImage(window.videoWebCam, 0, 0, videoWebCamWidth, videoWebCamHeight);
    tempCanvas.getContext('2d').drawImage(canvasAccessoryLayer, 0, 0);

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

function checkAndDisableWebcam() {
    if ((window.videoWebCam !== null) && (window.videoWebCam !== undefined)) {
        stopStreamedVideo(window.videoWebCam);
        window.observer.disconnect();
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
    let tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    videoElem.srcObject = null;
}

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

// needed the global variable in order to remove the listener at the end
var pageSizeMedia;

export function initPage() {
    document.getElementsByClassName("addToCart")[0].addEventListener("mouseover", enableCartImgHover);
    document.getElementsByClassName("addToCart")[0].addEventListener("mouseout", disableCartImgHover);
    document.getElementById("tryIt").addEventListener("mouseover", enableHatImgHover);
    document.getElementById("tryIt").addEventListener("mouseout", disableHatImgHover);
    document.getElementById("tryIt").addEventListener("click", changeToWebCam);
    document.getElementById("backToItem").addEventListener("click", backToItemPage);
    document.getElementById("takePhoto").addEventListener("click", takePictureButton);
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

    pageSizeMedia = window.matchMedia('(max-width: 825px)');
    pageSizeMedia.addListener(resizeWebcam);

    resizeWebcam(pageSizeMedia);
}

function resizeWebcam(mediaEvent) {    
    let videoWebCam = document.getElementById('videoWebCam');
    let canvasAccessoryLayer = document.getElementById('canvasAccessoryLayer');
    let webcamDiv = document.getElementById('webcam');
    let takePictureButton = document.getElementById('takePhoto');

    if (videoWebCam.srcObject !== null) {
        stopStreamedVideo(videoWebCam);
    }

    if ((mediaEvent !== undefined) && (mediaEvent.matches)) {
        videoWebCam.width = canvasAccessoryLayer.width = WEB_CAM_WIDTH_MIN;
        videoWebCam.height = canvasAccessoryLayer.height = WEB_CAM_HEIGHT_MIN;
        webcamDiv.style.width = WEB_CAM_WIDTH_MIN + 'px';
        webcamDiv.style.height = WEB_CAM_HEIGHT_MIN + 45 + 'px';
        takePictureButton.style.marginTop = WEB_CAM_HEIGHT_MIN + 10 + 'px';
    } else {
        videoWebCam.width = canvasAccessoryLayer.width = WEB_CAM_WIDTH_MAX;
        videoWebCam.height = canvasAccessoryLayer.height = WEB_CAM_HEIGHT_MAX;
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
    let videoWebCam = document.getElementById('videoWebCam');
    let canvasAccessoryLayer = document.getElementById('canvasAccessoryLayer');
    let videoWebCamWidth = videoWebCam.width;
    let videoWebCamHeight = videoWebCam.height;

    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = videoWebCamWidth;
    tempCanvas.height = videoWebCamHeight;
    tempCanvas.getContext('2d').drawImage(videoWebCam, 0, 0, videoWebCamWidth, videoWebCamHeight);
    tempCanvas.getContext('2d').drawImage(canvasAccessoryLayer, 0, 0);
    
    let localeDate = new Date().toLocaleString('en-GB').replace(',', '').replace(' ', '_');
    let localKey = 'hege_picture_' + videoWebCamWidth + '_' + videoWebCamHeight + '_' + localeDate;
    localStorage.setItem(localKey, tempCanvas.toDataURL());
}

function backToItemPage() {
    document.getElementById("mainItemPage").style.display = "flex";
    document.getElementById("mainWebcamPage").style.display = "none";
    let videoWebCam = document.getElementById('videoWebCam');
    pageSizeMedia.removeListener(resizeWebcam);
    stopStreamedVideo(videoWebCam);
}

function stopStreamedVideo(videoElem) {
    let stream = videoElem.srcObject;
    let tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    videoElem.srcObject = null;
}
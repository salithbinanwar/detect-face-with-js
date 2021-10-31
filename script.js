const video = document.getElementById('video');

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo)

function startVideo() {
    navigator.getUserMedia(
        {video:{}},
        stream => video.srcObject = stream,
        error => console.log(err)
    )
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = {width: video.width, height: video.height}
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, 
        new faceapi.TinyFaceDetectorOptions).withFaceLandmarks().withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)

        // face land mark draws line
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)

        // drawFaceExpressions detects expressions face 
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        // console.log(faceapi.draw.drawFaceExpressions(canvas, resizedDetections));
    }, 100)
})
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

async function startCamera(){

    const stream = await navigator.mediaDevices.getUserMedia({

        video:true

    });

    video.srcObject = stream;

}

startCamera();

const hands = new Hands({

    locateFile:(file)=>{

        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;

    }

});

hands.setOptions({

    maxNumHands:2,

    modelComplexity:1,

    minDetectionConfidence:0.7,

    minTrackingConfidence:0.7

});

hands.onResults(onResults);

const camera = new Camera(video,{

    onFrame:async()=>{

        await hands.send({

            image:video

        });

    },

    width:1280,

    height:720

});

camera.start();

function onResults(results){

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    if(results.multiHandLandmarks){

        for(const landmarks of results.multiHandLandmarks){

            drawConnectors(
                ctx,
                landmarks,
                HAND_CONNECTIONS,
                {
                    color:"#ffffff",
                    lineWidth:2
                }
            );

            drawLandmarks(
                ctx,
                landmarks,
                {
                    color:"#00ffff",
                    fillColor:"#ffffff",
                    radius:5
                }
            );

        }

    }

}

import { useComponentSize } from "react-use-size";
import ReactPlayer from 'react-player';
import React, {useRef, useState, useEffect} from 'react';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import tf from '@tensorflow/tfjs';
const cocoSsd = require('@tensorflow-models/coco-ssd');
const tfconv = require("@tensorflow/tfjs-converter");

const model = await cocoSsd.load({base: "mobilenet_v2"});
//const model = await tfconv.loadGraphModel("https://kaggle.com/models/rishitdagli/yolo-cppe5/frameworks/tfJs/variations/tfjs-default/versions/1");
function Player({vref, x, y, w, h, ...props}){
    return <ReactPlayer 
    ref={vref}
    hidden={true}
    muted={true} playing={true} playsinline={true} playbackRate={1.05} {...props}
    onPause={(v)=>{
        //alert('pause');
        //v.target.play();
    }}
    onError={(v)=>{
        //alert('error');
        //v.target.play();
    }}
    onEnded={(v)=>{
        //alert('ended');
        //v.target.play();
    }}
    />
}

export default function QuadCamera() {
    const { ref, height, width } = useComponentSize();
    const video1Ref = useRef();
    const video2Ref = useRef();
    const video3Ref = useRef();
    const video4Ref = useRef();
    const canvasRef = useRef();

    useEffect(() => {
        let animationFrame = null;
        let j = 0;

        async function render() {
            j++;
            if (j > 1 && video1Ref.current.getInternalPlayer() && video2Ref.current.getInternalPlayer() && video3Ref.current.getInternalPlayer() && video4Ref.current.getInternalPlayer()) {
                j = 0;
                let vidWidth = (width) / 2;
                let vidHeight = vidWidth * (480 / 960);
                let vidPad = 0;
                if (height === undefined || width === undefined || height === null || width === null) {
                    vidWidth = 0;
                    vidHeight = 0;
                } else {
                    if (vidHeight * 2 > height) {
                        vidHeight = (height) / 2;
                        vidWidth = vidHeight * 2;
                    }
                    vidPad = vidWidth * 2 - width;
                }

                const ctx = canvasRef.current.getContext('2d');
                ctx.drawImage(video1Ref.current.getInternalPlayer(), 0, 0, vidWidth, vidHeight);
                ctx.drawImage(video2Ref.current.getInternalPlayer(), vidWidth, 0, vidWidth, vidHeight);
                ctx.drawImage(video3Ref.current.getInternalPlayer(), 0, vidHeight, vidWidth, vidHeight);
                ctx.drawImage(video4Ref.current.getInternalPlayer(), vidWidth, vidHeight, vidWidth, vidHeight);

                let predictions = await model.detect(canvasRef.current, 10, 0.25);
                predictions.forEach(pred => {
                    let [x, y, width, height] = pred.bbox;
                    ctx.fillText(pred.class, x, y);
                    ctx.strokeRect(x, y, width, height);
                })
            }
            animationFrame = requestAnimationFrame(render);
        }
        animationFrame = requestAnimationFrame(render);

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, [width, height]);

    let vidWidth = (width)/2;
    let vidHeight = vidWidth*(480/960);
    let vidPad = 0;
    if (height===undefined || width===undefined || height===null || width===null){
        vidWidth=0;
        vidHeight=0;
    }else{
        if (vidHeight*2>height){
            vidHeight=(height)/2;
            vidWidth=vidHeight*2;
        }
        vidPad = vidWidth*2-width;
    }

    return <>
        <div ref={ref} style={{flex:1, margin: 0, padding: 0}}>
            <Player vref={video1Ref} url='http://192.168.1.14:4000/1cam.m3u8'/>
            <Player vref={video2Ref} url='http://192.168.1.14:4000/2cam.m3u8'/>
            <Player vref={video3Ref} url='http://192.168.1.14:4000/3cam.m3u8'/>
            <Player vref={video4Ref} url='http://192.168.1.14:4000/4cam.m3u8'/>
            <canvas ref={canvasRef} width={vidWidth*2} height={vidHeight*2} style={{width: vidWidth*2, height: vidHeight*2, padding: 0, margin: 0}}></canvas>
        </div>        
    </>

}
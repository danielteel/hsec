import { useComponentSize } from "react-use-size";
import ReactPlayer from 'react-player';
import React, {useRef, useState, useEffect} from 'react';


function Player({vref, x, y, w, h, ...props}){
    return <ReactPlayer 
    ref={vref}
    style={{position:'absolute', left: x, top: y}} width={w} height={h}
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

export default function QuadCamera(){
    const {ref, height, width} = useComponentSize();
    const [videoRefs, setVideoRefs] = useState([]);
    const video1Ref = useRef();
    const video2Ref = useRef();
    const video3Ref = useRef();
    const video4Ref = useRef();
    const canvasRef = useRef();

    useEffect(()=>{
        let animationFrame = null;

        function render(){
            if (video1Ref.current.getInternalPlayer() && video2Ref.current.getInternalPlayer() && video3Ref.current.getInternalPlayer() && video4Ref.current.getInternalPlayer()){
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

                const ctx = canvasRef.current.getContext('2d');
                ctx.drawImage(video1Ref.current.getInternalPlayer(), 0, 0, vidWidth, vidHeight);
                ctx.drawImage(video2Ref.current.getInternalPlayer(), vidWidth, 0, vidWidth, vidHeight);
                ctx.drawImage(video3Ref.current.getInternalPlayer(), 0, vidHeight, vidWidth, vidHeight);
                ctx.drawImage(video4Ref.current.getInternalPlayer(), vidWidth, vidHeight, vidWidth, vidHeight);
            }
            animationFrame=requestAnimationFrame(render);
        }
        animationFrame=requestAnimationFrame(render);

        return ()=>{
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
        <div ref={ref} style={{flex:1}}>
            <canvas ref={canvasRef} width={vidWidth*2} height={vidHeight*2}></canvas>
        </div>        
        <Player vref={video1Ref} x={ref.current?.offsetLeft-vidPad/2+21500} y={ref.current?.offsetTop} w={vidWidth} h={vidHeight} url='http://192.168.1.14:4000/1cam.m3u8'/>
        <Player vref={video2Ref} x={ref.current?.offsetLeft+vidWidth-vidPad/2+21500} y={ref.current?.offsetTop} w={vidWidth} h={vidHeight} url='http://192.168.1.14:4000/2cam.m3u8'/>
        <Player vref={video3Ref} x={ref.current?.offsetLeft-vidPad/2+21500} y={ref.current?.offsetTop+vidHeight} w={vidWidth} h={vidHeight} url='http://192.168.1.14:4000/3cam.m3u8'/>
        <Player vref={video4Ref} x={ref.current?.offsetLeft+vidWidth-vidPad/2+21500} y={ref.current?.offsetTop+vidHeight} w={vidWidth} h={vidHeight} url='http://192.168.1.14:4000/4cam.m3u8'/>
    </>

}
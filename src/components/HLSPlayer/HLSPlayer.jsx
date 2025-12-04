import { useEffect, useRef, useState } from "react";
import Hls from 'hls.js';
import styles from "./HLSPlayer.module.scss";

export default function HLSPlayer({src, poster, onEnded, title}){

    const videoRef = useRef(null);
    const wrapperRef = useRef(null);
    // const playerRef = useRef(null);

    const lastTapRef = useRef(0);

    const [playing, setPlaying] = useState(false);
    const [current, setCurrent] = useState(0);
    const [duration, setDuration] = useState(0);

    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);

    const [isFullscreen, setIsFullscreen] = useState(false);

    const [showControls, setShowControls] = useState(true);
    const [buffering, setBuffering] = useState(true);
    const [fade, setFade] = useState(false);

    useEffect(() => {
    const video = videoRef.current;
    let hls = null;

    setBuffering(true);        // Показываем спиннер при смене трека
    setPlaying(false);

    // ==== 1. ИНИЦИАЛИЗАЦИЯ HLS ====
    if (Hls.isSupported()) {
        hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
        });

        hls.attachMedia(video);
        hls.loadSource(src);

        // Когда HLS манифест загружен
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setDuration(video.duration || 0);

            video.muted = true;        // Chrome Autoplay policy
            video.play()
                .then(() => {
                    setPlaying(true);
                    setBuffering(false);
                })
                .catch(err => {
                    console.warn("Autoplay blocked:", err);
                });
        });

        // Ошибки HLS
        hls.on(Hls.Events.ERROR, (evt, data) => {
            console.error("HLS error:", data);
        });
    }

    // ==== 2. ФОЛЛБЭК ДЛЯ SAFARI ====
    else {
        video.src = src;

        video.onloadedmetadata = () => {
            setDuration(video.duration || 0);

            video.muted = true;
            video.play()
                .then(() => {
                    setPlaying(true);
                    setBuffering(false);
                })
                .catch(err => console.warn("Autoplay blocked:", err));
        };
    }

    // ==== 3. СИСТЕМА ОТСЛЕЖИВАНИЯ БУФЕРИЗАЦИИ ====
    const onWaiting = () => setBuffering(true);
    const onLoadStart = () => setBuffering(true);
    const onStalled = () => setBuffering(true);

    const onCanPlay = () => setBuffering(false);
    const onPlaying = () => setBuffering(false);

   const onTimeUpdate = () => {
    const t = video.currentTime;
    const d = video.duration || 0;

    setCurrent(t);
    setDuration(d);

    // 🔥 FADE-OUT за 10 секунд до конца
    if (d > 0 && t >= d - 4) {
        setFade(true);
    }
};

    video.addEventListener("waiting", onWaiting);
    video.addEventListener("loadstart", onLoadStart);
    video.addEventListener("stalled", onStalled);

    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("timeupdate", onTimeUpdate);

    // ==== 4. ОЧИСТКА ПРИ СМЕНЕ ТРЕКА ====
    return () => {
        video.removeEventListener("waiting", onWaiting);
        video.removeEventListener("loadstart", onLoadStart);
        video.removeEventListener("stalled", onStalled);

        video.removeEventListener("canplay", onCanPlay);
        video.removeEventListener("playing", onPlaying);
        video.removeEventListener("timeupdate", onTimeUpdate);

        if (hls) {
            hls.destroy();
        }
    };
}, [src]);

    useEffect(() => {
    let hideTimeout;
    function handleMouseMove() {
        setShowControls(true);
        clearTimeout(hideTimeout);

        if (playing) {
            hideTimeout = setTimeout(() => setShowControls(false), 2000);
        }
    }

    const wrapper = wrapperRef.current;
    wrapper.addEventListener("mousemove", handleMouseMove);

    return () => {
        wrapper.removeEventListener("mousemove", handleMouseMove);
        clearTimeout(hideTimeout);
    };
    }, [playing]);

    useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleClick = () => {
        togglePlay();  
    };

    video.addEventListener("click", handleClick);

    return () => {
        video.removeEventListener("click", handleClick);
    };
}, [playing]);  

useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleDoubleClick = () => {
        toggleFullscreen();
    }

    video.addEventListener("dblclick", handleDoubleClick);

    return () => {
        video.removeEventListener("dblclick", handleDoubleClick)
    }
},[isFullscreen])

useEffect(() => {
    const handler = () => {
        if (!document.fullscreenElement && !document.webkitFullscreenElement){
            setIsFullscreen(false);
        }
    }

    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);

    return () => {
        document.removeEventListener("fullscreenchange", handler);
        document.removeEventListener("webkitfullscreenchange", handler);
    }
},[])

useEffect(() => {
    const video = videoRef.current;

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile){
        video.addEventListener("touchend", handleMobileTap);
    }

    return () => {
        if (isMobile){
            video.removeEventListener("touchend", handleMobileTap)
        }
    }
},[])

useEffect(() => {
    const video = videoRef.current;

    function handleEnded(){
        if (typeof onEnded === 'function'){
            onEnded();
        }
    }

    video.addEventListener("ended", handleEnded);

    return () => {
        video.removeEventListener("ended", handleEnded);
    }
},[])

useEffect(() => {
    setFade(true);

    const t = setTimeout(() => {
        setFade(false)
    },600)

    return () => clearTimeout(t)
},[src])

function handleMobileTap(){

    const now = Date.now();
    const delta = now - lastTapRef.current;

    // если 300–350 мс — считаем двойным тапом
    if (delta < 350 && delta > 0) {
        toggleFullscreen();
    }

    lastTapRef.current = now;
}

    function togglePlay(){
        const video = videoRef.current;

        if (video.paused) {
            video.play();
            setPlaying(true);
            setShowControls(true);
        } else {
            video.pause();
            setPlaying(false);
            setShowControls(true);
            setBuffering(false);
        }
    }

    function handleSeek(e){
        const video = videoRef.current;
        const percent = e.target.value;
        const time = (percent / 100) * duration;
        video.currentTime = time;
        setCurrent(time);
    }

    function handleVolume(e){
        const video = videoRef.current;
        const vol = e.target.value / 100;

        video.volume = vol;
        setVolume(vol);

        if (vol === 0) {
            video.muted = true;
            setMuted(true);
        } else {
            video.muted = false;
            setMuted(false);
        }
    }

    function toggleMute() {
    const video = videoRef.current;

    if (muted) {
        video.muted = false;
        setMuted(false);

        if (volume === 0) {
            video.volume = 1;
            setVolume(1);
        }
    } else {
        video.muted = true;
        setMuted(true);
    }
}

   function toggleFullscreen() {
    const wrapper = wrapperRef.current;

    // === ВХОД В FULLSCREEN ===
    if (
        !document.fullscreenElement &&
        !document.webkitFullscreenElement
    ) {
        if (wrapper.requestFullscreen) {
            wrapper.requestFullscreen();
        } else if (wrapper.webkitRequestFullscreen) {
            wrapper.webkitRequestFullscreen(); // Safari
        }

        setIsFullscreen(true);
        return;
    }

    // === ВЫХОД ИЗ FULLSCREEN ===
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen(); // Safari
    }

    setIsFullscreen(false);
}



    return(
        <div className={styles.wrapper} ref={wrapperRef}>
            <video 
            ref={videoRef}
            poster={poster}
            className={`${styles.video} ${fade ? styles.fadeOut : styles.fadeIn}`}
            playsInline
            />
            {buffering && (
                <div className={styles.spinner}></div>
            )}

            <div className={styles.titleBar}>
                {title}
            </div>

            <div className={`${styles.controls} ${!showControls ? styles.hidden : ""}`}>
    
                 <div className={styles.left}>
                    <button onClick={togglePlay}className={`${styles.playBtn} ${playing ? styles.playing : ""}`}>
                        {playing ? "⏸" : "▶️"}
                    </button>
                </div>

                <div className={styles.center}>
                    <input 
                        type="range" 
                        min="0"
                        max="100"
                        value={(current / duration) * 100 || 0}
                        onChange={handleSeek}
                        className={styles.seek}
                    />

                    <div className={styles.volumeBlock}>
                        <button onClick={toggleMute} className={`${styles.muteBtn} ${muted ? styles.muted : ""}`}>
                            {muted || volume === 0 ? "🔇" : "🔊"}
                        </button>

                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={muted ? 0 : volume * 100}
                            onChange={handleVolume}
                            className={styles.volume}
                        />
                    </div>
                </div>

                <div className={styles.right}>
                    

                    <button onClick={toggleFullscreen} className={styles.fullBtn}>
                        {isFullscreen ? "🗗" : "🗖"}
                    </button>

                    <div className={styles.time}>
                        {formatTime(current)} / {formatTime(duration)}
                    </div>
                </div>
            </div>

        </div>
    )

    function formatTime(sec){
        if (!sec) return "0:00";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }
}
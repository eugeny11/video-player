import HLSPlayer from './components/HLSPlayer/HLSPlayer'
import styles from "./components/HLSPlayer/HLSPlayer.module.scss";
import './App.css'
import { useState } from 'react';
import poster from "./assets/poster.png";

function App() {

const playlist = [
    {
        title: "Animation 1",
        src: "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/gear1/prog_index.m3u8",
    },
    {
        title: "Animation 2",
        src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    },
    
];


const [currentIndex, setCurrentIndex] = useState(0);

function handleNextVideo() {
    setCurrentIndex(prev =>
        prev + 1 < playlist.length ? prev + 1 : 0   
    );
}

  return (
    <>
      <HLSPlayer
        key={currentIndex}
        src={playlist[currentIndex].src}
        poster={playlist[currentIndex].poster}
        onEnded={handleNextVideo}
        title={playlist[currentIndex].title}
      />

      <div className={styles.playlist}>
  {playlist.map((item, i) => (
    <div
      key={i}
      className={
        `${styles.item} ${i === currentIndex ? styles.active : ""}`
      }
      onClick={() => setCurrentIndex(i)}
    >
      <img src={poster} alt={item.title} className={styles.thumb} />

      <div className={styles.textBlock}>
        <span className={styles.title}>{item.title}</span>
      </div>
    </div>
  ))}
</div>

    </>
  )
}

export default App

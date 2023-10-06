import { useState, useEffect } from 'react';
import io from 'socket.io-client';



export default function Home() {
  const [videoURL, setVideoURL] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [videoChunks, setVideoChunks] = useState([])
  const [final, setFinal] = useState(false)
  const [skt, setSkt] = useState(null)
  
  
  useEffect(() => {
    const socketInitializer = async () => {
      await fetch('api/socket')
     
      const socket = io();
    
      socket.on('connect', () => {
        console.log('Connected');
      });
    
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    
      socket.on('videoInfo', (info) => {
        setVideoInfo(info);
        console.log('Received videoInfo:', info);
      });
    
      setSkt(socket);
    };
    
    socketInitializer()

}, [])


useEffect(() => {
  console.log(videoChunks.length)
  const handleVideoEnd = () => {
    console.log('convertendo')
    setTimeout(() => {
      if (videoChunks.length > 0) {
        // Transforma cada chunk em um Blob
        const blobChunks = videoChunks.map(chunk => new Blob([chunk], { type: 'video/mp4' }));
        console.log('baixando')
        // Cria um Blob a partir dos Blobs dos chunks
        const videoBlob = new Blob(blobChunks, { type: 'video/mp4' });
  
        // Crie um link para fazer o download do vídeo
        const videoUrl = URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = `${videoInfo.videoDetails.title}.mp4`;
        a.click();
  
        // Limpa o estado de chunks após o download
        setVideoChunks([]);
        setFinal(false)
      } else {
        console.log('Chunks ainda não estão prontos')
      }
    }, 3000); // Atrasa a execução do código em 3 segundo
  };
  
  if(videoChunks.length > 1 && final){
    //Se o valor do ultimo chunk for menor que o do penultimo e o download estiver finalizado, inicia a conversão e download
    console.log(videoChunks.length)
    if(videoChunks[videoChunks.length - 1].length < videoChunks[videoChunks.length - 2].length){
      handleVideoEnd()
    }

  }

 



}, [videoChunks, final]);

  useEffect(() => {

    

    const handleVideoChunk = (arrayBufferChunk) => {
      const chunk = new Uint8Array(arrayBufferChunk);
      setVideoChunks(prevChunks => [...prevChunks, chunk]);
    };

    const handleVideoEnd = ()=>{
      setFinal(true)
    }

    
 
  
    if (skt) {
      skt.on('videoChunk', handleVideoChunk);
      skt.on('videoEnd', handleVideoEnd);
    }
  
    return () => {
      if (skt) {
        skt.off('videoChunk', handleVideoChunk);
        skt.off('videoEnd', handleVideoEnd);
      }
    };
  }, [skt, videoInfo, videoChunks]);
  

  const handleDownload = () => {
    if (videoURL && skt) {
      // Limpa o localStorage antes de começar o download
      localStorage.removeItem('videoChunks');
  
      skt.emit('requestVideo', videoURL);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={videoURL}
        onChange={(e) => setVideoURL(e.target.value)}
        placeholder="Enter YouTube video URL"
      />
      <button onClick={handleDownload}>Download Video</button>

      {videoInfo && (
        <div>
          <p>Title: {videoInfo.videoDetails.title}</p>
          <p>Author: {videoInfo.videoDetails.author.name}</p>
        </div>
      )}
    </div>
  );
}

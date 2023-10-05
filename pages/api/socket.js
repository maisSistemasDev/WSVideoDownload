import { Server } from 'socket.io';
import ytdl from 'ytdl-core';  // Importe a função ytdl corretamente
const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io');

    const io = new Server(res.socket.server);
    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);

      socket.on('requestVideo', async (videoURL) => {
        try {
          const videoInfo = await ytdl.getInfo(videoURL);
          const videoStream = ytdl(videoURL, { quality: 'highestvideo' });

          socket.emit('videoInfo', videoInfo);

          videoStream.on('data', (chunk) => {
            socket.emit('videoChunk', chunk);
          });

          videoStream.on('end', () => {
            socket.emit('videoEnd');
          });
        } catch (error) {
          socket.emit('error', error.message);
        }
      });
    });

    res.socket.server.io = io;
  }

  return res.socket.server.io(req, res);
};

export default ioHandler;

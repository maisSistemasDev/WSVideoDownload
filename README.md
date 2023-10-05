# WSVideoDownload

This application is a video download service that allows users to download videos from YouTube. It uses the `ytdl-core` library to download the video and Socket.IO to stream the video data to the client in real-time.

## Installation

1. Clone the repository to your local environment.
2. Run `npm install` to install all necessary dependencies.
3. Run `npm run dev` to start the development server.

## Usage

1. Open the application in your browser.
2. Enter the URL of the YouTube video you want to download into the input field.
3. Click the "Download Video" button to start the download.
4. The video will be downloaded to your machine.

## Code Structure

- `pages/api/socket.js`: This is the Socket.IO server that handles streaming video data to the client.
- `pages/index.js`: This is the main page of the application that contains the user interface for entering the video URL and initiating the download.

## Known Issues

- The last chunk of the video may not be recorded correctly due to the state update timing in React. A temporary workaround is to add a small delay before handling the end event to ensure the last chunk has time to be added to the state.

## Contributing

Contributions are welcome! Please feel free to open an issue or a pull request if you encounter any problems or have any improvement suggestions.

## License

This application is licensed under the MIT license. See the `LICENSE` file for more details.

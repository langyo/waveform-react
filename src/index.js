import 'babel-polyfill';
import React, { useRef } from 'react';
import { render } from 'react-dom';
import { drawWaveform } from './utils';

export function App() {
  const canvasRef = useRef();

  return <div>
    <input
      accept='audio/*'
      type='file'
      name='file'
      id='file'
      onChange={event => {
        const files = event.target.files;
        const context = (new (window.AudioContext
          || window.webkitAudioContext
          || window.mozAudioContext
          || window.oAudioContext)());
        context.resume().then(async () => {
          const filePath = window.URL.createObjectURL(files[0]);
          const response = await fetch(filePath);
          const audioData = await response.arrayBuffer();
          const buffer = await context.decodeAudioData(audioData);
          drawWaveform(buffer, canvasRef.current, 300, 800);
        });
      }}
    />
    <canvas
      ref={canvasRef}
      style={{
        height: '300px',
        width: '800px'
      }}
    />
  </div>;
}

const appElement = document.getElementById('root');

render(<App />, appElement);

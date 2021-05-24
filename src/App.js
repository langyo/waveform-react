import React, { useRef } from 'react';
import { getAudioBuffer, getContext, calculateWaveData, drawWaveform } from './utils';

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
        const context = getContext();
        context.resume().then(() => {
          const filePath = window.URL.createObjectURL(files[0]);
          getAudioBuffer(filePath, context).then(buffer => {
            const data = calculateWaveData(
              buffer,
              800,
              1
            );
            drawWaveform(
              data,
              canvasRef.current,
              300,
              800
            );
          });
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

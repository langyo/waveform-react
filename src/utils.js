/**
 * From url file path download and return Audio Buffer
 */
export async function getAudioBuffer(path, context) {
  const response = await fetch(path);
  const audioData = await response.arrayBuffer();
  return new Promise(resolve =>
    context.decodeAudioData(audioData, buffer => resolve(buffer))
  );
};
/**
 * Get window audio context
 */
export function getContext() {
  window.AudioContext =
    window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext;
  const context = new AudioContext();
  return context;
};
/**
 * Draw a waveform on a canvas
 */
export function drawWaveform(buffer, canvas, height, width) {
  // get the wave data
  const wave = buffer.getChannelData(0);
  // find how many steps we are going to draw
  const step = Math.ceil(wave.length / width);
  // Get array of bounds of each step
  let bounds = [];
  for (let i = 0; i < width; ++i) {
    // get the max and min values at this step
    bounds = [...bounds, wave.slice(i * step, i * step + step).reduce(
      (total, v) => ({
        max: v > total.max ? v : total.max,
        min: v < total.min ? v : total.min
      }),
      { max: -1.0, min: 1.0 }
    )];
  }

  const ctx = canvas.getContext('2d');
  // clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // get our canvas size
  const canvasSize = {
    height: (canvas.height = height),
    width: (canvas.width = width)
  };
  // set up line style
  ctx.fillStyle = '#eee';
  ctx.strokeStyle = '#666';
  // find the max height we can draw
  const maxAmp = canvasSize.height / 2;
  ctx.moveTo(0, maxAmp);
  bounds.forEach((bound, i) => {
    const x = i * 1;
    const y = (1 + bound.min) * maxAmp;
    const width = 1;
    const height = Math.max(1, (bound.max - bound.min) * maxAmp);
    ctx.lineTo(x, y);
    ctx.lineTo(x + width / 2, y + height);
  });
  ctx.stroke();
};

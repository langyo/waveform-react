/**
 * From url file path download and return Audio Buffer
 */
export const getAudioBuffer = async (path, context) => {
  const response = await fetch(path);
  const audioData = await response.arrayBuffer();
  return new Promise((resolve, reject) => {
    context.decodeAudioData(audioData, buffer => {
      return resolve(buffer);
    });
  });
};
/**
 * Get window audio context
 */
export const getContext = () => {
  window.AudioContext =
    window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext;
  const context = new AudioContext();
  return context;
};
/**
 * Calculate all wave data points
 */
export const calculateWaveData = (buffer, width, pointWidth) => {
  // get the wave data
  const wave = buffer.getChannelData(0);
  const pointCnt = width / pointWidth;
  // find how many steps we are going to draw
  const step = Math.ceil(wave.length / pointCnt);
  // Get array of bounds of each step
  return getBoundArray(wave, pointCnt, step);
};
/**
 * Convienence function to draw a point in waveform
 */
const drawPoint = (ctx, x, y, width, height, type) => {
  if (type === 'bar') {
    ctx.fillRect(x, y, width, height);
  } else {
    ctx.lineTo(x, y);
    ctx.lineTo(x + width / 2, y + height);
  }
};
/**
 * Draw all the points in the wave
 */
const drawPoints = (ctx, bounds, maxAmp, scaleFactor = 1) => {
  ctx.moveTo(0, maxAmp);
  bounds.forEach((bound, i) => {
    drawPoint(
      ctx,
      i * 1,
      (1 + bound.min) * maxAmp,
      1,
      Math.max(1, (bound.max - bound.min) * maxAmp) * scaleFactor,
      'line'
    );
  });
  ctx.stroke();
};
/**
 * Draw a waveform on a canvas
 */
export const drawWaveform = (
  bounds,
  canvas,
  height = 300,
  width
) => {
  const ctx = canvas.getContext('2d');
  // clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // get our canvas size
  const canvasSize = {
    height: (canvas.height = height),
    width: (canvas.width = width)
  };
  // set up line style
  ctx.fillStyle = '#333';
  ctx.strokeStyle = '#000';
  // find the max height we can draw
  const maxAmp = canvasSize.height / 2;
  drawPoints(ctx, bounds, maxAmp);
};
/**
 * Calculate the bounds of each step in the buffer
 */
const getBoundArray = (wave, pointCnt, step) => {
  let bounds = [];
  for (let i = 0; i < pointCnt; i++) {
    // get the max and min values at this step
    bounds = [...bounds, getBounds(wave.slice(i * step, i * step + step))];
  }
  return bounds;
};
/**
 * Get the max and min values of an array
 */
const getBounds = values => {
  return values.reduce(
    (total, v) => ({
      max: v > total.max ? v : total.max,
      min: v < total.min ? v : total.min
    }),
    { max: -1.0, min: 1.0 }
  );
};

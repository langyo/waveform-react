import React from 'react';
import Waveform from '../lib';
import { getAudioBuffer, getContext } from './utils';

class App extends React.PureComponent {
  state = {
    buffer: null,
    context: null,
    height: 150,
    markerStyle: {
      color: '#666',
      width: 4
    },
    position: 0,
    responsive: true,
    showPosition: true,
    waveStyle: {
      animate: false,
      color: '#999',
      plot: 'bar',
      pointWidth: 1
    },
    width: 900
  };

  componentWillMount() {
    const context = getContext();
    this.setState({
      context
    });
  }

  handleFile = async event => {
    const files = event.target.files;
    const filePath = window.URL.createObjectURL(files[0]);
    const buffer = await getAudioBuffer(filePath, this.state.context);
    this.setState({ buffer });
  };

  setValue = (val, prop, sub) => {
    if (sub) {
      this.setState(state => ({
        ...state,
        [sub]: {
          ...state[sub],
          [prop]: val
        }
      }));
    } else {
      this.setState({ [prop]: val });
    }
  };

  start = () => {
    this.setState({
      run: true
    });
  };

  stop = () => {
    this.setState({
      run: false
    });
  };

  render() {
    return (
      <div>
        <input
          accept="audio/*"
          type="file"
          name="file"
          id="file"
          onChange={this.handleFile}
        />
        <Waveform
          buffer={this.state.buffer}
          height={200}
          markerStyle={{ color: '#333' }}
          onPositionChange={pos => this.setValue(pos, 'position')}
          position={this.state.position}
          responsive={this.state.responsive}
          showPosition={this.state.showPosition}
          waveStyle={this.state.waveStyle}
          width={800}
        />
      </div>
    );
  }
}

export default App;

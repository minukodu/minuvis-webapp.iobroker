import React from 'react';
import jsQR from 'jsqr';
import { Button } from 'react-onsenui';

export default class QrScanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.videoRef = React.createRef();
    this.canvasRef = React.createRef();
    this.stream = null;
    this.rafId = null;
  }

  componentDidMount() {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        this.stream = stream;
        const video = this.videoRef.current;
        if (!video) {
          // component was closed again before camera permission resolved
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        video.srcObject = stream;
        video.setAttribute('playsinline', 'true');
        video.play();
        this.rafId = requestAnimationFrame(this.tick);
      })
      .catch(err => {
        console.error('QrScanner: camera access failed', err);
        this.setState({ error: 'Kein Zugriff auf die Kamera möglich.' });
      });
  }

  componentWillUnmount() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }

  tick = () => {
    const video = this.videoRef.current;
    const canvas = this.canvasRef.current;
    if (!video || !canvas) {
      return;
    }
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code && code.data) {
        this.props.onScan(code.data);
        return;
      }
    }
    this.rafId = requestAnimationFrame(this.tick);
  };

  render() {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#000',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {this.state.error ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            {this.state.error}
          </div>
        ) : (
          <video
            ref={this.videoRef}
            style={{ flex: 1, width: '100%', height: '100%', objectFit: 'cover' }}
            muted
          />
        )}
        <canvas ref={this.canvasRef} style={{ display: 'none' }} />
        <div style={{ padding: '16px', background: '#000' }}>
          <Button modifier="large--cta" onClick={this.props.onClose}>
            Abbrechen
          </Button>
        </div>
      </div>
    );
  }
}

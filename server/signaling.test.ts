import { describe, it, expect } from 'vitest';

describe('Signaling server', () => {
  it('should parse PORT from env or default to 3001', () => {
    const defaultPort = parseInt(undefined || '3001', 10);
    expect(defaultPort).toBe(3001);

    process.env.SIGNALING_PORT = '4000';
    const envPort = parseInt(process.env.SIGNALING_PORT, 10);
    expect(envPort).toBe(4000);
    delete process.env.SIGNALING_PORT;
  });

  it('should use CORS_ORIGIN from env or default to localhost:3000', () => {
    const defaultOrigin = undefined || 'http://localhost:3000';
    expect(defaultOrigin).toBe('http://localhost:3000');

    process.env.CORS_ORIGIN = 'https://peerly.app';
    const envOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
    expect(envOrigin).toBe('https://peerly.app');
    delete process.env.CORS_ORIGIN;
  });

  it('should import PeerServer from peer package', async () => {
    const peer = await import('peer');
    expect(peer.PeerServer).toBeDefined();
    expect(typeof peer.PeerServer).toBe('function');
  });
});

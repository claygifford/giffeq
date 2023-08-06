import '../styles/globals.css';
import { AuthProvider } from '../lib/context/auth-context';
import { Amplify } from 'aws-amplify';
import awsExports from '../src/aws-exports';
import { MusicProvider } from '../lib/context/music-context';
import { DialogProvider } from '../lib/context/dialog-context';
import { LayoutProvider } from '../lib/context/layout-context';
import { PlaylistProvider } from '../lib/context/playlist-context';

Amplify.configure(awsExports);

function PlaylistApp({ Component, pageProps }) {
  return (
    <DialogProvider>
      <LayoutProvider>
        <AuthProvider {...pageProps}>
          <PlaylistProvider>
            <MusicProvider>              
              <Component {...pageProps} />
            </MusicProvider>
          </PlaylistProvider>
        </AuthProvider>        
      </LayoutProvider>
    </DialogProvider>
  );
}

export default PlaylistApp;

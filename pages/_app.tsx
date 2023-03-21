import '../styles/globals.css';
import { AuthProvider } from '../lib/context/auth-context';
import { Amplify } from 'aws-amplify';
import awsExports from '../src/aws-exports';
import { MusicProvider } from '../lib/context/music-context';
import { DialogProvider } from '../lib/context/dialog-context';

Amplify.configure(awsExports);

function MyApp({ Component, pageProps }) {
  return (
    <DialogProvider>
      <AuthProvider {...pageProps}>
        <MusicProvider>
          <Component {...pageProps} />
        </MusicProvider>
      </AuthProvider>
    </DialogProvider>
  );
}

export default MyApp;

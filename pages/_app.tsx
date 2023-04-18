import '../styles/globals.css';
import { AuthProvider } from '../lib/context/auth-context';
import { Amplify } from 'aws-amplify';
import awsExports from '../src/aws-exports';
import { MusicProvider } from '../lib/context/music-context';
import { DialogProvider } from '../lib/context/dialog-context';
import { LayoutProvider } from '../lib/context/layout-context';

Amplify.configure(awsExports);

function MyApp({ Component, pageProps }) {
  return (
    <DialogProvider>
      <LayoutProvider>
        <AuthProvider {...pageProps}>
          <MusicProvider>
            <Component {...pageProps} />
          </MusicProvider>
        </AuthProvider>
      </LayoutProvider>
    </DialogProvider>
  );
}

export default MyApp;

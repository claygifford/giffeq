import '../styles/globals.css';
import { AuthProvider } from '../lib/context/auth-context';
import { Amplify } from 'aws-amplify';
import awsExports from '../src/aws-exports';
import { MusicProvider } from '../lib/context/music-context';

Amplify.configure(awsExports);

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider {...pageProps}>
      <MusicProvider>
        <Component {...pageProps} />
      </MusicProvider>
    </AuthProvider>
  );
}

export default MyApp;

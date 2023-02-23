import '../styles/globals.css';
import { AuthProvider } from '../lib/context/auth-context';
import { Amplify } from 'aws-amplify';
import awsExports from '../src/aws-exports';

Amplify.configure(awsExports);

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider {...pageProps}>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;

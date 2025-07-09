import "../styles/globals.css";
import "../styles/range.css";
import "../styles/cards.css";
import { AuthProvider } from "../lib/context/auth-context";
import { Amplify } from "aws-amplify";
import awsExports from "../src/aws-exports";
import { MusicProvider } from "../lib/context/music-context";
import { DialogProvider } from "../lib/context/dialog-context";
import { LayoutProvider } from "../lib/context/layout-context";
import { PlaylistProvider } from "../lib/context/playlist-context";
import { HistoryProvider } from "../lib/context/history-context";
import { SearchProvider } from "../lib/context/search-context";
import { ConnectorProvider } from "../lib/context/connector-context";
import { DecisionProvider } from "../lib/context/decision-context";
import { PreferencesProvider } from "../lib/context/preferences-context";

Amplify.configure(awsExports);

function PlaylistApp({ Component, pageProps }) {
  return (
    <DialogProvider>
      <PlaylistProvider>
        <MusicProvider>
          <DecisionProvider>
            <HistoryProvider>
              <SearchProvider>
                <LayoutProvider>
                  <AuthProvider {...pageProps}>
                    <ConnectorProvider>
                      <PreferencesProvider>
                        <Component {...pageProps} />
                      </PreferencesProvider>
                    </ConnectorProvider>
                  </AuthProvider>
                </LayoutProvider>
              </SearchProvider>
            </HistoryProvider>
          </DecisionProvider>
        </MusicProvider>
      </PlaylistProvider>
    </DialogProvider>
  );
}

export default PlaylistApp;

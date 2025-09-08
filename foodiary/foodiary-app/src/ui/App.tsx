import { StyleSheet } from 'react-native';

import {
  HostGrotesk_400Regular,
  HostGrotesk_500Medium,
  HostGrotesk_600SemiBold,
  useFonts,
} from '@expo-google-fonts/host-grotesk';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Greetings } from './screens/Greetings';
import { theme } from './theme';

export default function App() {
  const [isFontLoaded] = useFonts({
    HostGrotesk_400Regular,
    HostGrotesk_500Medium,
    HostGrotesk_600SemiBold,
  });

  if (!isFontLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Greetings />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.lime[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
});

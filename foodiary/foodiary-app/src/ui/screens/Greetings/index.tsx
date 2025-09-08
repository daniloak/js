import React from 'react';

import greetingsBg from '@ui/assets/greetings-bg/image.png';
import { Button } from '@ui/components/Button';
import { Logo } from '@ui/components/Logo';
import { ImageBackground, SafeAreaView } from 'react-native';
import { styles } from './styles';

export function Greetings() {
  return (
    <ImageBackground
      source={greetingsBg}
      resizeMode='cover'
      style={styles.container}
    >
      <SafeAreaView>
        <Logo width={187} height={60} />
        <Button>

        </Button>
      </SafeAreaView>
    </ImageBackground>
  );
}

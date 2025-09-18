import React from 'react';

import greetingsBg from '@ui/assets/greetings-bg/image.png';
import { AppText } from '@ui/components/AppText';
import { Button } from '@ui/components/Button';
import { Logo } from '@ui/components/Logo';
import { SignInBottomSheet } from '@ui/components/SignInBottomSheet';
import { ISignInBottomSheet } from '@ui/components/SignInBottomSheet/ISignInBottomSheet';
import { theme } from '@ui/styles/theme';
import { ImageBackground, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

export function Greetings() {
  const signInBottomSheetRef = React.useRef<ISignInBottomSheet>(null);

  return (
    <>
      <ImageBackground
        source={greetingsBg}
        resizeMode='cover'
        style={styles.container}
      >
        <SafeAreaView style={styles.content}>
          <Logo width={187} height={60} />

          <View style={styles.ctaContainer}>
            <AppText
              color={theme.colors.white}
              weight='semibold'
              size='3xl'
              style={styles.heading}
            >
              Controle sua dieta de forma simples
            </AppText>
            <View
              style={styles.ctaContent}
            >
              <Button>
                Criar minha conta
              </Button>
              <View style={styles.signInContainer}>
                <AppText color={theme.colors.white}>
                  Já tenho uma conta?
                </AppText>
                <TouchableOpacity onPress={() => signInBottomSheetRef.current?.open()}>
                  <AppText
                    color={theme.colors.lime[500]}
                    weight='medium'
                  >
                    Fazer login
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground >
      <SignInBottomSheet ref={signInBottomSheetRef} />
    </>
  );
}

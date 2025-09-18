import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React from 'react';
import { View } from 'react-native';
import { AppText } from '../AppText';
import { Button } from '../Button';
import { FormGroup } from '../FormGroup';
import { Input } from '../Input';
import { ISignInBottomSheet } from './ISignInBottomSheet';
import { styles } from './styles';
import { useSignInBottomSheetController } from './useSignInBottomSheetController';

interface ISignInBottomSheetProps {
  ref: React.Ref<ISignInBottomSheet>;
}

export function SignInBottomSheet({ ref }: ISignInBottomSheetProps) {
  const { bottom, bottomSheetModalRef } = useSignInBottomSheetController(ref);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal ref={bottomSheetModalRef}>
        <BottomSheetView style={[
          styles.container,
          { paddingBottom: bottom },
        ]}>
          <AppText size='3xl' weight='semibold' style={styles.heading}>Acesse a sua conta</AppText>

          <View style={styles.form}>
            <FormGroup label='E-mail' error='E-mail inválido'>
              <Input InputComponent={BottomSheetTextInput} />
            </FormGroup>

            <FormGroup label='Senha'>
              <Input InputComponent={BottomSheetTextInput} />
            </FormGroup>

            <Button>Entrar</Button>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

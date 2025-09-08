import { Pressable } from 'react-native';

interface IButtonProps extends React.ComponentProps<typeof Pressable> {

}

export function Button({ children, ...props }: IButtonProps) {
  return (
    <Pressable {...props}>
      {typeof children}
    </Pressable>
  );
}

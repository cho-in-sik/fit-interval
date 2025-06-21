import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-1 "
      style={[{ paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <Text>1</Text>
    </View>
  );
}

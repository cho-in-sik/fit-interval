import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MenuItem = ({ item, isActive, onPress }: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View
        style={[{ transform: [{ scale: scaleAnim }] }]}
        className={`flex-row items-center p-3 py-4 rounded-lg ${
          isActive ? 'bg-white/20' : 'bg-transparent'
        }`}
      >
        <Ionicons
          name={item.icon}
          size={22}
          color={isActive ? '#EC4899' : 'white'}
        />
        <Text
          className={`text-lg ml-4 ${
            isActive ? 'text-white font-bold' : 'text-white opacity-80'
          }`}
        >
          {item.name}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export default function Drawer({ drawerVisible, setDrawerVisible }: any) {
  const drawerWidth = Dimensions.get('window').width * 0.7;
  const slideAnim = useRef(new Animated.Value(drawerWidth)).current;
  const pathname = usePathname();

  useEffect(() => {
    if (drawerVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [drawerVisible]);

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: drawerWidth,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setDrawerVisible(false);
    });
  };

  const handleNavigation = (screen: string) => {
    router.push(screen);
    // You can add navigation logic here.
    // For now, it just closes the drawer.
    closeDrawer();
  };

  const menuItems = [
    { name: '홈', icon: 'timer-outline', id: '/' },
    { name: '설정', icon: 'settings-outline', id: '/settings' },
    { name: '운동기록', icon: 'reader-outline', id: '/records' },
  ];

  return (
    <Modal
      visible={drawerVisible}
      transparent={true}
      animationType="none"
      onRequestClose={closeDrawer}
    >
      <TouchableOpacity
        className="flex-1 bg-black/20"
        activeOpacity={1}
        onPressOut={closeDrawer}
      >
        <Animated.View
          style={[
            {
              width: drawerWidth,
              transform: [{ translateX: slideAnim }],
            },
          ]}
          className="h-full shadow-2xl ml-auto rounded-2xl overflow-hidden"
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={{ flex: 1 }}
          >
            <TouchableOpacity activeOpacity={1} className="flex-1">
              <SafeAreaView className="flex-1 p-5 mx-3">
                <View className="flex-row justify-between items-center mb-12 mt-2">
                  <Text className="text-2xl font-bold text-white">Menu</Text>
                  <TouchableOpacity
                    onPress={closeDrawer}
                    className="w-8 h-8 items-center justify-center rounded-full bg-white/20"
                  >
                    <Ionicons name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>

                <View className="space-y-6">
                  {menuItems.map((item) => (
                    <MenuItem
                      key={item.name}
                      item={item}
                      isActive={
                        pathname === item.id ||
                        (pathname === '/' && item.id === '/')
                      }
                      onPress={() => handleNavigation(item.id)}
                    />
                  ))}
                </View>
              </SafeAreaView>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

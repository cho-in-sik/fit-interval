import 'dotenv/config';

export default {
  expo: {
    name: 'timerer',
    slug: 'timerer',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    splash: {
      image: './assets/images/kini.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    extra: {
      EXPO_PUBLIC_KAKAO_REST_API_KEY:
        process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY,
    },
  },
};

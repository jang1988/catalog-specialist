import { Image, Dimensions, View } from 'react-native';
const { width } = Dimensions.get('window');

export default function HeaderLogo() {
  return (
    <View 
      className="w-[90%] h-[60%] mt-14 mb-3"
      style={{
        width: width * 0.9,
        height: width * 0.6,
        borderRadius: 12,
        shadowColor: '#490fb6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
        backgroundColor: 'transparent',
      }}
    >
      <Image
        source={{ uri: 'https://jsffbeiavluztxwfygzl.supabase.co/storage/v1/object/public/images/main_banner.webp' }}
        className="w-full h-full object-cover rounded-xl"
        style={{
          borderRadius: 12,
          borderWidth: 1,
          borderColor: 'rgba(73, 15, 182, .5)',
        }}
      />
    </View>
  );
}
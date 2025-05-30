import { CategoryHeaderProps } from '@/types/interfaces';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeft } from 'react-native-feather';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

export const CategoryHeader = ({
  selectedGroup,
  category,
  groups,
  onBackPress,
}: CategoryHeaderProps) => {

  
  return (
    <LinearGradient
      colors={['#1F2937', '#111827']}
      className="pb-4 shadow-lg"
      style={{ paddingTop: 48, paddingBottom: 15 }}
			start={{ x: 0, y: 0 }}
    >
      <Animated.View
        entering={FadeInDown.duration(300).springify()}
        className="flex-row items-center justify-center px-4"
      >
        <TouchableOpacity
          onPress={onBackPress}
          className="absolute left-4 bg-white/10 rounded-2xl p-3 shadow-md top-[-10px]"
          activeOpacity={0.8}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ChevronLeft width={28} height={28} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
        
        <View className="flex-1 items-center px-14">
          <Text
            className="text-white text-2xl font-bold text-center tracking-wide"
            numberOfLines={2}
            ellipsizeMode="tail"
            accessibilityRole="header"
          >
            {selectedGroup
              ? groups.find((g) => g.id === selectedGroup)?.name || 'Група'
              : category || 'Категорія'}
          </Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
};
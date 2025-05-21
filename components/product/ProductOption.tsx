import { View, Text, TouchableOpacity } from 'react-native';

type ProductOptionProps = {
  title: string;
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
};

export const ProductOption = ({
  title,
  options,
  selectedOption,
  onSelect,
}: ProductOptionProps) => {
  if (options.length === 0) return null;

  return (
    <View className='mb-4'>
      <Text className='text-white text-xl font-semibold mb-2'>{title}:</Text>
      <View className='flex-row flex-wrap gap-2'>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            onPress={() => onSelect(option)}
            className={`px-3 py-2 rounded ${
              selectedOption === option ? 'bg-white' : 'bg-gray-700'
            }`}
          >
            <Text
              className={`${
                selectedOption === option
                  ? 'text-primary font-bold'
                  : 'text-light-200'
              }`}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
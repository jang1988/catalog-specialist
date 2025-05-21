import { View, Text } from 'react-native';

type DeliveryInfoProps = {
  hasDeliveryInfo: () => boolean;
  getDeliveryInfo: () => string;
};

export const DeliveryInfo = ({ hasDeliveryInfo, getDeliveryInfo }: DeliveryInfoProps) => {
  if (!hasDeliveryInfo()) return null;

  return (
    <View className='mb-4 bg-yellow-600/60 p-3 rounded-lg'>
      <Text className='text-yellow-200 font-semibold text-base'>
        ⚠️ Увага: Доставка здійснюється за {getDeliveryInfo()}
      </Text>
    </View>
  );
};
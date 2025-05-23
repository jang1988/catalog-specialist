import { Product, Variant } from '@/types/interfaces';
import { Text, View } from 'react-native';

interface ProductInfoProps {
	product?: Product;
	actualVariant: Variant;
	getTypeName: (type: string) => string;
	hasFlow: () => boolean;
}

export const ProductInfo = ({
	product,
	actualVariant,
	getTypeName,
	hasFlow,
}: ProductInfoProps) => {
	return (
		<View className='mb-6 bg-gray-800/80 p-5 rounded-xl border border-gray-700 shadow-lg'>
			{/* Characteristics list */}
			<View className='space-y-3'>
				{/* Model */}
				<View className='flex-row items-center'>
					<Text className='text-gray-300 text-base font-medium'>Модель</Text>
					<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />
					<Text className='text-white text-base font-semibold'>
						{actualVariant.model}
					</Text>
				</View>

				{/* Other characteristics with separators */}
				{actualVariant?.type && (
					<View className='flex-row items-center'>
						<Text className='text-gray-300 text-base font-medium'>
							Тип клапана
						</Text>
						<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />
						<Text className='text-white text-base font-semibold'>
							{getTypeName(actualVariant.type)}
						</Text>
					</View>
				)}

				{actualVariant?.lever && (
					<View className='flex-row items-center'>
						<Text className='text-gray-300 text-base font-medium'>
							Тип перемикача
						</Text>
						<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />
						<Text className='text-white text-base font-semibold'>
							{getTypeName(actualVariant.lever)}
						</Text>
					</View>
				)}

				{hasFlow() && (
					<View className='flex-row items-center'>
						<Text className='text-gray-300 text-base font-medium'>
							Витрати повітря
						</Text>
						<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />
						<Text className='text-white text-base font-semibold'>
							{actualVariant?.flow}
						</Text>
					</View>
				)}

				{product?.bar && (
					<View className='flex-row items-center'>
						<Text className='text-gray-300 text-base font-medium'>
							Робочий тиск
						</Text>
						<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />
						<Text className='text-white text-base font-semibold'>
							{product?.bar} bar
						</Text>
					</View>
				)}

				{product?.num_lines && (
					<View className='flex-row items-center'>
						<Text className='text-gray-300 text-base font-medium'>
							Число ліній/позицій
						</Text>
						<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />
						<Text className='text-white text-base font-semibold'>
							{product?.num_lines}
						</Text>
					</View>
				)}

				{actualVariant?.productivity && (
					<View className='flex-row items-center'>
						<Text className='text-gray-300 text-base font-medium'>
							Продуктивність
						</Text>
						<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />
						<Text className='text-white text-base font-semibold'>
							{actualVariant.productivity}
						</Text>
					</View>
				)}

				{actualVariant?.power && (
					<View className='flex-row items-center'>
						<Text className='text-gray-300 text-base font-medium'>
							Потужність
						</Text>
						<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />
						<Text className='text-white text-base font-semibold'>
							{actualVariant.power}
						</Text>
					</View>
				)}

				{actualVariant?.pressure && (
					<View className='flex-row items-center'>
						<Text className='text-gray-300 text-base font-medium'>Тиск</Text>
						<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />
						<Text className='text-white text-base font-semibold'>
							{actualVariant.pressure}
						</Text>
					</View>
				)}

				{actualVariant?.receiver && (
					<View className='flex-row items-center'>
						<Text className='text-gray-300 text-base font-medium'>Ресивер</Text>
						<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />
						<Text className='text-white text-base font-semibold'>
							{actualVariant.receiver}
						</Text>
					</View>
				)}

				{actualVariant?.complete && (
					<View className='flex-row items-center'>
						<Text className='text-gray-300 text-base font-medium'>
							Комплектація
						</Text>

						<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />

						<Text className='text-white text-base font-semibold'>
							{actualVariant.complete}
						</Text>
					</View>
				)}

				{actualVariant?.thread_pt && (
					<View className='flex-row items-center'>
						<Text className='text-gray-300 text-base font-medium'>Різьба</Text>

						<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />

						<Text className='text-white text-base font-semibold'>
							{actualVariant.thread_pt}
						</Text>
					</View>
				)}

				{actualVariant?.filtration && (
					<View className='flex-row items-center'>
						<Text className='text-gray-300 text-base font-medium'>
							Фільтрація
						</Text>

						<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />

						<Text className='text-white text-base font-semibold'>
							{actualVariant.filtration}
							{!['поліпропілен', 'бронза'].includes(actualVariant.filtration) &&
								' мкм'}
						</Text>
					</View>
				)}

				{actualVariant?.signal_type && (
					<View className='flex-row items-center'>
						<Text className='text-gray-300 text-base font-medium'>
							Тип вхідного сигналу
						</Text>

						<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />

						<Text className='text-white text-base font-semibold'>
							{actualVariant.signal_type} мкм
						</Text>
					</View>
				)}

				{product?.filtration_single && (
					<View className='flex-row items-center'>
						<Text className='text-gray-300 text-base font-medium'>
							Фільтрація
						</Text>

						<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />

						<Text className='text-white text-base font-semibold'>
							{product.filtration_single} мкм
						</Text>
					</View>
				)}

				{product?.mode_action && (
					<View className='flex-row items-center'>
						<Text className='text-gray-300 text-base font-medium'>
							Спосіб дії
						</Text>

						<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />

						<Text className='text-white text-base font-semibold'>
							{product.mode_action}
						</Text>
					</View>
				)}

				{product?.view && (
					<View className='flex-row items-center'>
						<Text className='text-gray-300 text-base font-medium'>Вид</Text>

						<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />

						<Text className='text-white text-base font-semibold'>
							{product.view}
						</Text>
					</View>
				)}

				{product?.iso && (
					<View className='flex-row items-center'>
						<Text className='text-gray-300 text-base font-medium'>
							Стандарт
						</Text>

						<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />

						<Text className='text-white text-base font-semibold'>
							{product.iso}
						</Text>
					</View>
				)}

				{actualVariant?.piston_diameter && (
					<View className='flex-row items-center'>
						<Text className='text-gray-300 text-base font-medium'>
							Діаметр поршню
						</Text>

						<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />

						<Text className='text-white text-base font-semibold'>
							{actualVariant.piston_diameter}
						</Text>
					</View>
				)}

				{actualVariant?.stroke_length && (
					<View className='flex-row items-center'>
						<Text className='text-gray-300 text-base font-medium'>
							Довжина ходу
						</Text>

						<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />

						<Text className='text-white text-base font-semibold'>
							{actualVariant.stroke_length}
						</Text>
					</View>
				)}

				{actualVariant?.magnet && (
					<View className='flex-row items-center'>
						<Text className='text-gray-300 text-base font-medium'>
							Наявність магніту
						</Text>

						<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />

						<Text className='text-white text-base font-semibold'>
							{actualVariant.magnet}
						</Text>
					</View>
				)}

				{actualVariant?.stock && (
					<View className='flex-row items-center'>
						<Text className='text-gray-300 text-base font-medium'>
							Наявність магніту
						</Text>

						<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />

						<Text className='text-white text-base font-semibold'>
							{actualVariant.stock}
						</Text>
					</View>
				)}
			</View>

			{/* Price */}
			<View className='mt-5 pt-4 border-t border-gray-700 flex-row justify-between items-center'>
				<Text className='text-white text-lg font-bold'>Ціна</Text>
				<View className='flex-row items-center'>
					<Text className='text-2xl font-bold text-green-400 mr-1'>
						{isNaN(Number(actualVariant.price))
							? actualVariant.price
							: Number(actualVariant.price).toLocaleString('ru-RU')}
					</Text>
					{!isNaN(Number(actualVariant.price)) && (
						<Text className='text-gray-400 text-sm'>грн</Text>
					)}
				</View>
			</View>
		</View>
	);
};

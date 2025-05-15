import { supabase } from '@/utils/supabase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Product {
	id: number;
	name: string;
	img_url: string;
	thread?: string[];
	voltage?: string[];
	type?: string[];
	data_1?: string;
	data_2?: string;
	data_3?: string;
  desc: string;
}

export default function ProductDetails() {
	const router = useRouter();
	const { id } = useLocalSearchParams();
	const [product, setProduct] = useState<Product | null>(null);
	console.log(product);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<any>(null);
	useEffect(() => {
		const fetchProduct = async () => {
			try {
				let { data, error } = await supabase
					.from('distributors-card')
					.select('*')
					.eq('id', id)
					.single();

				if (error || !data) {
					({ data, error } = await supabase
						.from('recomend-card')
						.select('*')
						.eq('id', id)
						.single());
				}

				if (error) throw error;
				setProduct(data);
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};

		if (id) {
			fetchProduct();
		}
	}, [id]);

	return (
		<View className='bg-primary flex-1'>
			<ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
				<Image
					source={{
						uri:
							product?.img_url ||
							'https://via.placeholder.com/600x400/1a1a1a/ffffff.png',
					}}
					className='w-full h-[400px]'
					resizeMode='cover'
				/>
				<View className='flex-col items-start justify-center mt-5 px-5'>
					<Text
						className='text-white text-2xl font-bold'
						onPress={() => router.back()}
					>
						{product?.name}
					</Text>
					<View className='flex-row items-center gap-x-1 mt-2'>
						{/* Різьба */}
						{(product?.thread?.length || product?.data_1) && (
							<Text className='text-light-200 text-xl font-medium'>
								{product?.thread?.join(', ') || product?.data_1}
							</Text>
						)}
					</View>
					<View className='flex-row items-center gap-x-1 mt-2'>
						{/* Напруга */}
						{(product?.voltage?.length || product?.data_2) && (
							<Text className='text-light-200 text-xl font-medium'>
								{product?.voltage?.join(', ') || product?.data_2}
							</Text>
						)}
					</View>
					<View className='flex-row items-center gap-x-1 mt-2'>
						{/* Тип */}
						{(product?.type?.length || product?.data_3) && (
							<Text className='text-light-200 text-xl font-medium'>
								{product?.type?.join(', ') || product?.data_3}
							</Text>
						)}
					</View>
          <View className='flex-row items-center gap-x-1 mt-2'>
						{/* Описание */}
						{(product?.desc?.length) && (
							<Text className='text-light-200 text-xl font-medium'>
								{product?.desc}
							</Text>
						)}
					</View>
				</View>
        <View className="flex-row justify-center mt-5">
  <TouchableOpacity
    className="bg-blue-600 px-6 py-3 rounded-full shadow-md active:bg-blue-700"
    onPress={() => router.back()}
  >
    <Text className="text-white text-lg font-semibold text-center tracking-wider">
      НАЗАД
    </Text>
  </TouchableOpacity>
</View>
			</ScrollView>
      
		</View>
	);
}

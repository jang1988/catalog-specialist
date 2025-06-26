import LockIcon from '@/assets/icons/lock.svg';
import ShowIcon from '@/assets/icons/show.svg';
import { images } from '@/constants/images';
import { supabase } from '@/services/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
interface FormErrors {
	email?: string;
	password?: string;
	confirmPassword?: string;
	name?: string;
	phone?: string;
}

const Profile = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [loading, setLoading] = useState(false);
	const [isLogin, setIsLogin] = useState(true);
	const [user, setUser] = useState<User | null>(null);
	const [initialLoading, setInitialLoading] = useState(true);
	const [showPasswords, setShowPasswords] = useState(false);
	const [errors, setErrors] = useState<FormErrors>({});

	// Инициализация: проверяем текущую сессию и подписываемся на её изменения
	useEffect(() => {
		// Берём текущую сессию
		const session: Session | null = supabase.auth.session();
		setUser(session?.user ?? null);
		setInitialLoading(false);

		// Подписываемся на изменения авторизации
		const { data: authListener } = supabase.auth.onAuthStateChange(
			(_, newSession) => {
				setUser(newSession?.user ?? null);
				setInitialLoading(false);
			}
		);

		// При размонтировании отписываемся
		return () => {
			authListener?.unsubscribe();
		};
	}, []);

	// Валидации полей
	const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
	const validatePassword = (p: string) => p.length >= 6;
	const validatePhone = (p: string) =>
		/^[\+]?[1-9]\d{0,15}$/.test(p.replace(/\s/g, ''));

	const validateForm = (): boolean => {
		const errs: FormErrors = {};
		if (!email) errs.email = "Email обов'язковий";
		else if (!validateEmail(email)) errs.email = 'Невірний формат email';

		if (!password) errs.password = "Пароль обов'язковий";
		else if (!validatePassword(password))
			errs.password = 'Пароль мінімум 6 символів';

		if (!isLogin) {
			if (!name.trim()) errs.name = "Ім'я обов'язкове";
			if (!phone) errs.phone = "Телефон обов'язковий";
			else if (!validatePhone(phone)) errs.phone = 'Невірний формат телефону';
			if (!confirmPassword)
				errs.confirmPassword = "Підтвердження паролю обов'язкове";
			else if (password !== confirmPassword)
				errs.confirmPassword = 'Паролі не співпадають';
		}

		setErrors(errs);
		return Object.keys(errs).length === 0;
	};

	const clearForm = () => {
		setEmail('');
		setPassword('');
		setConfirmPassword('');
		setName('');
		setPhone('');
		setErrors({});
	};

	// Функция входа
	const signInWithEmail = async () => {
		if (!validateForm()) return;
		setLoading(true);

		const {
			user: signedInUser,
			session: signedInSession,
			error,
		} = await supabase.auth.signIn({
			email: email.trim(),
			password,
		});

		if (error) {
			Alert.alert(
				'Помилка входу',
				error.message.includes('Invalid login credentials')
					? 'Невірний email або пароль'
					: error.message
			);
		} else if (signedInUser && signedInSession) {
			Alert.alert('Успішно!', 'Ви увійшли в систему');
			clearForm();
		}

		setLoading(false);
	};

	// Функция регистрации
	const signUpWithEmail = async () => {
		if (!validateForm()) return;
		setLoading(true);

		const {
			user: newUser,
			session: newSession,
			error,
		} = await supabase.auth.signUp(
			{
				email: email.trim(),
				password,
			},
			{
				data: {
					phone: phone.trim(),
					name: name.trim(),
				},
			}
		);

		if (error) {
			Alert.alert(
				'Помилка реєстрації',
				error.message.includes('already registered')
					? 'Користувач з таким email вже існує'
					: error.message
			);
		} else if (newUser) {
			// Обновляем метаданные (имя и телефон)
			await supabase.from('auth.users').update({
				data: { full_name: name.trim(), phone: phone.trim() },
			});
			Alert.alert(
				'Реєстрація успішна!',
				newSession
					? 'Ви одразу увійшли в систему'
					: 'Перевірте пошту для підтвердження'
			);
			clearForm();
		}

		setLoading(false);
	};

	// Выход
	const signOut = async () => {
		await supabase.auth.signOut();
		setUser(null);
		clearForm();
		Alert.alert('Успішно', 'Ви вийшли з акаунту');
	};

	const switchMode = () => {
		clearForm();
		setIsLogin(!isLogin);
	};

	// Рендер
	if (initialLoading) {
		return (
			<View className='flex-1 bg-primary justify-center items-center'>
				<ActivityIndicator size='large' color='#ab8bff' />
				<Text className='text-white mt-4'>Завантаження...</Text>
			</View>
		);
	}

	if (user) {
		return (
			<ScrollView className='flex-1 bg-primary'>
				<View className='px-5 pt-10'>
					<View className='items-center mb-8'>
						<Image source={images.logo} className='w-[120px] h-[120px] mb-4' />
						<Text className='text-white text-2xl font-bold'>
							Інформація профілю
						</Text>
					</View>
					<View className='bg-dark-100 rounded-xl p-5 mb-5'>
						<View className='mb-3'>
							<Text className='text-gray-400 text-lg font-semibold'>Email</Text>
							<Text className='text-white text-base'>{user.email}</Text>
						</View>
						{user.user_metadata?.name && (
							<View className='mb-3'>
								<Text className='text-gray-400 text-lg font-semibold'>
									Ім'я
								</Text>
								<Text className='text-white text-base'>
									{user.user_metadata.name}
								</Text>
							</View>
						)}
						{user.user_metadata?.phone && (
							<View>
								<Text className='text-gray-400 text-lg font-semibold'>
									Телефон
								</Text>
								<Text className='text-white text-base'>
									{user.user_metadata.phone}
								</Text>
							</View>
						)}
					</View>
					<TouchableOpacity
						onPress={signOut}
						className='
    bg-red-500/10 rounded-xl py-3 px-6
    border border-red-500/20
    active:bg-red-500/20
  '
					>
						<Text className='text-red-500 font-medium text-center'>
							Вийти з акаунту
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		);
	}

	return (
		<KeyboardAvoidingView
			className='flex-1 bg-primary'
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<ScrollView
				className='flex-1'
				contentContainerStyle={{ flexGrow: 1 }}
				keyboardShouldPersistTaps='handled'
			>
				<View className='px-5 flex-1 justify-center py-10'>
					<View className='items-center mb-8'>
						<Image source={images.logo} className='w-[100px] h-[100px] mb-4' />
						<Text className='text-white text-2xl font-bold'>
							{isLogin ? 'Вхід' : 'Реєстрація'}
						</Text>
					</View>

					{!isLogin && (
						<>
							<View className='mb-4'>
								<View className='bg-dark-100 rounded-xl px-5 py-4'>
									<TextInput
										onChangeText={setName}
										value={name}
										placeholder="Повне ім'я"
										placeholderTextColor='#a8b5db'
										className='text-white'
									/>
								</View>
								{errors.name && (
									<Text className='text-red-400 text-sm mt-1 ml-2'>
										{errors.name}
									</Text>
								)}
							</View>
							<View className='mb-4'>
								<View className='bg-dark-100 rounded-xl px-5 py-4'>
									<TextInput
										onChangeText={setPhone}
										value={phone}
										placeholder='+380XXXXXXXXX'
										placeholderTextColor='#a8b5db'
										className='text-white'
										keyboardType='phone-pad'
									/>
								</View>
								{errors.phone && (
									<Text className='text-red-400 text-sm mt-1 ml-2'>
										{errors.phone}
									</Text>
								)}
							</View>
						</>
					)}

					{/* Email */}
					<View className='mb-4'>
						<View className='bg-dark-100 rounded-xl px-5 py-4'>
							<TextInput
								onChangeText={setEmail}
								value={email}
								placeholder='email@address.com'
								placeholderTextColor='#a8b5db'
								className='text-white'
								autoCapitalize='none'
								keyboardType='email-address'
							/>
						</View>
						{errors.email && (
							<Text className='text-red-400 text-sm mt-1 ml-2'>
								{errors.email}
							</Text>
						)}
					</View>

					{/* Пароль */}
					<View className='mb-4'>
						<View className='bg-dark-100 rounded-xl px-5 py-3 flex-row items-center'>
							<TextInput
								onChangeText={setPassword}
								value={password}
								secureTextEntry={!showPasswords}
								placeholder='Пароль (мін. 6 символів)'
								placeholderTextColor='#a8b5db'
								className='text-white flex-1'
								autoCapitalize='none'
							/>
							<TouchableOpacity
								onPress={() => setShowPasswords(!showPasswords)}
							>
								<Text className='text-purple-400'>
									{showPasswords ? (
										<LockIcon width={24} height={24} />
									) : (
										<ShowIcon width={24} height={24} />
									)}
								</Text>
							</TouchableOpacity>
						</View>
						{errors.password && (
							<Text className='text-red-400 text-sm mt-1 ml-2'>
								{errors.password}
							</Text>
						)}
					</View>

					{/* Подтверждение пароля */}
					{!isLogin && (
						<View className='mb-4'>
							<View className='bg-dark-100 rounded-xl px-5 py-3 flex-row items-center'>
								<TextInput
									onChangeText={setConfirmPassword}
									value={confirmPassword}
									secureTextEntry={!showPasswords}
									placeholder='Підтвердіть пароль'
									placeholderTextColor='#a8b5db'
									className='text-white flex-1'
									autoCapitalize='none'
								/>
								<TouchableOpacity
									onPress={() => setShowPasswords(!showPasswords)}
								>
									<Text className='text-purple-400'>
										{showPasswords ? (
											<LockIcon width={24} height={24} />
										) : (
											<ShowIcon width={24} height={24} />
										)}
									</Text>
								</TouchableOpacity>
							</View>
							{errors.confirmPassword && (
								<Text className='text-red-400 text-sm mt-1 ml-2'>
									{errors.confirmPassword}
								</Text>
							)}
						</View>
					)}

					{/* Кнопка */}
					{/* Основная кнопка */}
					<View className='mb-5'>
						<TouchableOpacity
							onPress={isLogin ? signInWithEmail : signUpWithEmail}
							disabled={loading}
							className={`
      bg-blue-400 rounded-xl py-4 items-center justify-center 
      shadow-md shadow-blue-500/30
      ${loading ? 'opacity-80' : 'opacity-100'}
      active:bg-blue-600 active:scale-[0.98] transition-all duration-150
    `}
							activeOpacity={0.8}
						>
							{loading ? (
								<ActivityIndicator color='white' size='small' />
							) : (
								<Text className='text-white font-semibold text-[16px]'>
									{isLogin ? 'Увійти' : 'Зареєструватися'}
								</Text>
							)}
						</TouchableOpacity>
					</View>

					{/* Кнопка переключения режима */}
					<TouchableOpacity
						onPress={switchMode}
						className='items-center py-3 active:opacity-70'
						activeOpacity={0.7}
					>
						<Text className='text-white text-[15px]'>
							{isLogin ? 'Немає акаунта? ' : 'Вже є акаунт? '}
							<Text className='text-blue-400 font-medium'>
								{isLogin ? 'Зареєструватися' : 'Увійти'}
							</Text>
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default Profile;

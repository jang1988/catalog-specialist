import { Link } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

/**
 * Компонент карточки товара для отображения в списке продуктов
 * 
 * @param {string} id - Уникальный идентификатор товара
 * @param {string} name - Название товара
 * @param {string} img_url - URL изображения товара
 * @param {string[]} thread - Массив вариантов резьбы
 * @param {string[]} voltage - Массив вариантов напряжения
 * @param {string} productivity - Производительность (л/мин)
 * @param {string} power - Мощность (кВт)
 * @param {string} pressure - Давление (бар)
 * @param {string} group_table - Источник данных (таблица) для группы товаров
 * @param {string} table - Альтернативный источник данных (имеет приоритет над group_table)
 */
export default function ProductCard({
  id,
  name,
  img_url,
  thread,
  voltage,
  productivity,
  power,
  pressure,
  group_table,
  table, // Явно указанный источник данных
}: any) {
  // Определяем источник данных для товара:
  // Если явно указан параметр table, используем его, иначе берем group_table
  const tableSource = table || group_table;
  
  return (
    // Обертка в Link для навигации к детальной странице товара
    <Link 
      href={`/products/${id}?table=${tableSource}`} 
      asChild
    >
      {/* Основной контейнер карточки */}
      <TouchableOpacity>
        {/* Изображение товара */}
        <Image
          source={{
            // Используем переданное изображение или placeholder, если его нет
            uri: img_url
              ? img_url
              : 'https://via.placeholder.com/600*400/1a1a1a/ffffff.png',
          }}
          className='w-full h-[160px] rounded-lg'
          resizeMode='cover'
        />
        
        {/* Название товара (максимум 3 строки) */}
        <Text className='text-sm font-bold text-white mt-2' numberOfLines={3}>
          {name}
        </Text>

        {/* Блок с информацией о резьбе (если есть данные) */}
        {Array.isArray(thread) && thread.length > 0 && (
          <View className='flex-row items-center justify-start gap-x-1'>
            <Text
              className='text-xs font-medium text-light-300 mt-1'
              numberOfLines={1}
            >
              {thread.join(', ')} {/* Отображаем варианты через запятую */}
            </Text>
          </View>
        )}

        {/* Блок с информацией о напряжении (если есть данные) */}
        {Array.isArray(voltage) && voltage.length > 0 && (
          <View className='flex-row items-center justify-between'>
            <Text
              className='text-xs font-medium text-light-300 mt-1'
              numberOfLines={1}
            >
              {voltage.join(', ')}
            </Text>
          </View>
        )}

        {/* Блок с информацией о производительности (если есть данные) */}
        {productivity && (
          <View className='flex-row items-center justify-between'>
            <Text
              className='text-xs font-medium text-light-300 mt-1'
              numberOfLines={1}
            >
              Продуктивність: {productivity} л/хв
            </Text>
          </View>
        )}

        {/* Блок с информацией о мощности (если есть данные) */}
        {power && (
          <View className='flex-row items-center justify-between'>
            <Text
              className='text-xs font-medium text-light-300 mt-1'
              numberOfLines={1}
            >
              Потужність: {power} кВт
            </Text>
          </View>
        )}

        {/* Блок с информацией о давлении (если есть данные) */}
        {pressure && (
          <View className='flex-row items-center justify-between'>
            <Text
              className='text-xs font-medium text-light-300 mt-1'
              numberOfLines={1}
            >
              Тиск: {pressure} бар
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Link>
  );
}
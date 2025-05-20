import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CategoryHeader } from '@/components/CategoryHeader';
import { CategoryContent } from '@/components/CategoryContent';
import { GroupItem, Product } from '@/types/interfaces';
import {
  fetchCategoryById,
  fetchGroupById,
  fetchProductsByGroup,
} from '@/utils/useDataFetch';

export default function Category() {
  // Навигация и параметры
  const router = useRouter();
  const { id } = useLocalSearchParams();
  // Обработка случая, когда id может быть массивом
  const categoryId = Array.isArray(id) ? id[0] : id;

  // Состояния компонента
  const [groups, setGroups] = useState<GroupItem[]>([]); // Список групп категории
  const [products, setProducts] = useState<Product[]>([]); // Список товаров
  const [category, setCategory] = useState(''); // Название категории
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState<string | null>(null); // Ошибки
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null); // Выбранная группа
  const [groupTable, setGroupTable] = useState<string | null>(null); // Таблица группы

  // Загрузка данных категории и групп
  const fetchGroupsAndProducts = useCallback(async () => {
    if (!categoryId) {
      setError('ID категории не указан');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Получаем название категории
      const categoryName = await fetchCategoryById(categoryId);
      setCategory(categoryName);

      // 2. Получаем группы категории
      const groupsResult = await fetchGroupById(categoryId);
      setGroups(groupsResult.data);
      setGroupTable(groupsResult.table); // Сохраняем таблицу для последующих запросов

      // 3. Если есть таблица - загружаем товары
      if (groupsResult.table) {
        const productData = await fetchProductsByGroup(groupsResult.table);
        setProducts(productData);
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  // Загрузка товаров для выбранной группы
  const fetchProducts = useCallback(async () => {
    if (groupTable) {
      try {
        // Загружаем товары с фильтрацией по группе (если выбрана)
        const productData = await fetchProductsByGroup(
          groupTable,
          selectedGroup || undefined
        );
        setProducts(productData);
      } catch (err) {
        setError('Не удалось загрузить товары');
      }
    }
  }, [groupTable, selectedGroup]);

  // Первоначальная загрузка данных при монтировании
  useEffect(() => {
    fetchGroupsAndProducts();
  }, [fetchGroupsAndProducts]);

  // Обновление товаров при изменении группы
  useEffect(() => {
    if (groupTable) {
      fetchProducts();
    }
  }, [groupTable, selectedGroup, fetchProducts]);

  // Обработчик кнопки "назад"
  const handleBackPress = () => {
    if (selectedGroup) {
      // Если выбрана группа - сбрасываем выбор
      setSelectedGroup(null);
    } else {
      // Иначе - возвращаемся на предыдущий экран
      router.back();
    }
  };

  return (
    <View className='flex-1 bg-gray-900'>
      {/* Шапка категории */}
      <CategoryHeader
        selectedGroup={selectedGroup}
        category={category}
        groups={groups}
        onBackPress={handleBackPress}
      />
      
      {/* Основное содержимое */}
      <View className='flex-1 p-2'>
        <CategoryContent
          loading={loading}
          error={error}
          selectedGroup={selectedGroup}
          groups={groups}
          products={products}
          onGroupPress={setSelectedGroup} // Обработчик выбора группы
          onRetry={fetchGroupsAndProducts} // Повторная попытка загрузки
        />
      </View>
    </View>
  );
}
import { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CategoryHeader } from '@/components/category/CategoryHeader';
import { CategoryContent } from '@/components/category/CategoryContent';
import { GroupItem, Product } from '@/types/interfaces';
import {
  fetchCategoryById,
  fetchGroupById,
  fetchProductsByGroup,
} from '@/utils/useDataFetch';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withSequence,
} from 'react-native-reanimated';

// Константы для анимации
const ANIMATION_CONFIG = {
  HEADER: {
    OPACITY: {
      duration: 600,
      easing: Easing.out(Easing.exp),
    },
  },
  CONTENT: {
    ENTRANCE: {
      translateY: {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      },
    },
    GROUP_CHANGE: {
      scale: {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      },
    },
  },
};

export default function Category() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const categoryId = Array.isArray(id) ? id[0] : id;

  // Состояния компонента
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [groupTable, setGroupTable] = useState<string | null>(null);

  // Анимационные переменные
  const headerOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);
  const contentScale = useSharedValue(1);

  // Стили анимации
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: contentTranslateY.value },
      { scale: contentScale.value },
    ],
  }));

  // Инициализация анимации при монтировании
  useEffect(() => {
    const startInitialAnimations = () => {
      headerOpacity.value = withTiming(1, ANIMATION_CONFIG.HEADER.OPACITY);
      contentTranslateY.value = withTiming(
        0, 
        ANIMATION_CONFIG.CONTENT.ENTRANCE.translateY
      );
    };

    startInitialAnimations();
  }, []);

  // Анимация при смене группы
  useEffect(() => {
    if (selectedGroup) {
      const runGroupChangeAnimation = () => {
        contentScale.value = withSequence(
          withTiming(0.95, ANIMATION_CONFIG.CONTENT.GROUP_CHANGE.scale),
          withTiming(1, ANIMATION_CONFIG.CONTENT.GROUP_CHANGE.scale)
        );
      };

      runGroupChangeAnimation();
    }
  }, [selectedGroup]);

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

      const categoryName = await fetchCategoryById(categoryId);
      setCategory(categoryName);

      const groupsResult = await fetchGroupById(categoryId);
      setGroups(groupsResult.data);
      setGroupTable(groupsResult.table);

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

  // Эффекты для загрузки данных
  useEffect(() => {
    fetchGroupsAndProducts();
  }, [fetchGroupsAndProducts]);

  useEffect(() => {
    if (groupTable) {
      fetchProducts();
    }
  }, [groupTable, selectedGroup, fetchProducts]);

  const handleBackPress = () => {
    if (selectedGroup) {
      setSelectedGroup(null);
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {/* Анимированная шапка */}
      <Animated.View style={animatedHeaderStyle}>
        <CategoryHeader
          selectedGroup={selectedGroup}
          category={category}
          groups={groups}
          onBackPress={handleBackPress}
        />
      </Animated.View>

      {/* Анимированное содержимое */}
      <Animated.View style={[styles.content, animatedContentStyle]}>
        <CategoryContent
          loading={loading}
          error={error}
          selectedGroup={selectedGroup}
          groups={groups}
          products={products}
          onGroupPress={setSelectedGroup}
          onRetry={fetchGroupsAndProducts}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 8,
  },
});
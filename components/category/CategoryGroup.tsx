import { GroupCard } from '@/components/cards/GroupCard';
import { CategoryGroupProps } from '@/types/interfaces'
import { View } from 'react-native';
import Animated, {
	FadeInDown,
	FadeOutUp,
	LinearTransition,
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export const CategoryGroup = ({
	groups,
	selectedGroup,
	onGroupPress,
}: CategoryGroupProps) => {
	const selectedGroupData = selectedGroup
		? groups.find(g => g.id === selectedGroup)
		: null;

	if (selectedGroupData) {
		return (
			<AnimatedView
				key={`selected-${selectedGroupData.id}`}
				entering={FadeInDown.duration(350)}
				exiting={FadeOutUp.duration(250)}
				layout={LinearTransition.springify().damping(12)}
			>
				<GroupCard
					group={selectedGroupData}
					isSelected={true}
					onPress={() => onGroupPress(null)}
				/>
			</AnimatedView>
		);
	}

	return (
		<>
			{groups.map((group, index) => (
				<AnimatedView
					key={`group-${group.id}`}
					entering={FadeInDown.duration(400).delay(index * 60)}
					exiting={FadeOutUp.duration(200)}
					layout={LinearTransition.springify().damping(14)}
				>
					<GroupCard
						group={group}
						isSelected={false}
						onPress={() => onGroupPress(group.id)}
					/>
				</AnimatedView>
			))}
		</>
	);
};

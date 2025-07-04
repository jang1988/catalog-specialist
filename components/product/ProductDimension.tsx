import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import RenderHtml, {
	HTMLContentModel,
	HTMLElementModel,
	MixedStyleRecord,
	TNodeChildrenRenderer,
} from 'react-native-render-html';

type ProductDimensionProps = {
	dimension?: string;
};

export const ProductDimension = React.memo(
	({ dimension }: ProductDimensionProps) => {
		const { productName } = useLocalSearchParams();
		const { width } = useWindowDimensions();

		const tagsStyles = React.useMemo<MixedStyleRecord>(
			() => ({
				body: {
					color: '#ffffff',
					fontSize: 16,
					lineHeight: 24,
				},
				p: {
					color: '#e5e7eb',
					fontSize: 16,
					lineHeight: 24,
					marginBottom: 12,
				},
				li: {
					color: '#e5e7eb',
					fontSize: 16,
					lineHeight: 24,
					marginBottom: 4,
				},
				h1: {
					color: '#ffffff',
					fontSize: 22,
					fontWeight: 'bold',
					marginVertical: 16,
				},
				h2: {
					color: '#ffffff',
					fontSize: 20,
					fontWeight: 'bold',
					marginVertical: 14,
				},
				h3: {
					color: '#ffffff',
					fontSize: 18,
					fontWeight: 'bold',
					marginVertical: 12,
				},
				h4: {
					color: '#ffffff',
					fontSize: 16,
					fontWeight: 'bold',
					marginVertical: 10,
				},
				strong: {
					fontWeight: 'bold',
					color: '#ffffff',
				},
				em: {
					fontStyle: 'italic',
					color: '#e5e7eb',
				},
				ul: {
					marginVertical: 8,
				},
				ol: {
					marginVertical: 8,
				},
				table: {
					borderWidth: 1,
					borderColor: '#4b5563',
					marginVertical: 8,
					borderRadius: 4,
					width: '100%',
					overflow: 'hidden',
				},
				th: {
					borderWidth: 1,
					borderColor: '#4b5563',
					padding: 4,
					color: '#ffffff',
					backgroundColor: '#374151',
					fontWeight: 'bold',
					fontSize: 8,
					lineHeight: 10,
				},
				td: {
					borderWidth: 1,
					borderColor: '#4b5563',
					padding: 4,
					color: '#e5e7eb',
					fontSize: 12,
					lineHeight: 14,
				},
				tr: {
					flexDirection: 'row',
				},
				caption: {
					fontSize: 14,
					color: '#9ca3af',
					fontStyle: 'italic',
					marginBottom: 8,
					marginLeft: 8,
				},
				label: {
					fontSize: 14,
					color: '#9ca3af',
					marginBottom: 8,
				},
				blockquote: {
					backgroundColor: '#374151',
					borderLeftWidth: 4,
					borderLeftColor: '#60a5fa',
					padding: 12,
					marginVertical: 12,
					borderRadius: 4,
				},
				code: {
					backgroundColor: '#374151',
					padding: 4,
					borderRadius: 4,
					color: '#f3f4f6',
				},
				pre: {
					backgroundColor: '#1f2937',
					padding: 12,
					borderRadius: 6,
					marginVertical: 12,
				},
				img: {
					maxWidth: width - 30,
					marginVertical: 12,
					borderRadius: 6,
				},
			}),
			[width]
		);

		const customHTMLElementModels = React.useMemo(
			() => ({
				caption: HTMLElementModel.fromCustomModel({
					tagName: 'caption',
					contentModel: HTMLContentModel.block,
				}),
			}),
			[]
		);

		const renderers = React.useMemo(
			() => ({
				table: (props: any) => {
					const { TDefaultRenderer } = props;
					return (
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator
							style={{ marginVertical: 8 }}
						>
							<TDefaultRenderer {...props} />
						</ScrollView>
					);
				},
				th: (props: any) => {
					const { tnode } = props;
					const colspanStr = tnode?.attributes?.colspan || '1';
					const colspan = parseInt(colspanStr, 10);
					const parentRow = tnode?.parent;
					const totalColumns =
						parentRow?.children
							?.filter(
								(child: any) => child.tagName === 'th' || child.tagName === 'td'
							)
							.reduce((sum: number, child: any) => {
								const childColspan = parseInt(
									child.attributes?.colspan || '1',
									10
								);
								return sum + childColspan;
							}, 0) || 1;
					const minWidth = 80; // Minimum width per column
					const availableWidth = width - 30; // Adjust for padding/margins
					const cellWidth =
						Math.max(minWidth, availableWidth / totalColumns) * colspan;

					return (
						<View
							style={{
								width: cellWidth,
								borderWidth: 1,
								borderColor: '#4b5563',
								padding: 4,
								backgroundColor: '#374151',
								justifyContent: 'center',
							}}
						>
							<TNodeChildrenRenderer tnode={tnode} />
						</View>
					);
				},
				td: (props: any) => {
					const { tnode } = props;
					const colspanStr = tnode?.attributes?.colspan || '1';
					const colspan = parseInt(colspanStr, 10);
					const parentRow = tnode?.parent;
					const totalColumns =
						parentRow?.children
							?.filter(
								(child: any) => child.tagName === 'th' || child.tagName === 'td'
							)
							.reduce((sum: number, child: any) => {
								const childColspan = parseInt(
									child.attributes?.colspan || '1',
									10
								);
								return sum + childColspan;
							}, 0) || 1;
					const minWidth = 80; // Minimum width per column
					const availableWidth = width - 30; // Adjust for padding/margins
					const cellWidth =
						Math.max(minWidth, availableWidth / totalColumns) * colspan;

					return (
						<View
							style={{
								width: cellWidth,
								borderWidth: 1,
								borderColor: '#4b5563',
								padding: 4,
								justifyContent: 'center',
							}}
						>
							<TNodeChildrenRenderer tnode={tnode} />
						</View>
					);
				},
			}),
			[width]
		);

		if (!dimension) return null;

		return (
			<View className='mt-8 bg-gray-800/80 p-1 rounded-xl border border-gray-700 shadow-lg'>
				<Text className='text-white text-2xl font-bold mb-4 text-center pb-2 border-b border-gray-600'>
					Габаритні розміри {productName}
				</Text>
				<View className='px-3'>
					<RenderHtml
						source={{ html: dimension }}
						tagsStyles={tagsStyles}
						customHTMLElementModels={customHTMLElementModels}
						renderers={renderers}
						enableExperimentalBRCollapsing
						enableExperimentalGhostLinesPrevention
						contentWidth={width}
					/>
				</View>
			</View>
		);
	}
);

import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { TNodeChildrenRenderer } from 'react-native-render-html';

export const createTableMatrix = (tableNode: any) => {
	const rows =
		tableNode?.children?.flatMap(
			(section: any) =>
				section.children?.filter((child: any) => child.tagName === 'tr') || []
		) || [];

	if (rows.length === 0) return { matrix: [], maxCols: 0 };

	let maxCols = 0;
	rows.forEach((row: any) => {
		const cells =
			row.children?.filter(
				(child: any) => child.tagName === 'th' || child.tagName === 'td'
			) || [];
		let colCount = 0;
		cells.forEach((cell: any) => {
			const colspan = parseInt(cell.attributes?.colspan || '1', 10);
			colCount += colspan;
		});
		maxCols = Math.max(maxCols, colCount);
	});

	const matrix: any[][] = [];
	for (let i = 0; i < rows.length; i++) {
		matrix[i] = new Array(maxCols).fill(null);
	}

	// Функция для извлечения текста из узла
	const extractTextFromNode = (node: any): string => {
		if (!node) return '';

		if (node.type === 'text') {
			return node.data || '';
		}

		if (node.children && Array.isArray(node.children)) {
			return node.children.map(extractTextFromNode).join('');
		}

		return '';
	};

	rows.forEach((row: any, rowIndex: number) => {
		const cells =
			row.children?.filter(
				(child: any) => child.tagName === 'th' || child.tagName === 'td'
			) || [];

		let colIndex = 0;
		cells.forEach((cell: any) => {
			while (colIndex < maxCols && matrix[rowIndex][colIndex] !== null) {
				colIndex++;
			}

			const colspan = parseInt(cell.attributes?.colspan || '1', 10);
			const rowspan = parseInt(cell.attributes?.rowspan || '1', 10);

			// Извлекаем текст из ячейки для расчета высоты
			const cellText = extractTextFromNode(cell);

			for (let r = 0; r < rowspan && rowIndex + r < rows.length; r++) {
				for (let c = 0; c < colspan && colIndex + c < maxCols; c++) {
					matrix[rowIndex + r][colIndex + c] = {
						node: cell,
						colspan,
						rowspan,
						isMain: r === 0 && c === 0,
						text: cellText,
					};
				}
			}
		});
	});

	return { matrix, maxCols };
};

// Исправленный рендерер таблицы для ProductDesc
export const createTableRenderer = (width: number) => ({
	table: (props: any) => {
		const { tnode } = props;
		const { matrix, maxCols } = createTableMatrix(tnode);

		if (matrix.length === 0) return null;

		const minWidth = 150; // увеличиваем минимальную ширину
		const availableWidth = width - 30;
		const cellWidth = Math.max(minWidth, availableWidth / maxCols);

		// Функция для извлечения текста из узла (более глубокая)
		const extractAllText = (node: any): string => {
			if (!node) return '';

			if (node.type === 'text') {
				return node.data || '';
			}

			if (node.children && Array.isArray(node.children)) {
				return node.children.map(extractAllText).join(' ');
			}

			return '';
		};

		// Функция для подсчета высоты строки с учетом rowspan
		const calculateRowHeight = (rowIndex: number) => {
			let maxHeight = 20; // уменьшена минимальная высота строки с 30 до 20

			matrix[rowIndex].forEach(cell => {
				if (cell && cell.isMain) {
					const cellText = extractAllText(cell.node);
					const cellWidthForText = cellWidth * cell.colspan; // учитываем padding
					const fontSize = cell.node.tagName === 'th' ? 12 : 14;

					// Более точный расчет высоты
					const avgCharWidth = fontSize * 0.5;
					const charsPerLine = Math.floor(cellWidthForText / avgCharWidth);
					const words = cellText.split(' ');
					let lines = 1;
					let currentLineLength = 0;

					words.forEach(word => {
						if (currentLineLength + word.length > charsPerLine) {
							lines++;
							currentLineLength = word.length;
						} else {
							currentLineLength += word.length + 1.5; // +1 для пробела
						}
					});

					const lineHeight = fontSize * 1.4;
					// Делим на rowspan, чтобы высота была правильной для каждой строки
					// Уменьшен padding с 16 до 8
					const calculatedHeight = (lines * lineHeight + 8) / cell.rowspan;

					maxHeight = Math.max(maxHeight, calculatedHeight);
				}
			});

			return maxHeight;
		};

		const captionNode = tnode.children?.find(
			(child: any) => child.tagName === 'caption'
		);

		return (
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator
				style={{ marginVertical: 4 }} // уменьшен отступ с 8 до 4
			>
				<View style={{ flexDirection: 'column', width: maxCols * cellWidth }}>
					{captionNode && (
						<View
							style={{
								padding: 4, // уменьшен padding с 8 до 4
								backgroundColor: '#111827',
								borderWidth: 1,
								borderColor: '#4b5563',
							}}
						>
							<TNodeChildrenRenderer tnode={captionNode} />
						</View>
					)}

					{matrix.map((row, rowIndex) => {
						const rowHeight = calculateRowHeight(rowIndex);

						return (
							<View
								key={rowIndex}
								style={{
									height: rowHeight,
									position: 'relative',
								}}
							>
								{row.map((cell, colIndex) => {
									if (!cell || !cell.isMain) return null;

									const isHeader = cell.node.tagName === 'th';
									const cellText = extractAllText(cell.node);

									return (
										<View
											key={`${rowIndex}-${colIndex}`}
											style={{
												position: 'absolute',
												left: colIndex * cellWidth,
												top: 0,
												width: cellWidth * cell.colspan,
												height: rowHeight * cell.rowspan,
												borderWidth: .5,
												borderColor: '#4b5563',
												backgroundColor: isHeader ? '#374151' : '#1f2937',
												paddingHorizontal: 8, // разделен на горизонтальный и вертикальный
												paddingVertical: 2, // уменьшен вертикальный padding с 8 до 2
												justifyContent: 'center',
											}}
										>
											<Text
												style={{
													color: isHeader ? '#ffffff' : '#e5e7eb',
													fontSize: isHeader ? 10 : 12,
													lineHeight: isHeader ? 14 : 16,
													fontWeight: isHeader ? 'bold' : 'normal',
													textAlign: 'left',
													width: '100%',
												}}
												numberOfLines={0}
											>
												{cellText}
											</Text>
										</View>
									);
								})}
							</View>
						);
					})}
				</View>
			</ScrollView>
		);
	},
});
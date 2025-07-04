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

			for (let r = 0; r < rowspan && rowIndex + r < rows.length; r++) {
				for (let c = 0; c < colspan && colIndex + c < maxCols; c++) {
					matrix[rowIndex + r][colIndex + c] = {
						node: cell,
						colspan,
						rowspan,
						isMain: r === 0 && c === 0,
					};
				}
			}
		});
	});

	return { matrix, maxCols };
};

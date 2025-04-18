// Utilidad para obtener el centro de una celda
export const getCellCenter = (x: number, y: number, boardRef: HTMLDivElement, size: number) => {
    if (!boardRef.current) return null;
    const boardRect = boardRef.current.getBoundingClientRect();
    const cellWidth = boardRect.width / size;
    const cellHeight = boardRect.height / size;

    return {
        x: boardRect.left + x * cellWidth + cellWidth / 2,
        y: boardRect.top + y * cellHeight + cellHeight / 2,
    };
};
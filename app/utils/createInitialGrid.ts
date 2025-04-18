import { Dot, GridCell } from "~/game/game.types";

export const createInitialGrid = (size: number, dots: Dot[]): GridCell[][] => {
    const grid: GridCell[][] = [];

    for (let row = 0; row < size; row++) {
        const rowCells: GridCell[] = [];

        for (let col = 0; col < size; col++) {
            const foundDot = dots.find(dot => dot.position[0] === col && dot.position[1] === row);

            rowCells.push({
                x: col,
                y: row,
                hasDot: !!foundDot,
                dotId: foundDot?.id,
                color: foundDot?.color,
                hasLine: false,
                isHovered: false,
            });
        }

        grid.push(rowCells);
    }

    return grid;
};

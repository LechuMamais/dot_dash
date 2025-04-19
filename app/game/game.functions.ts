import { GridCell, Level, UnActivePaths } from "./game.types";

export const cellHasDot = (cell: GridCell) => {
    return cell.hasDot && cell.dotId !== undefined && cell.color !== undefined
}

export const cellHasLine = (cell: GridCell) => {
    return cell.hasLine
}

export const areCellsAdjacent = (cell1: GridCell, cell2: GridCell) => {
    const dx = Math.abs(cell1.x - cell2.x);
    const dy = Math.abs(cell1.y - cell2.y);

    return (dx === 1 && dy === 0 || dx === 0 && dy === 1);
}

export const checkPathCompletion = (firstCell: GridCell, newCell: GridCell) => {
    return (firstCell.color === newCell.color && firstCell.hasDot && newCell.hasDot && firstCell.dotId !== newCell.dotId)
}

export const checkLevelCompletion = (unActivePaths: UnActivePaths, level: Level) => {
    let completedPaths: number = 0;
    unActivePaths.map(path => {
        if (path.isCompleted) { completedPaths++ }
    })
    return completedPaths === (level.dots.length) / 2
}

export const haveSamePosition = (cell1: GridCell, cell2: GridCell) => {
    return cell1.x === cell2.x && cell1.y === cell2.y
}

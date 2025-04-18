import { useEffect, useRef, useState } from 'react';
import { GridCell, Level } from '~/game/game.types';
import { createInitialGrid } from '~/utils/createInitialGrid';
import ActivePath from './ActivePath';
import { AnimatePresence } from 'framer-motion';
import { getCellCenter } from '~/utils/getCellCenter';

export default function GameBoard(level: Level) {
    const { size, dots } = level;
    const BOARD_SIZE_PX = 400;

    const boardRef = useRef<HTMLDivElement>(null);
    const [gridState, setGridState] = useState<GridCell[][]>(() => createInitialGrid(size, dots));
    const [activeDot, setActiveDot] = useState<GridCell | null>(null);
    const [activePathCells, setActivePathCells] = useState<GridCell[]>([]);

    const [completedPaths, setCompletedPaths] = useState<
        { color: string; cells: GridCell[] }[]
    >([]);

    const isPathCompleted = (path: GridCell[]): boolean => {

        if (path[path.length - 1].hasDot && path[path.length - 1].color === path[0].color) {
            console.log("Path completed!");

            return true;
        } else { return false }
    }

    const isPathValid = (path: GridCell[]) => {
        if (!activeDot || path.length === 0) return false;
        if (isPathCompleted(path)) return (isPathCompleted(path));

        const last = path[path.length - 1];
        return (
            last.hasDot
        );
    };

    const handleDotClick = (cell: GridCell) => {
        setActiveDot(cell);
        setActivePathCells([cell]);
    };

    // Manejo del movimiento del mouse para construir el path
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!activeDot) return;

            const boardRect = boardRef.current?.getBoundingClientRect();
            if (!boardRect) return;

            const cellX = Math.floor((e.clientX - boardRect.left) / (boardRect.width / size));
            const cellY = Math.floor((e.clientY - boardRect.top) / (boardRect.height / size));

            if (cellX < 0 || cellX >= size || cellY < 0 || cellY >= size) return;

            const cell = gridState[cellY][cellX];
            const last = activePathCells[activePathCells.length - 1] || activeDot;

            const isAdjacent =
                (Math.abs(cell.x - last.x) === 1 && cell.y === last.y) ||
                (Math.abs(cell.y - last.y) === 1 && cell.x === last.x);

            const isAlreadyInPath = activePathCells.some(c => c.x === cellX && c.y === cellY);


            // ✅ Avanzar en el path
            if (isAdjacent && !cell.hasLine && !isAlreadyInPath && (cell.color == last.color || !cell.color)) {
                cell.hasLine = true;
                cell.color = activeDot.color;
                setActivePathCells(prev => [...prev, cell]);
                isPathCompleted(activePathCells);
                return;
            }

            // 🔙 Retroceder un paso si el usuario vuelve al penúltimo
            const penultimate = activePathCells[activePathCells.length - 2];
            if (
                penultimate &&
                cell.x === penultimate.x &&
                cell.y === penultimate.y// && !last.hasDot

            ) {
                const newPath = activePathCells.slice(0, -1); // quitamos la última
                const lastCell = activePathCells[activePathCells.length - 1];

                // Limpiar esa celda del gridState
                const updatedGrid = gridState.map(row =>
                    row.map(c =>
                        c.x === lastCell.x && c.y === lastCell.y && !lastCell.hasDot
                            ? { ...c, hasLine: false, color: lastCell.color }
                            : c.x === lastCell.x && c.y === lastCell.y ? { ...c, hasLine: false, color: '' } : c
                    )
                );

                setGridState(updatedGrid);
                setActivePathCells(newPath);
                return;
            }
        };


        const handleMouseUp = () => {
            if (!activeDot) return;

            const isValid = isPathValid(activePathCells);
            console.log(activePathCells, isValid)

            // Actualizamos el gridState para reflejar el path dibujado
            const updatedGrid = gridState.map(row =>
                row.map(cell => {
                    // Verificamos si esta celda está en el path actual
                    const isInPath = activePathCells.some(c => c.x === cell.x && c.y === cell.y);

                    if (isInPath) {
                        if (isValid) {
                            return {
                                ...cell,
                                hasLine: true,
                                color: activeDot.color!,
                            };
                        } else {

                            return {
                                ...cell,
                                hasLine: false,
                                color: cell.hasDot ? cell.color : '',
                            };
                        }
                    }

                    return cell; // sin cambios
                })
            );

            setGridState(updatedGrid);

            if (isValid) {
                setCompletedPaths(prev => [
                    ...prev,
                    { color: activeDot.color!, cells: activePathCells },
                ]);
            }

            // Limpieza del estado del path actual
            setActiveDot(null);
            setActivePathCells([]);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [activeDot, activePathCells]);

    // Render del tablero
    return (
        <div
            ref={boardRef}
            className="relative grid bg-gray-900"
            style={{
                width: BOARD_SIZE_PX,
                height: BOARD_SIZE_PX,
                gridTemplateColumns: `repeat(${size}, 1fr)`,
                gridTemplateRows: `repeat(${size}, 1fr)`,
            }}
        >
            {gridState.map((row, y) =>
                row.map((cell, x) => (
                    <div
                        key={`${x}-${y}`}
                        className="flex items-center justify-center aspect-square border border-gray-700 rounded-md user-draggable"
                        onMouseDown={() => cell.hasDot && handleDotClick(cell)}
                        style={cell.hasLine ? {
                            backgroundColor: `${cell.color}3A`,  // 1A = 10% de opacidad
                            borderColor: cell.color,
                            borderWidth: '2px'
                        } : {}}
                    >
                        {cell.hasDot && cell.color && (
                            <div
                                className="w-3/4 h-3/4 rounded-full shadow-md"
                                style={{ backgroundColor: cell.color }}
                            />
                        )}
                    </div>
                ))
            )}

            <AnimatePresence>
                {activeDot && activePathCells.length > 0 && (
                    <>
                        {[activeDot, ...activePathCells].map((from, idx, arr) => {
                            const to = arr[idx + 1];
                            if (!to) return null;

                            const fromCenter = getCellCenter(from.x, from.y, boardRef, size);
                            const toCenter = getCellCenter(to.x, to.y, boardRef, size);

                            if (!fromCenter || !toCenter) return null;

                            return (
                                <ActivePath
                                    key={`path-${idx}`}
                                    from={fromCenter}
                                    to={toCenter}
                                    color={activeDot.color || 'gray'}
                                    containerRef={boardRef}
                                />
                            );
                        })}
                    </>
                )}
            </AnimatePresence>

            {completedPaths.map((path, idx) => (
                path.cells.map((from, i) => {
                    const to = path.cells[i + 1];
                    if (!to) return null;

                    const fromCenter = getCellCenter(from.x, from.y, boardRef, size);
                    const toCenter = getCellCenter(to.x, to.y, boardRef, size);
                    if (!fromCenter || !toCenter) return null;

                    return (
                        <ActivePath
                            key={`completed-${idx}-${i}`}
                            from={fromCenter}
                            to={toCenter}
                            color={path.color}
                            containerRef={boardRef}
                        />
                    );
                })
            ))}


        </div>
    );
}

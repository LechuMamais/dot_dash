import { useRef, useEffect } from "react";
import { GridCell, Level, Path } from "~/game/game.types";
import { getCellCenter } from "~/utils/getCellCenter";
import ActivePath from "./ActivePath";
import { AnimatePresence } from "framer-motion";
import { useGameReducer } from "~/hooks/useGameReducer";
import { areCellsAdjacent, cellHasDot, cellHasLine, checkLevelCompletion, checkPathCompletion, haveSamePosition } from "~/game/game.functions";


export default function GameBoard({ level }: { level: Level }) {
    const BOARD_SIZE_PX = 400;
    const boardRef = useRef<HTMLDivElement>(null);
    const lastHoveredCellRef = useRef<GridCell | null>(null);
    const isMouseDownRef = useRef(false);

    const {
        state,
        startNewPath,
        addCellToPath,
        removeLastCellFromPath,
        completePath,
        deActivatePath,
        setActivePath,
        joinPath,
        resetActivePath,
    } = useGameReducer(level);

    const { gridCells, activePath, unActivePaths, completedPaths } = state;

    useEffect(() => {
        const onCellHover = (cell: GridCell) => {
            const last = activePath?.at(activePath.length - 1);
            if (!last) return;
            if (activePath?.length === 0 || activePath === null || activePath === undefined) return;
            if (!areCellsAdjacent(last, cell)) return;

            const secondLast = activePath?.at(-2);

            if (secondLast != undefined && haveSamePosition(cell, secondLast)) {
                removeLastCellFromPath();
                return;
            }


            // Si tiene línea, se podrá añadir sólo si es el final de otra linea del mismo color
            if (cellHasLine(cell)) {
                const isSameColor = cell.color === last.color;

                // Buscar un path que termine exactamente en la celda seleccionada y sea del mismo color
                const pathToJoin = unActivePaths?.find(path => {
                    const lastCell = path[path.length - 1];
                    return lastCell.x === cell.x && lastCell.y === cell.y && lastCell.color === cell.color;
                });

                if (isSameColor && pathToJoin) {
                    console.log('Unir líneas');
                    joinPath(cell, pathToJoin);
                } else {
                    return;
                }
            }


            if (cellHasDot(cell)) {
                const first = activePath[0];
                if (first && checkPathCompletion(first, cell)) {
                    addCellToPath(cell)
                    completePath();

                }
                return; // No continuar en ningún caso después de un dot
            }
            addCellToPath(cell);
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isMouseDownRef.current || !activePath || !boardRef.current) return;

            const boardRect = boardRef.current.getBoundingClientRect();
            const cellSize = boardRect.width / level.size;
            const x = Math.floor((e.clientX - boardRect.left) / cellSize);
            const y = Math.floor((e.clientY - boardRect.top) / cellSize);

            if (x < 0 || x >= level.size || y < 0 || y >= level.size) return;

            const currentCell = gridCells[y][x];
            const lastCell = lastHoveredCellRef.current;

            if (lastCell && haveSamePosition(lastCell, currentCell)) return;

            lastHoveredCellRef.current = currentCell;
            onCellHover(currentCell);
        };

        const handleMouseDown = (e: MouseEvent) => {
            if (!boardRef.current) return;

            const boardRect = boardRef.current.getBoundingClientRect();
            const cellSize = boardRect.width / level.size;
            const x = Math.floor((e.clientX - boardRect.left) / cellSize);
            const y = Math.floor((e.clientY - boardRect.top) / cellSize);

            if (x < 0 || x >= level.size || y < 0 || y >= level.size) return;

            const cell = gridCells[y][x];

            if (cellHasDot(cell)) {
                startNewPath(cell);
                isMouseDownRef.current = true;
                lastHoveredCellRef.current = cell;
                return
            }
            if (cellHasLine(cell)) {
                setActivePath(cell)
                isMouseDownRef.current = true;
                lastHoveredCellRef.current = cell;
                return
            }
        };

        const handleMouseUp = () => {
            if (state.activePath) {
                deActivatePath();
            }
            isMouseDownRef.current = false;
            lastHoveredCellRef.current = null;


            if (completedPaths && checkLevelCompletion(completedPaths, level)) {
                console.log('level completed')
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [activePath, gridCells, level.size, startNewPath, resetActivePath, state.activePath]);


    const renderPathLines = (
        paths: Path[] | null,
        keyPrefix: string
    ) =>
        paths?.flatMap((path, pathIdx) =>
            path.map((from, idx, arr) => {
                const to = arr[idx + 1];
                if (!to) return null;

                const fromCenter = getCellCenter(from.x, from.y, boardRef, level.size);
                const toCenter = getCellCenter(to.x, to.y, boardRef, level.size);
                if (!fromCenter || !toCenter) return null;

                return (
                    <ActivePath
                        key={`${keyPrefix}-${pathIdx}-${idx}`}
                        from={fromCenter}
                        to={toCenter}
                        color={path[0].color ?? ""}
                        containerRef={boardRef}
                    />
                );
            })
        );

    return (
        <div
            ref={boardRef}
            className="relative grid bg-slate-900 rounded-xl"
            style={{
                width: BOARD_SIZE_PX,
                height: BOARD_SIZE_PX,
                gridTemplateColumns: `repeat(${level.size}, 1fr)`,
                gridTemplateRows: `repeat(${level.size}, 1fr)`,
            }}
        >
            {gridCells.map((row, y) =>
                row.map((cell, x) => (
                    <div
                        key={`${x}-${y}`}
                        className="flex items-center justify-center aspect-square border border-gray-700 rounded-md user-draggable"
                        onMouseDown={() => cell.hasDot && startNewPath(cell)}
                        style={
                            cell.hasLine
                                ? {
                                    backgroundColor: `${cell.color}3A`,
                                    borderColor: cell.color,
                                    borderWidth: "2px",
                                }
                                : {}
                        }
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
                {activePath &&
                    activePath.map((from, idx, arr) => {
                        const to = arr[idx + 1];
                        if (!to) return null;

                        const fromCenter = getCellCenter(from.x, from.y, boardRef, level.size);
                        const toCenter = getCellCenter(to.x, to.y, boardRef, level.size);
                        if (!fromCenter || !toCenter) return null;

                        return (
                            <ActivePath
                                key={`active-${idx}`}
                                from={fromCenter}
                                to={toCenter}
                                color={activePath[0].color ? activePath[0].color : ""}
                                containerRef={boardRef}
                            />
                        );
                    })}
            </AnimatePresence>

            {renderPathLines(unActivePaths, "unactive")}
            {renderPathLines(completedPaths, "completed")}



        </div>
    );
}

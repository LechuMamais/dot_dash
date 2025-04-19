import { useRef, useEffect } from "react";
import { GridCell, Level } from "~/game/game.types";
import { getCellCenter } from "~/utils/getCellCenter";
import ActivePath from "./ActivePath";
import { AnimatePresence } from "framer-motion";
import { useGameReducer } from "~/hooks/useGameReducer";
import { areCellsAdjacent, cellHasDot, cellHasLine, checkPathCompletion, haveSamePosition } from "~/game/game.functions";


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
        resetActivePath,
    } = useGameReducer(level);

    const { gridCells, activePath, unActivePaths } = state;

    useEffect(() => {
        const onCellHover = (cell: GridCell) => {
            const last = activePath?.at(-1);
            if (!last) return;
            if (activePath?.length === 0 || activePath === null || activePath === undefined) return;

            if (!areCellsAdjacent(last, cell)) return;

            if (cellHasLine(cell)) return;


            const secondLast = activePath?.at(-2);
            if (secondLast != undefined && haveSamePosition(cell, secondLast)) {
                removeLastCellFromPath();
                return;
            }

            if (cellHasDot(cell)) {
                const first = activePath[0];
                if (first && checkPathCompletion(first, cell)) {
                    addCellToPath(cell)
                    completePath();
                }
                console.log(unActivePaths)
                return; // No continuar en ningún caso después de un dot
            }
            //console.log('Adding cell to path:', cell);
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
            }
        };

        const handleMouseUp = () => {
            if (state.activePath) {
                resetActivePath();
            }
            isMouseDownRef.current = false;
            lastHoveredCellRef.current = null;
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
                                color={activePath[0].color}
                                containerRef={boardRef}
                            />
                        );
                    })}
            </AnimatePresence>

            {unActivePaths.map((path, pathIdx) =>
                [path].map((from, idx, arr) => {
                    const to = arr[idx + 1];
                    if (!to) return null;

                    const fromCenter = getCellCenter(from.x, from.y, boardRef, level.size);
                    const toCenter = getCellCenter(to.x, to.y, boardRef, level.size);
                    if (!fromCenter || !toCenter) return null;

                    return (
                        <ActivePath
                            key={`done-${pathIdx}-${idx}`}
                            from={fromCenter}
                            to={toCenter}
                            color={path[0].color}
                            containerRef={boardRef}
                        />
                    );
                })
            )}

        </div>
    );
}

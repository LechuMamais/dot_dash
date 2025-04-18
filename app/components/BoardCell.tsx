import { GridCell } from '~/game/game.types';

type BoardCellProps = {
    cell: GridCell;
    onClick?: (e: React.MouseEvent) => void;
    size: number;
    setRef?: (el: HTMLDivElement | null) => void;
};

export default function BoardCell({ cell, onClick, size, setRef }: BoardCellProps) {
    return (
        <div
            className="flex items-center justify-center aspect-square border border-gray-700 rounded-md user-draggable"
            style={{ width: size, height: size }}
            onMouseDown={onClick}
            ref={cell.hasDot && cell.dotId !== undefined ? setRef : undefined}
        >
            {cell.hasDot && cell.dotColor && (
                <div
                    className="w-3/4 h-3/4 rounded-full shadow-md"
                    style={{ backgroundColor: cell.dotColor }}
                />
            )}
        </div>
    );
}

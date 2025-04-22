export type Position = [number, number];

export type Dot = {
    id: number;
    color: string;
    position: Position;
    isStart: boolean;
};

export type Level = {
    id: string;
    size: number;
    dots: Dot[];
};

export type GridCell = {
    x: number,
    y: number,
    hasDot: boolean;
    dotId?: number;
    color?: string;
    hasLine?: boolean;
    isHovered?: boolean;
};

//export type ActivePath = GridCell[];

export type Path = GridCell[];
export type Paths = Path[];

export type GameState = {
    originalGridCells: GridCell[][];
    gridCells: GridCell[][];
    activePath: Path | null;
    unActivePaths: Paths | null;
    completedPaths: Paths | null;
};



export type GameAction =
    | {
        type: 'START_NEW_PATH';
        payload: { gridCell: GridCell };
    }
    | {
        type: 'ADD_CELL_TO_PATH';
        payload: { gridCell: GridCell };
    }
    | {
        type: 'REMOVE_LAST_CELL_FROM_PATH';
    }
    | {
        type: 'COMPLETE_PATH';
    }
    | {
        type: 'DEACTIVATE_PATH';
    }
    | {
        type: 'SET_ACTIVE_PATH';
        payload: { gridCell: GridCell };
    }
    | {
        type: 'JOIN_PATH';
        payload: { gridCell: GridCell, endPathToJoin: Path };
    }
    | {
        type: 'RESET_ACTIVE_PATH';
    }
    | {
        type: 'RESET';
    };
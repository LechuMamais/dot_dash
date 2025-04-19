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

export type ActivePath = GridCell[];

export type UnActivePath = {
    path: ActivePath;
    isCompleted: boolean;
};

export type UnActivePaths = UnActivePath[];

export type GameState = {
    originalGridCells: GridCell[][];
    gridCells: GridCell[][];
    activePath: ActivePath | null;
    unActivePaths: UnActivePaths;
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
        type: 'RESET_ACTIVE_PATH';
    }
    | {
        type: 'RESET';
    };
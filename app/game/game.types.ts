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

export type ActivePath = {
    color: string;
    fromDotId: number;
    positions: Position[];
};

export type GameState = {
    paths: ActivePath[];
    currentPath: ActivePath | null;
};

export type GridCell = {
    x: number;
    y: number;
    hasDot: boolean;
    dotId?: number;
    color?: string;
    hasLine?: boolean;
    isHovered?: boolean;
};

/*
export type GameAction =
    | { type: 'START_PATH'; payload: { dotId: number; color: string; position: Position } }
    | { type: 'ADD_POSITION'; payload: { position: Position } }
    | { type: 'END_PATH'; payload: { toDotId: number } }
    | { type: 'RESET' };
*/
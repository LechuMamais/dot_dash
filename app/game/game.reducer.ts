import { GameState, GameAction } from './game.types';

export function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'START_PATH':
            return {
                ...state,
                currentPath: {
                    fromDotId: action.payload.dotId,
                    color: action.payload.color,
                    positions: [action.payload.position],
                },
            };

        case 'ADD_POSITION':
            if (!state.currentPath) return state;
            return {
                ...state,
                currentPath: {
                    ...state.currentPath,
                    positions: [...state.currentPath.positions, action.payload.position],
                },
            };

        case 'END_PATH':
            if (!state.currentPath) return state;

            // Check if it's a valid end (could extend this logic more later)
            if (action.payload.toDotId === state.currentPath.fromDotId) return state;

            return {
                paths: [...state.paths, state.currentPath],
                currentPath: null,
            };

        case 'RESET':
            return {
                paths: [],
                currentPath: null,
            };

        default:
            return state;
    }
}

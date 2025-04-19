import { GameActions } from './game.actions';
import { GameAction, GameState } from './game.types';

export const initialState: GameState = {
    originalGridCells: [[]],
    gridCells: [[]],
    activePath: null,
    unActivePaths: []
};

export function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case GameActions.START_NEW_PATH: {
            return {
                ...state,
                activePath: [action.payload.gridCell],
            };
        }

        case GameActions.ADD_CELL_TO_PATH: {
            if (!state.activePath) return state;
            return {
                ...state,
                activePath: [...state.activePath, action.payload.gridCell],
            };
        }

        case GameActions.REMOVE_LAST_CELL_FROM_PATH: {
            if (!state.activePath || state.activePath.length === 0) return state;
            return {
                ...state,
                activePath: state.activePath.slice(0, -1),
            };
        }

        case GameActions.COMPLETE_PATH: {
            if (!state.activePath || state.activePath.length <= 1) return state;
            return {
                ...state,
                activePath: null,
                unActivePaths: [
                    ...state.unActivePaths,
                    {
                        path: [...state.activePath],
                        isCompleted: true,
                    }
                ]
            };
        }

        case GameActions.RESET_ACTIVE_PATH:
            return { ...state, activePath: [] };

        case GameActions.RESET: {
            return {
                ...state,
                gridCells: state.originalGridCells,
                activePath: null,
                unActivePaths: []
            };
        }

        default:
            return state;
    }
}

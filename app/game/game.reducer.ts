import { GameActions } from './game.actions';
import { GameAction, GameState } from './game.types';

export const initialState: GameState = {
    originalGridCells: [[]],
    gridCells: [[]],
    activePath: null,
    unActivePaths: [],
    completedPaths: []
};

export function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case GameActions.START_NEW_PATH: {
            const startCell = action.payload.gridCell;
            startCell.color = action.payload.gridCell.color;
            startCell.hasLine = true;
            startCell.isHovered = true;
            return {
                ...state,
                activePath: [startCell],
            };
        }

        case GameActions.ADD_CELL_TO_PATH: {
            if (!state.activePath) return state;

            const newCell = action.payload.gridCell;
            const color = state.activePath[0].color;

            // Clonamos la matriz
            const newGridCells = state.gridCells.map(row => row.map(cell => ({ ...cell })));

            // Actualizamos la celda específica dentro de la matriz
            const cellToUpdate = newGridCells[newCell.y][newCell.x];
            cellToUpdate.color = color;
            cellToUpdate.hasLine = true;
            cellToUpdate.isHovered = true;

            return {
                ...state,
                activePath: [...state.activePath, { ...cellToUpdate }],
                gridCells: newGridCells,
            };
        }

        case GameActions.REMOVE_LAST_CELL_FROM_PATH: {
            if (!state.activePath || state.activePath.length === 0) return state;

            const newPath = [...state.activePath];
            const removedCell = newPath.pop(); // Removemos la última

            const newGridCells = state.gridCells.map(row => row.map(cell => ({ ...cell })));

            if (removedCell) {
                const gridCell = newGridCells[removedCell.y][removedCell.x];
                gridCell.hasLine = false;
                gridCell.isHovered = false;
                gridCell.color = ''; // Opcional
            }

            return {
                ...state,
                activePath: state.activePath.slice(0, -1),
                gridCells: newGridCells,
            };
        }

        case GameActions.DEACTIVATE_PATH: {
            if (!state.activePath) return state;

            return {
                ...state,
                unActivePaths: [
                    ...(state.unActivePaths ?? []),
                    state.activePath,
                ],
                activePath: [],
            };
        }


        case GameActions.JOIN_PATH: {

            console.log('JOIN_PATH', action.payload.gridCell, action.payload.endPathToJoin);
            if (!state.activePath) return state;

            const joinedPath = [
                ...action.payload.endPathToJoin,
                ...state.activePath
            ];

            return {
                ...state,
                activePath: joinedPath,
                unActivePaths: state.unActivePaths?.filter(path => path[0].color !== action.payload.gridCell.color) ?? []
            }

        }


        case GameActions.RESET_ACTIVE_PATH: {
            if (!state.activePath) return state;

            const newGridCells = state.gridCells.map(row => row.map(cell => ({ ...cell })));

            state.activePath.forEach(cell => {
                const gridCell = newGridCells[cell.y][cell.x];
                gridCell.hasLine = false;
                gridCell.isHovered = false;
                gridCell.color = gridCell.hasDot ? gridCell.color : '';
            });

            return {
                ...state,
                activePath: [],
                gridCells: newGridCells,
            };
        }

        case GameActions.SET_ACTIVE_PATH: {
            return {
                ...state,
                activePath: state.unActivePaths?.find(path => {
                    return path.some(cell => cell.x === action.payload.gridCell.x && cell.y === action.payload.gridCell.y)
                }) ?? null,
                unActivePaths: state.unActivePaths?.filter(path => {
                    return !path.some(cell => cell.x === action.payload.gridCell.x && cell.y === action.payload.gridCell.y)
                }) ?? null
            }
        }

        case GameActions.COMPLETE_PATH: {
            if (!state.activePath || state.activePath.length === 0) return state;

            const newGridCells = state.gridCells.map(row => row.map(cell => ({ ...cell })));

            state.activePath.forEach(cell => {
                const gridCell = newGridCells[cell.y][cell.x];
                gridCell.hasLine = true;
                gridCell.isHovered = false;
            });

            return {
                ...state,
                completedPaths: [...(state.completedPaths ?? []), state.activePath],
                activePath: [],
                gridCells: newGridCells,
            };
        }

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

import { useReducer } from 'react';
import { GameActions } from '~/game/game.actions';
import { gameReducer } from '~/game/game.reducer';
import { GameState, GridCell, Level, Path } from '~/game/game.types';
import { createInitialGrid } from '~/utils/createInitialGrid';

const getInitialState = (level: Level): GameState => {
    const grid = createInitialGrid(level.size, level.dots);
    return {
        originalGridCells: grid,
        gridCells: grid,
        activePath: null,
        unActivePaths: [],
        completedPaths: []
    };
};

export const useGameReducer = (level: Level) => {
    const [state, dispatch] = useReducer(gameReducer, getInitialState(level));

    const startNewPath = (cell: GridCell) =>
        dispatch({
            type: GameActions.START_NEW_PATH,
            payload: { gridCell: cell },
        });

    const addCellToPath = (cell: GridCell) =>
        dispatch({
            type: GameActions.ADD_CELL_TO_PATH,
            payload: { gridCell: cell },
        });

    const removeLastCellFromPath = () =>
        dispatch({ type: GameActions.REMOVE_LAST_CELL_FROM_PATH });

    const completePath = () =>
        dispatch({ type: GameActions.COMPLETE_PATH });

    const deActivatePath = () => {
        dispatch({ type: GameActions.DEACTIVATE_PATH });
    }

    const setActivePath = (cell: GridCell) => {
        dispatch({ type: GameActions.SET_ACTIVE_PATH, payload: { gridCell: cell } });
    }

    const joinPath = (cell: GridCell, endPathToJoin: Path) => {
        dispatch({ type: GameActions.JOIN_PATH, payload: { gridCell: cell, endPathToJoin: endPathToJoin } });
    }

    const resetActivePath = () => dispatch({ type: GameActions.RESET_ACTIVE_PATH });

    const resetGame = () =>
        dispatch({ type: GameActions.RESET });

    return {
        state,
        startNewPath,
        addCellToPath,
        removeLastCellFromPath,
        completePath,
        deActivatePath,
        setActivePath,
        joinPath,
        resetActivePath,
        resetGame,
    };
};

import { useReducer } from 'react';
import { GameActions } from '~/game/game.actions';
import { gameReducer } from '~/game/game.reducer';
import { GameState, GridCell, Level } from '~/game/game.types';
import { createInitialGrid } from '~/utils/createInitialGrid';

const getInitialState = (level: Level): GameState => {
    const grid = createInitialGrid(level.size, level.dots);
    return {
        originalGridCells: grid,
        gridCells: grid,
        activePath: null,
        unActivePaths: [],
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

    const resetActivePath = () => dispatch({ type: "RESET_ACTIVE_PATH" });

    const resetGame = () =>
        dispatch({ type: GameActions.RESET });

    return {
        state,
        startNewPath,
        addCellToPath,
        removeLastCellFromPath,
        completePath,
        resetActivePath,
        resetGame,
    };
};

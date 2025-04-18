import { useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/node';
import levels from '~/utils/levels.js';
import GameBoard from '~/components/GameBoard';
import { Level } from '~/game/game.types';
import { motion } from "motion/react"

export const loader: LoaderFunction = async ({ params }) => {
    const levelId = params.levelId;
    const levelData = levels.find((level): level is Level => level.id === levelId);

    if (!levelData) {
        throw new Response('Nivel no encontrado', { status: 404 });
    }

    return levelData;
};

export default function GameRoute() {
    const levelData = useLoaderData<Level>();

    const handleRestart = () => {
        window.location.reload();
    }

    return (
        <div className='flex flex-col justify-center items-center w-[100svw] h-[100svh] mx-[auto] overflow-hidden'>
            <h1 className='my-8 text-3xl font-bold select-none'>Dot Dash - Nivel {levelData.id}</h1>
            <GameBoard {...levelData} />
            <motion.button className='right-4 bg-["#3f3f3f"] text-white px-4 
            py-2 rounded-md shadow-md my-8'
                whileHover={{ backgroundColor: '#4f4f4f' }}
                whileTap={{ backgroundColor: '#2f2f2f' }}
                transition={{ duration: 0.2 }}
                onClick={() => handleRestart()}
            >Restart</motion.button>
        </div>
    );
}
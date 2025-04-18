import { motion } from 'framer-motion';

export default function Dot({ dot, onClick, isSelected }: {
    dot: { id: number; color: string };
    onClick: (id: number) => void;
    isSelected: boolean;
}) {
    return (
        <motion.div
            onClick={() => onClick(dot.id)}
            animate={{
                scale: isSelected ? 1.2 : 1,
                backgroundColor: dot.color,
            }}
            className="rounded-full cursor-pointer"
        />
    );
}
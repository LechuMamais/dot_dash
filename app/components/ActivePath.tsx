import { motion } from "framer-motion";

type Props = {
    from: { x: number; y: number };
    to: { x: number; y: number };
    color: string;
    containerRef: React.RefObject<HTMLElement>;
};

export default function ActivePath({ from, to, color, containerRef }: Props) {
    if (!containerRef.current) return null;

    const boardRect = containerRef.current.getBoundingClientRect();
    const startX = from.x - boardRect.left;
    const startY = from.y - boardRect.top;
    const endX = to.x - boardRect.left;
    const endY = to.y - boardRect.top;

    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    return (
        <motion.div
            className="absolute origin-left h-1 border-[12px] rounded-full pointer-events-none"
            style={{
                top: startY - 12,
                left: startX,
                width: distance - 8,
                backgroundColor: color,
                borderColor: color,
                transformOrigin: '0 50%',
                boxSizing: 'content-box'
            }}
            initial={{
                scale: 0,
                rotate: angle,
                opacity: 0
            }}
            animate={{
                scale: 1,
                rotate: angle,
                opacity: 1
            }}
            exit={{
                width: 0,
                opacity: 0,
                transition: {
                    width: { duration: 0.20 }, opacity: { duration: 0.15, delay: 0.05 },
                }
            }}
            transition={{
                scale: { type: "spring", stiffness: 300, damping: 30, duration: 0.5 },
                rotate: { duration: 0 },
                opacity: { duration: 0.1 }
            }}
        />
    );
}
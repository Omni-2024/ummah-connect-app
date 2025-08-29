import { cn } from "@/lib/className";
import { motion } from "framer-motion";

interface Props {
    children: React.ReactNode;
    className?: string;
}

const CardWrapper: React.FC<Props> = ({ children, className }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className={cn(
                "overflow-hidden border-dark-50 bg-white p-4 md:rounded-3xl md:border md:p-5 md:shadow-xl",
                className,
            )}
        >
            {children}
        </motion.div>
    );
};

export default CardWrapper;

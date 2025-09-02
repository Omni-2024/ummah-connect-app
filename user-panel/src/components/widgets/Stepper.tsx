import { AnimatePresence, motion } from "framer-motion";
import { TickCircle } from "iconsax-react";

import { cn } from "@/lib/className";

interface Props {
    steps: { stepId: string; title: string }[];
    currentStepId: string;
}

const Stepper: React.FC<Props> = ({ steps, currentStepId }) => {
    return (
        <div>
            <div className="px-4 pb-16 lg:hidden">
                <div className="relative flex items-center justify-center gap-2">
                    {steps.map(({ stepId, title }) => {
                        const getStatus = () => {
                            if (stepId === currentStepId) return "current";
                            if (
                                steps.findIndex((step) => step.stepId === stepId) >
                                steps.findIndex((step) => step.stepId === currentStepId)
                            )
                                return "todo";
                            return "done";
                        };

                        const status = getStatus();

                        return (
                            <div key={stepId} className="flex-1">
                                <div
                                    className={cn("h-2 flex-1 rounded-full bg-primary-400", {
                                        "bg-primary-100": status === "todo",
                                        "bg-primary-400": status === "current",
                                    })}
                                />

                                {currentStepId === stepId && (
                                    <div className="absolute left-0 space-y-1 pt-2">
                                        <p className="space-x-1 font-medium text-dark-300">
                                            <span>Step</span>
                                            <span>
                        {steps.findIndex(
                            (step) => step.stepId === currentStepId,
                        ) + 1}
                      </span>
                                            <span>of</span>
                                            <span>{steps?.length}</span>
                                        </p>

                                        <div className="font-primary text-lg font-semibold">
                                            {title}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="hidden w-full items-center justify-center px-2 lg:flex">
                <StepSeparator />

                {steps?.map(({ stepId, title }, index) => {
                    const getStatus = () => {
                        if (stepId === currentStepId) return "current";
                        if (
                            index > steps?.findIndex((step) => step.stepId === currentStepId)
                        )
                            return "todo";
                        return "done";
                    };
                    const status = getStatus();

                    return (
                        <div key={stepId} className="flex items-center">
                            <StepperItem
                                stepId={stepId}
                                index={index}
                                title={title}
                                status={status}
                            />
                            <StepSeparator />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Stepper;

interface StepperItemProps {
    stepId: string;
    title: string;
    index: number;
    status?: "todo" | "current" | "done";
}

const StepperItem: React.FC<StepperItemProps> = ({
                                                     title,
                                                     index,
                                                     status = "todo",
                                                 }) => {
    const animationConfig = {
        initial: { opacity: 0.4, scale: 0.6 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0.4, scale: 0.6 },
        transition: { duration: 0.2 },
    };

    return (
        <div className="flex select-none items-center gap-4">
            <AnimatePresence mode="wait">
                {status === "done" ? (
                    <motion.div key="done" {...animationConfig}>
                        <TickCircle variant="Bold" className="size-6 text-tertiary-500" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="todo"
                        {...animationConfig}
                        className={cn(
                            "flex size-6 items-center justify-center rounded-full bg-tertiary-500 text-sm font-medium text-white transition-colors ease-in-out",
                            {
                                "bg-tertiary-100": status === "todo",
                            },
                        )}
                    >
                        {index + 1}
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                className={cn(
                    "line-clamp-1 text-sm font-medium text-tertiary-500 transition-colors ease-in-out",
                    {
                        "text-tertiary-100": status === "todo",
                    },
                )}
            >
                {title}
            </div>
        </div>
    );
};

const StepSeparator = () => {
    return <div className="mx-6 h-0.5 w-12 rounded-full bg-tertiary-200" />;
};

interface StepWrapperProps {
    children: React.ReactNode;
    className?: string;
}
/** Adds a simple animation to the step content components */
export const StepComponentWrapper: React.FC<StepWrapperProps> = ({
                                                                     children,
                                                                     className,
                                                                 }) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
        >
            {children}
        </motion.div>
    );
};

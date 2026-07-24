"use client";

import React from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

type AnimatedSectionProps = {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    /** "onView" anima ao entrar na tela (padrão). "onLoad" anima assim que a página carrega — use só no topo da página (hero). */
    mode?: "onView" | "onLoad";
    as?: keyof JSX.IntrinsicElements;
};

export default function AnimatedSection({
    children,
    className,
    delay = 0,
    mode = "onView",
    as = "div",
}: AnimatedSectionProps) {
    const MotionTag = motion[as as "div"];

    if (mode === "onLoad") {
        return (
            <MotionTag
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay, ease: "easeOut" }}
                className={className}
            >
                {children}
            </MotionTag>
        );
    }

    return (
        <MotionTag
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            //@ts-ignore
            variants={fadeInUp}
            transition={{ delay }}
            className={className}
        >
            {children}
        </MotionTag>
    );
}
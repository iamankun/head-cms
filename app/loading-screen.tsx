"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import styles from "./loading-screen.module.css";

interface LoadingScreenProps {
    readonly title?: string;
    readonly subtitle?: string;
    readonly logoUrl?: string; // Should be a path relative to /public, e.g., "/loading.webp"
    readonly duration?: number;
    readonly onComplete?: () => void;
    readonly show?: boolean;
}

export function LoadingScreen({
    title = "An Kun Studio",
    subtitle = "Đang tải ...",
    logoUrl = "/loading.webp",
    duration = 3000,
    onComplete,    // Add a new prop for controlling the loading state

    show = true,
}: LoadingScreenProps) {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(show);
    const [isFadingOut, setIsFadingOut] = useState(false);

    const handleComplete = useCallback(() => {
        setIsFadingOut(true);
        setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
        }, 500);
    }, [onComplete]);

    const updateProgress = useCallback(() => {
        setProgress((prev) => {
            const increment = Math.random() * 10 + 2; // 2-12% increment
            const newProgress = prev + increment;

            if (newProgress >= 100) {
                setTimeout(handleComplete, 500);
                return 100;
            }

            return newProgress;
        });
    }, [handleComplete]);

    useEffect(() => {
        if (!show) return;

        const interval = setInterval(updateProgress, 150);

        return () => {
            clearInterval(interval);
        };
    }, [show, updateProgress]);

    useEffect(() => {
        setIsVisible(show);
        if (show) {
            setIsFadingOut(false);
            setProgress(0);
        }
    }, [show]);

    if (!isVisible) return null;

    const overlayClasses = `${styles.loadingOverlay} ${isFadingOut ? styles.fadeOut : ''}`;

    return (
        <div className={overlayClasses}>
            {/* Logo Section */}
            <div className={styles.logoSection}>
                <div className={styles.logoAnimation}>
                    <div className={styles.logoImage}>
                        <Image
                            src={logoUrl}
                            alt="Logo"
                            width={120}
                            height={120}
                            className={styles.logo}
                            priority
                        />
                    </div>
                </div>

                {/* Glow effect */}
                <div className={styles.glowBackground}>
                    <div className={styles.glowCircle} />
                </div>
            </div>

            {/* Loading Content */}
            <div className={styles.loadingContent}>
                <h1 className={styles.loadingTitle}>{title}</h1>
                <p className={styles.loadingSubtitle}>{subtitle}</p>

                {/* Progress Bar */}
                <div className={styles.progressWrapper}>
                    <div className={styles.progressTrack}>
                        <div
                            className={styles.progressFill}
                            data-progress={Math.round(progress)}
                        />
                    </div>
                    <div className={styles.progressText}>
                        {Math.round(progress)}%
                    </div>
                </div>

                {/* Loading Animation Dots */}
                <div className={styles.loadingDots}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                </div>
            </div>
        </div>
    );
}

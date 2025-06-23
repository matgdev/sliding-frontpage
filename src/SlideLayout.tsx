import React, { useState, useRef, type ReactElement } from "react";
import "./SlideLayout.css";

interface AnimState {
    exitAnim: "to-top" | "to-bottom" | null;
    enterAnim: "from-top" | "from-bottom" | null;
}

export function SlideLayout({ children }: { children?: Array<ReactElement> }) {
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);
    const [animationSet, setAnimationSet] = useState<AnimState | null>(null);
    const throttleScroll = useRef(false);
    const isAnimating = useRef(false);
    const touchStart = useRef(0);
    const scrollCount = useRef(0);
    const transitionCount = useRef(0);

    const handleClickNavigation = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isAnimating.current) return;

        const target = event.target as HTMLElement;
        const navigationIndex = Number(target.dataset.id);

        isAnimating.current = true;
        scrollCount.current = navigationIndex - activeSlideIdx;
        setAnimationSet(() => {
            return {
                exitAnim: navigationIndex < activeSlideIdx ? "to-bottom" : "to-top",
                enterAnim: null,
            };
        });
    };

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        event.stopPropagation();
        touchStart.current = event.touches[0].clientY;
    };

    const handleWheel = (
        event: React.WheelEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
        event.stopPropagation();
        let deltaY = 0;

        if ("touches" in event) {
            deltaY = touchStart.current - event.changedTouches[0].clientY;
        } else {
            deltaY = event.deltaY;
        }

        if (throttleScroll.current) return;
        throttleScroll.current = true;

        scrollCount.current += deltaY < 0 ? -1 : 1;

        if (
            !(
                scrollCount.current === 0 ||
                (scrollCount.current > 0 &&
                    activeSlideIdx >= (children?.length ? children.length - 1 : 0)) ||
                (scrollCount.current < 0 && activeSlideIdx <= 0)
            )
        ) {
            if (isAnimating.current == false) {
                isAnimating.current = true;
                setAnimationSet(() => {
                    return {
                        exitAnim: deltaY < 0 ? "to-bottom" : "to-top",
                        enterAnim: null,
                    };
                });
            }
        } else {
            scrollCount.current -= deltaY < 0 ? -1 : 1;
        }

        setTimeout(() => (throttleScroll.current = false), 50);
    };

    const handleTransitionEnd = (event: React.TransitionEvent) => {
        event.stopPropagation();
        transitionCount.current += 1;
        if (transitionCount.current === 2) {
            setActiveSlideIdx((curr: number) =>
                clamp(curr + scrollCount.current, 0, children?.length ? children.length - 1 : 0)
            );
            setAnimationSet((curr) => {
                return {
                    enterAnim: curr?.exitAnim === "to-top" ? "from-bottom" : "from-top",
                    exitAnim: null,
                };
            });
            transitionCount.current = 0;
        }
    };

    const handleAnimationEnd = (event: React.AnimationEvent) => {
        event.stopPropagation();
        isAnimating.current = false;
        scrollCount.current = 0;
    };

    const classNames = [];

    if (animationSet) {
        if (animationSet.enterAnim) {
            if (animationSet.enterAnim === "from-top") classNames.push("animate-[sft_1s]");
            else classNames.push("animate-[sfb_1s]");
        }

        if (animationSet.exitAnim) {
            if (animationSet?.exitAnim === "to-top") classNames.push("-translate-y-full");
            else classNames.push("translate-y-full");
            classNames.push("opacity-0");
        }
    }

    const currentSlide = (
        <div
            key={activeSlideIdx}
            className={
                "h-full w-full transition-[opacity_transform] duration-300 ease-in " +
                classNames.join(" ")
            }
            onTransitionEnd={handleTransitionEnd}
            onAnimationEnd={handleAnimationEnd}
        >
            {children?.filter((x, id) => x && id === activeSlideIdx)}
        </div>
    );

    const slideBar = children?.map((_c, idx) => (
        <div
            key={idx}
            data-id={idx}
            className={`h-[5px] flex-1 rounded border border-light-border dark:border-dark-border ${idx === activeSlideIdx ? "bg-emphasis" : "cursor-pointer"}`}
            onClick={idx === activeSlideIdx ? undefined : handleClickNavigation}
        ></div>
    ));
    return (
        <div
            className="flex h-full w-full touch-pan-y flex-col items-stretch justify-stretch overflow-hidden bg-linear-to-br from-zinc-300 to-neutral-300 p-4 text-neutral-950 dark:from-gray-800 dark:to-neutral-800 dark:text-gray-300"
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleWheel}
        >
            <div className="mb-2 flex w-full justify-center gap-1 self-center">{slideBar}</div>
            {currentSlide}
        </div>
    );
}

function clamp(num: number, left: number, right: number) {
    if (num < left) return left;
    if (num > right) return right;
    return num;
}

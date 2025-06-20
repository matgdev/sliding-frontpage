import React, { useState, type ReactNode, useRef, type ReactElement, type Ref, useLayoutEffect, useEffect } from "react";
import "./SlideLayout.css";
import "./theme.css"

interface AnimState {
    exitAnim: "to-top" | "to-bottom" | null,
    enterAnim: "from-top" | "from-bottom" | null
}

export function SlideLayout({ children }: { children?: Array<ReactElement> }) {

    const [activeSlideIdx, setActiveSlideIdx] = useState(0);
    const [animationSet, setAnimationSet] = useState<AnimState | null>(null);
    const throttleScroll = useRef(false);
    const isAnimating = useRef(false);
    const scrollCount = useRef(0);
    const transitionCount = useRef(0);

    const handleClickNavigation = (event: React.MouseEvent<HTMLDivElement>) => {
        
    }

    const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
        if (throttleScroll.current) return;
        throttleScroll.current = true;

        scrollCount.current += event.deltaY < 0 ? -1 : 1;

        if (!   (scrollCount.current === 0
                || (scrollCount.current > 0 && (activeSlideIdx >= (children?.length ? children.length - 1 : 0)))
                || (scrollCount.current < 0 && activeSlideIdx <= 0)
                )) {

            if (isAnimating.current == false) {
                isAnimating.current = true;
                setAnimationSet((curr) => {
                    return {
                        exitAnim: (event.deltaY < 0 ? "to-bottom" : "to-top"),
                        enterAnim: null
                    }
                });
            }

        } else{
            scrollCount.current -= event.deltaY < 0 ? -1 : 1;
        }

        setTimeout(() => throttleScroll.current = false, 200);
    }

    const handleTransitionEnd = () => {
        transitionCount.current += 1;
        if (transitionCount.current === 2) {
            setActiveSlideIdx((curr: number) => clamp(curr + scrollCount.current, 0, children?.length ? children.length - 1 : 0));
            setAnimationSet(curr => {
                return {
                    enterAnim: curr?.exitAnim === "to-top" ? "from-bottom" : "from-top",
                    exitAnim: null
                }
            });
            transitionCount.current = 0;
        }
    }

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


    const currentSlide = <div
        key={activeSlideIdx}
        className={"w-full h-full transition-all duration-1000 " + classNames.join(" ")}
        onTransitionEnd={handleTransitionEnd}
        onAnimationEnd={() => {
            isAnimating.current = false;
            scrollCount.current = 0;
        }}>
        {children?.filter((x, id) => x && id === activeSlideIdx)}
    </div>

    const slideBar = children?.map((c, idx) => <div 
                                                    key={idx} 
                                                    className={`h-[5px] cursor-pointer border dark:border-dark-border flex-1 ${idx === activeSlideIdx ? "bg-emphasis" : "" }`}
                                                    onClick={handleClickNavigation}
                                                    ></div>);
    return (
        <div className="w-screen h-screen bg-linear-to-br from-stone-100 to-neutral-300 text-neutral-950 dark:from-gray-800 dark:to-neutral-800 dark:text-gray-300 p-4 flex flex-col items-stretch justify-stretch overflow-hidden" 
            onWheel={handleWheel}>
                <div className="w-full flex justify-center gap-1 my-2 px-1 self-center">
                    {slideBar}
                </div>
            {currentSlide}
        </div>
    )
}

function clamp(num: number, left: number, right: number) {
    if (num < left) return left;
    if (num > right) return right;
    return num;
}
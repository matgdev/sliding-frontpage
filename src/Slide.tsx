import type React from "react";

export function Slide(props: React.HTMLAttributes<HTMLDivElement>) {
    let className =
        "bg-light-primary border border-light-border dark:border-dark-border dark:bg-dark-primary dark:text-bg-dark-secondary rounded p-4 w-full h-full";
    let children = false;
    if (props.className) className = className.concat(" ", props.className);
    if (props.children) children = true;

    return <div className={className}>{children ? props.children : ""}</div>;
}

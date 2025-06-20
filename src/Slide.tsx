import "./theme.css"

export function Slide(props: any) {


    let className = "bg-slate-300 border dark:border-dark-border dark:bg-dark-primary dark:text-bg-dark-secondary rounded p-4 w-full h-full";
    let children = false;
    if (props.className) className = className.concat(" ", props.className);
    if (props.children) children = true;

    return (
        <div className={className}>
            {children ? props.children : ""}
        </div>
    );
}
export default function useSettings(attributes) {
    const { 
        display, 
        flexDirection, 
        flexWrap, 
        gridColumns, 
        alignItems, 
        justifyContent, 
        gap 
    } = attributes;

    // Tailwind: block flex grid
    const displayClass = [
        "block", 
        "flex", 
        "grid"
    ].includes(display) 
        ? display 
        : "block";

    // Tailwind: flex-row flex-row-reverse flex-col flex-col-reverse
    const flexDirectionClass = (
        [
            "row", 
            "row-reverse", 
            "col", 
            "col-reverse"
        ].includes(flexDirection) && 
        display === "flex"
    ) 
        ? `flex-${flexDirection}`
        : "";


    // Tailwind: flex-wrap
    const flexWrapClass = (flexWrap && display === "flex") 
        ? "flex-wrap" 
        : "";


    // Tailwind: grid-cols-1 grid-cols-2 grid-cols-3
    const gridColumnsClass = (gridColumns && display === "grid") 
        ? `grid-cols-${gridColumns}` 
        : "";


    // Tailwind: justify-start justify-end justify-center justify-between justify-around 
    // justify-items-start justify-items-end justify-items-center justify-items-between justify-items-around
    const justifyContentClass = (
        [
            "start", 
            "end", 
            "center", 
            "between", 
            "around"
        ].includes(justifyContent) && 
        [
            "flex", 
            "grid"
        ].includes(display)
    ) 
        ? (display === "flex" 
                ? `justify-${justifyContent}` 
                : `justify-items-${justifyContent}`)
        : "";


    // Tailwind: self-start self-end self-center self-stretch self-baseline
    const alignItemsClass = (
        [
            "center", 
            "start", 
            "end"
        ].includes(alignItems) && 
        [
            "flex", 
            "grid"
        ].includes(display)
     ) 
        ? `self-${alignItems}` 
        : "";


    // Tailwind: gap-1 gap-2 gap-3 gap-4 gap-5 gap-6 gap-7 gap-8 gap-9 gap-10
    const gapClass = gap 
        ? `gap-${gap}` 
        : "";

    return { 
        displayClass, 
        flexDirectionClass, 
        flexWrapClass, 
        gridColumnsClass, 
        justifyContentClass, 
        alignItemsClass, 
        gapClass 
    };
}
export default function useClassNames( attributes ) {
    // Tailwind: grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4 grid-cols-6 grid-cols-8 grid-cols-10 grid-cols-12
    // md:grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:grid-cols-4 md:grid-cols-6 md:grid-cols-8 md:grid-cols-10 md:grid-cols-12
    // xl:grid-cols-1 xl:grid-cols-2 xl:grid-cols-3 xl:grid-cols-4 xl:grid-cols-6 xl:grid-cols-8 xl:grid-cols-10 xl:grid-cols-12
    // gap-1 gap-2 gap-3 gap-4 gap-5 gap-6 gap-7 gap-8 gap-9 gap-10
    const { columns, columnsAtTablets, columnsAtPhones, gap } = attributes;

    const className = `theme-grid grid grid-cols-${columnsAtPhones} md:grid-cols-${columnsAtTablets} xl:grid-cols-${columns} gap-${gap}`;

    return { className };
}
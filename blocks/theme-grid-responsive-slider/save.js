import { useBlockProps } from '@wordpress/block-editor';
import { InnerBlocks } from '@wordpress/block-editor';


export default function save({ attributes }) {
    // Tailwind: grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:grid-cols-4 lg:grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4
    const { 
        boxes, 
        sliderSince,
        tabletColumns, 
        phoneColumns,
        progressShow, 
        progressColor
     } = attributes;
    
    const sliderSinceClass = sliderSince !== 'none' ? `slider-${sliderSince}` : '';
    const desktopColumnsClass = sliderSince === 'desktop' ? `lg:grid-cols-1` : `lg:grid-cols-${boxes}`;
    const tabletColumnsClass = sliderSince === 'none' || sliderSince === 'phone' ? `md:grid-cols-${tabletColumns}` : `md:grid-cols-1`;
    const phoneColumnsClass = sliderSince !== 'none' ? `grid-cols-${phoneColumns}` : `grid-cols-1`;
	const progressClass = (
        `bg-${progressColor}-500` + 
        `${(sliderSince === 'none' || !progressShow) ? ' hidden' : ''}` +
        `${(sliderSince === 'tablet' && progressShow) ? ' lg:hidden' : ''}` +
        `${(sliderSince === 'phone' && progressShow) ? ' md:hidden lg:hidden' : ''}`
    );

    const blockProps = useBlockProps.save({
		className: "relative z-40 container theme-highlight-section",
        'data-dots': attributes.dotsShow,
		'data-arrows': attributes.arrowsShow,
		'data-autoplay': attributes.autoPlay,
		'data-swipe': attributes.swipeAllow,
	}); 

    // Tailwind: bg-red-500 bg-green-500
	return (
        <div { ...blockProps } style={{ paddingBottom: '0' }}>
            <div 
                className={`flickity grid gap-2 grid-cols-1 ${sliderSinceClass} ${phoneColumnsClass} ${tabletColumnsClass} ${desktopColumnsClass}`}
                data-flickity-progress="0%"
            >
                <InnerBlocks.Content />
            </div>

            { progressShow && (
                <div 
                className={`progress transition ease-in-out duration-300 absolute z-40 bottom-0 left-4 right-4 h-[4px] ${progressClass} w-0`}
                style={{ maxWidth: 'calc(100% - (0.25rem * 4 * 2))' }}
                ></div>
            )}
        </div>
	);
}
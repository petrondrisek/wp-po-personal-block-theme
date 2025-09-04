import { useBlockProps, RichText } from '@wordpress/block-editor';


export default function save({ attributes }) {
    const { content, skillPercentage } = attributes;
    
    const blockProps = useBlockProps.save({
        className: "theme-skill-box bg-gray-100 p-2 overflow-hidden rounded border-2 border-gray-200 flex items-center gap-4 w-full h-[12px] relative",
    }); 

    const percentageLabelLeft = skillPercentage < 15 ? '-0.5rem' : '3rem'; 
    const percentageLabelColor = skillPercentage < 15 ? '' : 'text-white';

	return (
        <div className='theme-skill-box-container'>
            <RichText.Content
                tagName="p"	
                value={ content }
            />

            <div { ...blockProps } data-max-width={`${ skillPercentage }%`} style={{ '--max-width': `${ skillPercentage }%`, '--label-left': `${ percentageLabelLeft }`}}>
                <p className={`skill-percentage absolute z-40 text-[12px] ${percentageLabelColor}`} style={{ left: `calc(var(--max-width) - (${ percentageLabelLeft }))` }} data-max-width={`${ skillPercentage } %`}></p>
                <div className="progress-bar bg-green-500 w-full h-[32px] top-0 left-0 absolute" style={{ maxWidth: `var(--max-width)` }}></div>
            </div>
        </div>
	);
}
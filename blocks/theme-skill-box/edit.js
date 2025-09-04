import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import Settings from './components/settings';
import './assets/edit.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { content, skillPercentage } = attributes;

	const blockProps = useBlockProps({
		className: "theme-skill-box-container",
	});

	const percentageLabelLeft = skillPercentage < 15 ? '-0.5rem' : '3rem'; 
	const percentageLabelColor = skillPercentage < 15 ? '' : 'text-white';

	return (
		<>
			<InspectorControls group="settings">
				<div className="p-4">
					<Settings attributes={attributes} setAttributes={setAttributes} />
				</div>
			</InspectorControls>

			<div { ...blockProps }>
				<RichText 
					tagName="p"	
					value={ content }
					onChange={ (value) => setAttributes({ content: value }) }
					placeholder={ __("Lorem ipsum", "theme-skill-box") }
				/>
				<div
					className="theme-skill-box bg-gray-100 p-2 overflow-hidden rounded border-2 border-gray-200 flex items-center gap-4 w-full h-[12px] relative" 
					data-max-width={`${ skillPercentage }%`} 
					style={{ '--max-width': `${ skillPercentage }%`, '--label-left': `${ percentageLabelLeft }`}}
				>
					<p className={`skill-percentage absolute z-40 text-[12px] ${percentageLabelColor}`} style={{ left: `calc(var(--max-width) - (${ percentageLabelLeft }))` }} data-max-width={`${ skillPercentage } %`}></p>
					<div className="progress-bar bg-green-500 w-full h-[32px] top-0 left-0 absolute" style={{ maxWidth: `var(--max-width)` }}></div>
				</div>
			</div>
		</>
	);
}

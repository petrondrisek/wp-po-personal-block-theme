import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import GeneralSettings from './components/GeneralSettings';
import FlexSettings from './components/FlexSettings';
import GridSettings from './components/GridSettings';
import FlexGridSettings from './components/FlexGridSettings';
import FlexGridStyles from './components/FlexGridStyles';
import useSettings from './hooks/useSettings';
import './assets/edit.scss';

export default function Edit( { attributes, setAttributes } ) {
	const classes = useSettings( attributes );

	const blockProps = useBlockProps({
		className: Object.values(classes).join(' ')
	});

	return (
		<>
			<InspectorControls group="settings">
				<div className="p-4">
					<GeneralSettings attributes={attributes} setAttributes={setAttributes} />

					{ attributes.display === 'flex' && (
						<FlexSettings attributes={ attributes } setAttributes={ setAttributes } /> 
					)}

					{ attributes.display === 'grid' && (
						<GridSettings attributes={ attributes } setAttributes={ setAttributes } /> 
					)}

					{ ["flex", "grid"].includes(attributes.display) && (
						<FlexGridSettings attributes={ attributes } setAttributes={ setAttributes } /> 
					)}
				</div>
			</InspectorControls>

			<InspectorControls group="styles">
				<div className="p-4">
					{ ["flex", "grid"].includes(attributes.display) && (
						<FlexGridStyles attributes={ attributes } setAttributes={ setAttributes } /> 
					)}
				</div>
			</InspectorControls>

			<div { ...blockProps }>
				<InnerBlocks 
					template={ [ 
						["core/paragraph", { placeholder: __( 'Type text or add blocks using /' ) } ] 
					] }
					templateLock={ false }
				/>
			</div>
		</>
	);
}

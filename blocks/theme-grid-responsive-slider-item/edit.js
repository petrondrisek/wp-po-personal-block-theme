import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { RichText } from '@wordpress/block-editor';
import Settings from './components/settings';
import Section from './components/section';

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps({
		className: 'bg-gray-100 border-2 border-gray-200 flex items-center gap-4',
	});

	return (
		<div { ...blockProps }>
			<Settings attributes={attributes} setAttributes={setAttributes} />
			
			<Section attributes={attributes}>
				<RichText
					tagName="p"
					value={attributes.content}
					onChange={(content) => setAttributes({ content })}
					placeholder={ __( 'Lorem ipsum...' ) }
				/>
			</Section>
		</div>
	);
}

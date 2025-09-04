import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import Settings from './components/settings';
import Styles from './components/styles';

export default function Edit( { attributes, setAttributes } ) {
	const { taxonomy } = attributes;

	const blockProps = useBlockProps({
		className: 'container'
	});

	return (
		<>
			<Settings attributes={attributes} setAttributes={setAttributes} />
			<Styles attributes={attributes} setAttributes={setAttributes} />
			
			<div { ...blockProps }>
				<p>
					{ __( 'Taxonomy filter will be displayed based on: ', 'theme-taxonomy-hierarchy' ) }
					{ taxonomy === 'none' ? __( 'current page', 'theme-taxonomy-hierarchy' ) : taxonomy }
				</p>
			</div>
		</>
	);
}

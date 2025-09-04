import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import Settings from './components/settings';
import Styles from './components/styles';

export default function Edit( { attributes, setAttributes, context } ) {
	const blockProps = useBlockProps({
		className: 'container'
	});
	const { field } = attributes;
	const { postType } = context;

	return (
		<>
			<Settings attributes={attributes} setAttributes={setAttributes} postType={postType} />
			<Styles attributes={attributes} setAttributes={setAttributes} />
			
			<section { ...blockProps }>
				<p>The field '{ field }' will be displayed</p>
			</section>
		</>
	);
}

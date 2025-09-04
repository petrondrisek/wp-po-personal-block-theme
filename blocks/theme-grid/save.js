import { useBlockProps } from '@wordpress/block-editor';
import { InnerBlocks } from '@wordpress/block-editor';
import useClassNames from './hooks/useClassNames';


export default function save({ attributes }) {
	const { content } = attributes;
	const { className } = useClassNames( attributes );

	const blockProps = useBlockProps.save({
		className
	});

	if( content === 'custom' ) {
		return (
			<div { ...blockProps }>
				<InnerBlocks.Content />
			</div>
		);
	}

	else {
		return <InnerBlocks.Content />;
	}
}
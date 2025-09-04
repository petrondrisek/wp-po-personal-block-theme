import { useBlockProps } from '@wordpress/block-editor';
import { InnerBlocks } from '@wordpress/block-editor';
import useSettings from './hooks/useSettings';


export default function save({ attributes }) {
    const classes = useSettings( attributes );
    
    const blockProps = useBlockProps.save({
        className: Object.values(classes).join(' ')   
    }); 

	return (
        <div 
            { ...blockProps }
        >
            <InnerBlocks.Content />
        </div>
	);
}
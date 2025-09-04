import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';

const Styles = memo(({ attributes, setAttributes }) => {

    //Tailwind progress: bg-red-500 bg-green-500 bg-blue-500 bg-yellow-500
    return (
        <InspectorControls group="styles">
            <div className="p-4">
                
            </div>
        </InspectorControls>
    )
},
(prevProps, nextProps) => {
    return true;
});

export default Styles;
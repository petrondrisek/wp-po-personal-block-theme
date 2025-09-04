import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';

const Styles = memo(({ attributes, setAttributes }) => {
    return (
        <InspectorControls group="styles">
            
        </InspectorControls>
    )
},
(prevProps, nextProps) => {
    return (true);
});

export default Styles;
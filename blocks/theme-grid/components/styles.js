import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import { RangeControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

const Styles = memo( ({ attributes, setAttributes }) => {
    const { gap } = attributes
    
    return (
        <InspectorControls group="styles">
            <div className="p-4">
                <fieldset>
                    <RangeControl
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                        label={__('Gap', 'theme-grid')}
                        value={gap}
                        min={0}
                        max={10}
                        step={1}
                        onChange={(value) => setAttributes({ gap: value })}
                    />
                </fieldset>
            </div>
        </InspectorControls>
    )
},
(prevProps, nextProps) => {
    return (
        prevProps.attributes.gap === nextProps.attributes.gap
    );
});

export default Styles;
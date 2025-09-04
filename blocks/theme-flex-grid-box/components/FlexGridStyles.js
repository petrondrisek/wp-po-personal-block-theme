import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import { RangeControl } from '@wordpress/components';

const FlexGridStyles = memo(({ attributes, setAttributes }) => {
    const { gap } = attributes;

    return (
        <>
            <fieldset>
                <RangeControl
                    __next40pxDefaultSize
                    __nextHasNoMarginBottom
                    label={__('Gap', 'theme-grid-item')}
                    value={gap}
                    min={0}
                    max={10}
                    step={1}
                    onChange={(value) => setAttributes({ gap: value })}
                />
            </fieldset>
        </>
    )
},
(prevProps, nextProps) => {
    return (
        prevProps.attributes.gap === nextProps.attributes.gap
    );
});

export default FlexGridStyles;
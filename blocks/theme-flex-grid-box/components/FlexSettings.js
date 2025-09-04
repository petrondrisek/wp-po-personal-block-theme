import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import { SelectControl, ToggleControl } from '@wordpress/components';

const FlexSettings = memo(({ attributes, setAttributes }) => {
    const { flexDirection, flexWrap } = attributes;

    return (
        <>
            <fieldset>
                <SelectControl
                    __next40pxDefaultSize
                    __nextHasNoMarginBottom
                    label={ __( 'Flex direction', 'theme-grid-item' ) }
                    value={ flexDirection }
                    options={ [
                        { value: 'row', label: 'Row' },
                        { value: 'row-reverse', label: 'Row reverse' },
                        { value: 'col', label: 'Column' },
                        { value: 'col-reverse', label: 'Column reverse' },
                    ] }
                    onChange={ (value) => setAttributes({ flexDirection: value }) }
                />
            </fieldset>
            <fieldset>
                <ToggleControl
                    __nextHasNoMarginBottom
                    label={ __( 'Flex wrap', 'theme-grid-item' ) }
                    checked={ flexWrap }
                    onChange={ (value) => setAttributes({ flexWrap: value }) }
                />
            </fieldset>
        </>
    )
},
(prevProps, nextProps) => {
    return (
        prevProps.attributes.flexDirection === nextProps.attributes.flexDirection &&
        prevProps.attributes.flexWrap === nextProps.attributes.flexWrap
    );
});

export default FlexSettings;
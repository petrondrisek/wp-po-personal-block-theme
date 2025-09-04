import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';


const FlexGridSettings = memo(({ attributes, setAttributes }) => {
    const { alignItems, justifyContent } = attributes;

    return (
        <>
            <fieldset>
                <SelectControl
                    __next40pxDefaultSize
                    __nextHasNoMarginBottom
                    label={ __( 'Align items', 'theme-grid-item' ) }
                    value={ alignItems }
                    options={ [
                        { value: 'center', label: 'Center' },
                        { value: 'start', label: 'Start' },
                        { value: 'end', label: 'End' },
                    ] }
                    onChange={ (value) => setAttributes({ alignItems: value }) }
                />
            </fieldset>
            <fieldset>
                <SelectControl
                    __next40pxDefaultSize
                    __nextHasNoMarginBottom
                    label={ __( 'Justify content', 'theme-grid-item' ) }
                    value={ justifyContent }
                    options={ [
                        { value: 'start', label: 'Start' },
                        { value: 'end', label: 'End' },
                        { value: 'center', label: 'Center' },
                        { value: 'between', label: 'Between' },
                        { value: 'around', label: 'Around' },
                    ] }
                    onChange={ (value) => setAttributes({ justifyContent: value }) }
                />
            </fieldset>
        </>
    );
},
(prevProps, nextProps) => {
    return (
        prevProps.attributes.alignItems === nextProps.attributes.alignItems &&
        prevProps.attributes.justifyContent === nextProps.attributes.justifyContent
    );
});

export default FlexGridSettings;
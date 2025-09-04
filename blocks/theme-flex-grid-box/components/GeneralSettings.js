import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';


const GeneralSettings = memo(({ attributes, setAttributes }) => {
    const { display } = attributes;

    return (    
        <fieldset>
            <SelectControl
                __next40pxDefaultSize
                __nextHasNoMarginBottom
                label={ __( 'Display', 'theme-grid-item' ) }
                value={ display }
                options={ [
                    { value: 'block', label: 'Block' },
                    { value: 'flex', label: 'Flex' },
                    { value: 'grid', label: 'Grid' },
                ] }
                onChange={ (value) => setAttributes({ display: value }) }
            />
        </fieldset>
    );
},
(prevProps, nextProps) => {
    return (
        prevProps.attributes.display === nextProps.attributes.display
    );
});

export default GeneralSettings;
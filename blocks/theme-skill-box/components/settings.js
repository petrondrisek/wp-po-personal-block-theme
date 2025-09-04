import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import { RangeControl } from '@wordpress/components';


const Settings = memo(({ attributes, setAttributes }) => {
    const { skillPercentage } = attributes;

    return (    
        <fieldset>
            <RangeControl
                __next40pxDefaultSize
                __nextHasNoMarginBottom
                label={ __( 'Skill percentage', 'theme-skill-box' ) }
                value={ skillPercentage }
                min={ 0 }
                max={ 100 }
                onChange={ (value) => setAttributes({ skillPercentage: value }) }
            />
        </fieldset>
    );
},
(prevProps, nextProps) => {
    return (
        prevProps.attributes.skillPercentage === nextProps.attributes.skillPercentage
    );
});

export default Settings;
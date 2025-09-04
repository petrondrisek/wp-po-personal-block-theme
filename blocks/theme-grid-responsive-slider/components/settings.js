import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

const Settings = memo(({ attributes, setAttributes }) => {
    const { boxes, sliderSince, tabletColumns, phoneColumns } = attributes

    const toggleDesktopSlider = (on) => {
        setAttributes(
            on !== 'none'
            ? { boxes: 1, tabletColumns: 1, phoneColumns: 1, sliderSince: on } 
            : { sliderSince: on });
    }

    return (            
        <InspectorControls group="settings">
            <div className="p-4">
                <fieldset>
                    <SelectControl
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                        label="Show slider since device width"
                        value={ sliderSince }
                        options={ [
                            { value: 'none', label: 'None' },
                            { value: 'desktop', label: 'Desktop' },
                            { value: 'tablet', label: 'Tablet' },
                            { value: 'phone', label: 'Phone' },
                        ]}
                        onChange={ toggleDesktopSlider }
                    />
                </fieldset>
                <fieldset>
                    <SelectControl
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                        label={ __( 'Columns per row on desktop', 'theme-highlight-section__boxes' ) }
                        value={ boxes }
                        disabled={ sliderSince === 'desktop' }
                        options={ [
                            { value: 1, label: 1 },
                            { value: 2, label: 2 },
                            { value: 3, label: 3 },
                            { value: 4, label: 4 },
                        ]}
                        onChange={ (value) => setAttributes({ boxes: value }) }
                    />
                </fieldset>
                <fieldset>
                    <SelectControl
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                        label={ __( 'Columns per row on tablets', 'theme-highlight-section__tabletColumns' ) }
                        disabled={ sliderSince === 'desktop' || sliderSince === 'tablet' }
                        value={ tabletColumns }
                        options={ [
                            { value: 1, label: 1 },
                            { value: 2, label: 2 },
                            { value: 3, label: 3 },
                            { value: 4, label: 4 },
                        ]}
                        onChange={ ( value ) => setAttributes( { tabletColumns: value } ) }
                    />
                </fieldset>
                <fieldset>
                    <SelectControl
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                        label={ __( 'Columns per row on phones', 'theme-highlight-section__phoneColumns' ) }
                        disabled={ sliderSince !== 'none' }
                        value={ phoneColumns }
                        options={ [
                            { value: 1, label: 1 },
                            { value: 2, label: 2 },
                            { value: 3, label: 3 },
                            { value: 4, label: 4 },
                        ]}
                        onChange={ ( value ) => setAttributes( { phoneColumns: value } ) }
                    />
                </fieldset>
            </div>
        </InspectorControls>
    );
},
(prevProps, nextProps) => {
    return (
        prevProps.attributes.boxes === nextProps.attributes.boxes &&
        prevProps.attributes.sliderSince === nextProps.attributes.sliderSince &&
        prevProps.attributes.tabletColumns === nextProps.attributes.tabletColumns &&
        prevProps.attributes.phoneColumns === nextProps.attributes.phoneColumns
    );
});

export default Settings;
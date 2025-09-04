import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

const Settings = memo(({ attributes, setAttributes, changeContent }) => {
    const { content, columns, columnsAtPhones, columnsAtTablets } = attributes;

    return (            
        <InspectorControls group="settings">
            <div className="p-4">
                <fieldset>
                    <SelectControl
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                        label={ __( 'Content type', 'theme-grid' ) }
                        value={ content }
                        options={ [
                            { value: 'custom', label: 'Custom blocks' },
                            { value: 'dynamic', label: 'Dynamic (post type)'}
                        ]}
                        onChange={ (value) => changeContent(value) }
                    />
                </fieldset>
                
                <fieldset>
                    <SelectControl
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                        label={ __( 'Columns', 'theme-highlight-section' ) }
                        value={ columns }
                        options={ [
                            { value: 1, label: 1 },
                            { value: 2, label: 2 },
                            { value: 3, label: 3 },
                            { value: 4, label: 4 },
                            { value: 6, label: 6 },
                            { value: 8, label: 8 },
                            { value: 10, label: 10 },
                            { value: 12, label: 12 },
                        ]}
                        onChange={ (value) => setAttributes({ columns: Number(value) }) }
                    />
                </fieldset>
                <fieldset>
                    <SelectControl
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                        label={ __( 'Columns at tablets (< 1024px)', 'theme-highlight-section' ) }
                        value={ columnsAtTablets }
                        options={ [
                            { value: 1, label: 1 },
                            { value: 2, label: 2 },
                            { value: 3, label: 3 },
                            { value: 4, label: 4 },
                            { value: 6, label: 6 },
                            { value: 8, label: 8 },
                            { value: 10, label: 10 },
                            { value: 12, label: 12 },
                        ]}
                        onChange={ (value) => setAttributes({ columnsAtTablets: Number(value) }) }
                    />
                </fieldset>

                <fieldset>
                    <SelectControl
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                        label={ __( 'Columns at phones (< 640px)', 'theme-highlight-section' ) }
                        value={ columnsAtPhones }
                        options={ [
                            { value: 1, label: 1 },
                            { value: 2, label: 2 },
                            { value: 3, label: 3 },
                            { value: 4, label: 4 },
                            { value: 6, label: 6 },
                            { value: 8, label: 8 },
                            { value: 10, label: 10 },
                            { value: 12, label: 12 },
                        ]}
                        onChange={ (value) => setAttributes({ columnsAtPhones: Number(value) }) }
                    />
                </fieldset>
            </div>
        </InspectorControls>
    );
},
(prevProps, nextProps) => {
    return (
        prevProps.attributes.content === nextProps.attributes.content &&
        prevProps.attributes.columns === nextProps.attributes.columns &&
        prevProps.attributes.columnsAtPhones === nextProps.attributes.columnsAtPhones &&
        prevProps.attributes.columnsAtTablets === nextProps.attributes.columnsAtTablets &&
        prevProps.changeContent === nextProps.changeContent
    );
});

export default Settings;
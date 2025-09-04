import { __ } from '@wordpress/i18n';
import { useState, useEffect, memo } from '@wordpress/element';
import { SelectControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';

const Settings = memo(({ attributes, setAttributes, postType }) => {
    const { field, objectFit, imageWidth, imageHeight } = attributes
    const [ fields, setFields ] = useState([]);
    const [ fieldsError, setFieldsError ] = useState('');

    useEffect(() => {
        apiFetch({ path: `/wp/v2/${postType}` } )
            .then((data) => {
                if(!data.length) {
                    setFieldsError('No posts has been added yet, add at least one post to get the fields.');
                    return;
                }

                // ACF fields
                const acfFields = data[0].acf;
                if(acfFields)
                    setFields((prev) => [...prev, ...Object.keys(acfFields).map(key => `acf—${key}`)]);
            })
            .catch(err => console.error(err));
    }, [postType]);

    return (            
        <InspectorControls group="settings">
            <div className="p-4">
                <fieldset>
                    { fieldsError && <p style={{ color: 'red' }}>ERROR: { fieldsError }</p> }
                    <SelectControl
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                        label={ __( 'Field to get gallery images', 'theme-post-image-slider' ) }
                        value={ field }
                        options={ [ 
                            {value: 'None', label: 'None' },
                            ...fields.map((field) => ({ value: field, label: field })) 
                        ] }
                        onChange={ (value) => setAttributes({ field: value }) }
                    />
                </fieldset>
                <fieldset>
                    <SelectControl
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                        label={ __( 'Object fit', 'theme-post-image-slider' ) }
                        value={ objectFit }
                        options={ [ 
                            {value: 'none', label: 'None' },
                            {value: 'cover', label: 'Cover' },
                            {value: 'contain', label: 'Contain' },
                            {value: 'fill', label: 'Fill' },
                            {value: 'scale-down', label: 'Scale down' } 
                        ] }
                        onChange={ (value) => setAttributes({ objectFit: value }) }
                    />
                </fieldset>
                <fieldset>
                    <NumberControl
                        __next40pxDefaultSize
                        label={ __( 'Image width', 'theme-post-image-slider' ) }
                        value={ Number(imageWidth) || 0 }
                        onChange={ (value) => setAttributes({ imageWidth: Number(value) || 0 }) }
                    />
                </fieldset>
                <fieldset>
                    <NumberControl
                        __next40pxDefaultSize
                        label={ __( 'Image height', 'theme-post-image-slider' ) }
                        value={ Number(imageHeight) || 0 }
                        onChange={ (value) => setAttributes({ imageHeight: Number(value) || 0 }) }
                    />
                </fieldset>
            </div>
        </InspectorControls>
    );
}, 
(prevProps, nextProps) => {
    return (
        prevProps.postType === nextProps.postType && 
        prevProps.attributes.field === nextProps.attributes.field &&
        prevProps.attributes.objectFit === nextProps.attributes.objectFit &&
        prevProps.attributes.imageWidth === nextProps.attributes.imageWidth &&
        prevProps.attributes.imageHeight === nextProps.attributes.imageHeight
    )
});

export default Settings;
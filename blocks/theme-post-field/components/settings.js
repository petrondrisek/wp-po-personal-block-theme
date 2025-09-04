import { __ } from '@wordpress/i18n';
import { useState, useEffect, memo } from '@wordpress/element';
import { SelectControl, TextControl, ToggleControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';

const Settings = memo(({ attributes, setAttributes, postType }) => {
    const { field, tag, title, openInNewTab, linkToPost, customLink, isArray, arraySeparator } = attributes
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
                        label={ __( 'Field to show', 'theme-post-field' ) }
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
                        label={ __( 'Use tag', 'theme-post-field' ) }
                        value={ tag }
                        options={ [ 
                            {value: 'p', label: 'p' },
                            {value: 'img', label: 'img' },
                            {value: 'video', label: 'video' },
                            {value: 'audio', label: 'audio' },
                            {value: 'a', label: 'a' },
                            {value: 'h1', label: 'h1' },
                            {value: 'h2', label: 'h2' },
                            {value: 'h3', label: 'h3' },
                            {value: 'h4', label: 'h4' },
                            {value: 'h5', label: 'h5' },
                            {value: 'h6', label: 'h6' },
                            {value: 'span', label: 'span' },
                            {value: 'div', label: 'div' },
                            {value: 'strong', label: 'strong' },
                            {value: 'em', label: 'em' }
                        ] }
                        onChange={ (value) => setAttributes({ tag: value }) }
                    />
                </fieldset>
                <fieldset>
                    <TextControl
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                        label={ __( 'Title', 'theme-post-field' ) }
                        value={ title }
                        disabled={ tag !== 'img' && tag !== 'a' }
                        onChange={ (value) => setAttributes({ title: value }) }
                    />
                </fieldset>
                <fieldset>
                    <ToggleControl
                        __nextHasNoMarginBottom
                        label={ __( 'Open in new tab', 'theme-post-field' ) }
                        checked={ openInNewTab }
                        onChange={ (value) => setAttributes({ openInNewTab: value }) }
                        disabled={ tag !== 'a' && !linkToPost }
                    />
                </fieldset>
                <fieldset>
                    <ToggleControl
                        __nextHasNoMarginBottom
                        label={ __( 'Add link to post', 'theme-post-field' ) }
                        checked={ linkToPost }
                        onChange={ (value) => setAttributes({ linkToPost: value }) }
                    />
                </fieldset>
                <fieldset>
                    <TextControl
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                        label={ __( 'Custom link (leave empty for post permalink)', 'theme-post-field' ) }
                        value={ customLink }
                        disabled={ !linkToPost }
                        onChange={ (value) => setAttributes({ customLink: value }) }
                    />
                </fieldset>
                <fieldset>
                    <ToggleControl
                        __nextHasNoMarginBottom
                        label={ __( 'Is array (should be text field)', 'theme-post-field' ) }
                        checked={ isArray }
                        onChange={ (value) => setAttributes({ isArray: value }) }
                    />
                </fieldset>
                <fieldset>
                    <TextControl
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                        label={ __( 'Array separator', 'theme-post-field' ) }
                        value={ arraySeparator }
                        disabled={ !isArray }
                        onChange={ (value) => setAttributes({ arraySeparator: value }) }
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
        prevProps.attributes.tag === nextProps.attributes.tag &&
        prevProps.attributes.title === nextProps.attributes.title &&
        prevProps.attributes.openInNewTab === nextProps.attributes.openInNewTab &&
        prevProps.attributes.linkToPost === nextProps.attributes.linkToPost &&
        prevProps.attributes.customLink === nextProps.attributes.customLink &&
        prevProps.attributes.isArray === nextProps.attributes.isArray &&
        prevProps.attributes.arraySeparator === nextProps.attributes.arraySeparator
    )
});

export default Settings;
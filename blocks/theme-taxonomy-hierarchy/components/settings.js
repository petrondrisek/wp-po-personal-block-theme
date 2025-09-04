import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';
import { SelectControl, TextControl, ToggleControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

const Settings = memo(({ attributes, setAttributes }) => {
    const { taxonomy, categoryTermId, mainUrl, mainTitle, showBreadcrumbs, showCount, showCategories } = attributes;

    const taxonomies = useSelect(( select ) => {
        const tax = select(coreDataStore).getTaxonomies();

        return tax?.filter((t) => t.hierarchical === true) || [];
    });

    const categories = useSelect(( select ) => {
        const cat = select(coreDataStore).getEntityRecords('taxonomy', taxonomy, { per_page: -1, hide_empty: false });
        
        return (cat || []).map((c) => ({ value: `${c.id}`, label: c.name }));
    });

    return (            
        <InspectorControls group="settings">
            <div className="p-4">
                <fieldset>
                    <SelectControl
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                        label={ __( 'Taxonomy', 'theme-taxonomy-filter' ) }
                        value={ taxonomy }
                        options={ [
                            {value: 'none', label: 'Leave it on current page'},
                            ...taxonomies.map((t) => ({ value: t.slug, label: t.name }))
                        ]}
                        onChange={ (value) => setAttributes({ taxonomy: value }) }
                    />
                </fieldset>
                <fieldset>
                    <SelectControl
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                        label={ __( 'Category', 'theme-taxonomy-filter' ) }
                        value={ categoryTermId }
                        options={ [
                            {value: '', label: 'None'},
                            ...categories
                        ]}
                        onChange={ (value) => setAttributes({ categoryTermId: value }) }
                        disabled={ taxonomy === 'none' }
                    />
                </fieldset>
                <fieldset>
                    <TextControl
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                        label={__('Main URL (optional)', 'theme-taxonomy-filter')}
                        value={mainUrl}
                        onChange={(value) => setAttributes({ mainUrl: value })}
                    />
                </fieldset>
                <fieldset>
                    <TextControl
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                        label={__('Main title (optional)', 'theme-taxonomy-filter')}
                        value={mainTitle}
                        onChange={(value) => setAttributes({ mainTitle: value })}
                    />
                </fieldset>
                <fieldset>
                    <ToggleControl
                        __nextHasNoMarginBottom
                        label={__('Show breadcrumbs', 'theme-taxonomy-filter')}
                        checked={showBreadcrumbs}
                        onChange={(value) => setAttributes({ showBreadcrumbs: value })}
                    />
                </fieldset>
                <fieldset>
                    <ToggleControl
                        __nextHasNoMarginBottom
                        label={__('Show categories', 'theme-taxonomy-filter')}
                        checked={showCategories}
                        onChange={(value) => setAttributes({ showCategories: value })}
                    />
                </fieldset>
                <fieldset>
                    <ToggleControl
                        __nextHasNoMarginBottom
                        label={__('Show count', 'theme-taxonomy-filter')}
                        checked={showCount}
                        disabled={!showCategories}
                        onChange={(value) => setAttributes({ showCount: value })}
                    />
                </fieldset>
            </div>
        </InspectorControls>
    );
},
(prevProps, nextProps) => {
    return (
        prevProps.attributes.taxonomy === nextProps.attributes.taxonomy &&
        prevProps.attributes.categoryTermId === nextProps.attributes.categoryTermId &&
        prevProps.attributes.mainUrl === nextProps.attributes.mainUrl &&
        prevProps.attributes.mainTitle === nextProps.attributes.mainTitle &&
        prevProps.attributes.showBreadcrumbs === nextProps.attributes.showBreadcrumbs &&
        prevProps.attributes.showCount === nextProps.attributes.showCount &&
        prevProps.attributes.showCategories === nextProps.attributes.showCategories
    );
});

export default Settings;
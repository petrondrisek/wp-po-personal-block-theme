import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';

const GridSettings = memo(({ attributes, setAttributes }) => {
    const { gridColumns } = attributes;

    return (
        <fieldset>
            <SelectControl
                __next40pxDefaultSize
                __nextHasNoMarginBottom
                label={ __( 'Grid columns', 'theme-grid-item' ) }
                value={ gridColumns }
                options={ [
                    { value: 1, label: 1 },
                    { value: 2, label: 2 },
                    { value: 3, label: 3 },
                ] }
                onChange={ (value) => setAttributes({ gridColumns: Number(value) }) }
            />
        </fieldset>
    );
},
(prevProps, nextProps) => {
    return (
        prevProps.attributes.gridColumns === nextProps.attributes.gridColumns
    );
});

export default GridSettings;
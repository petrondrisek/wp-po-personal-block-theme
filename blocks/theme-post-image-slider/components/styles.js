import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import { ToggleControl, SelectControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

const Styles = memo(({ attributes, setAttributes }) => {
    const { progressShow, progressColor, dotsShow, arrowsShow, autoPlay, swipeAllow } = attributes;

    //Tailwind progress: bg-red-500 bg-green-500 bg-blue-500 bg-yellow-500
    return (
        <InspectorControls group="styles">
            <div className="p-4">
                <fieldset>
                    <ToggleControl
                        __nextHasNoMarginBottom
                        label={__('Show progress bar', 'theme-grid-responsive-slider')}
                        checked={progressShow}
                        onChange={(value) => setAttributes({ progressShow: value })}
                    />
                </fieldset>
                <fieldset>
                    <SelectControl
                        __nextHasNoMarginBottom
                        __next40pxDefaultSize
                        label={__('Progress bar color', 'theme-grid-responsive-slider')}
                        value={progressColor}
                        disabled={!progressShow}
                        options={[
                            { value: 'red', label: 'Red' },
                            { value: 'green', label: 'Green' },
                            { value: 'blue', label: 'Blue' },
                            { value: 'yellow', label: 'Yellow' },
                        ]}
                        onChange={(value) => setAttributes({ progressColor: value })}
                    />
                </fieldset>
                <fieldset>
                    <ToggleControl
                        __nextHasNoMarginBottom
                        label={__('Show dots', 'theme-grid-responsive-slider')}
                        checked={dotsShow}
                        onChange={(value) => setAttributes({ dotsShow: value })}
                    />
                </fieldset>
                <fieldset>
                    <ToggleControl
                        __nextHasNoMarginBottom
                        label={__('Show arrows', 'theme-grid-responsive-slider')}
                        checked={arrowsShow}
                        onChange={(value) => setAttributes({ arrowsShow: value })}
                    />
                </fieldset>
                <fieldset>
                    <ToggleControl
                        __nextHasNoMarginBottom
                        label={__('Auto play', 'theme-grid-responsive-slider')}
                        checked={autoPlay}
                        onChange={(value) => setAttributes({ autoPlay: value })}
                    />
                </fieldset>
                <fieldset>
                    <ToggleControl
                        __nextHasNoMarginBottom
                        label={__('Swipe allow', 'theme-grid-responsive-slider')}
                        checked={swipeAllow}
                        onChange={(value) => setAttributes({ swipeAllow: value })}
                    />
                </fieldset>
            </div>
        </InspectorControls>
    )
},
(prevProps, nextProps) => {
    return (
        prevProps.attributes.progressShow === nextProps.attributes.progressShow &&
        prevProps.attributes.progressColor === nextProps.attributes.progressColor &&
        prevProps.attributes.dotsShow === nextProps.attributes.dotsShow &&
        prevProps.attributes.arrowsShow === nextProps.attributes.arrowsShow &&
        prevProps.attributes.autoPlay === nextProps.attributes.autoPlay &&
        prevProps.attributes.swipeAllow === nextProps.attributes.swipeAllow
    );
});

export default Styles;
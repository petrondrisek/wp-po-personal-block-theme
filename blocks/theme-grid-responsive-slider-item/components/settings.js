import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { InspectorControls, MediaUpload } from '@wordpress/block-editor';

const Settings = memo(({ attributes, setAttributes }) => {
    const { iconUrl } = attributes;

    return (            
        <InspectorControls group="settings">
            <div className="p-4">
                <fieldset>
                    <legend>
                        { __('Ikonka', 'theme-highlight-section__icon') }
                    </legend>
                    
                    <MediaUpload
                    onSelect={media => {
                        setAttributes({ iconUrl: media.url });
                    }}
                    allowedTypes={['image', 'image/svg+xml']}
                    value={iconUrl}
                    render={({ open }) => (
                        <Button 
                            onClick={open} 
                            variant="secondary" 
                            style={{ height: '60px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            { iconUrl ? <img src={iconUrl} alt="Ikona" style={{ width: 40 }} /> : 'Vybrat ikonu' }
                        </Button>
                    )}
                    />

                    { iconUrl && (
                        <Button onClick={() => setAttributes({ iconUrl: '' })} variant="link" isDestructive>
                            Odstranit ikonu
                        </Button> 
                    )}
                </fieldset>
            </div>
        </InspectorControls>
    );
},
(prevProps, nextProps) => {
    return (
        prevProps.attributes.iconUrl === nextProps.attributes.iconUrl
    );
});

export default Settings;
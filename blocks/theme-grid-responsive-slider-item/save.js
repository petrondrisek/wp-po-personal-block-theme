import { useBlockProps, RichText } from '@wordpress/block-editor';
import Section from './components/section';

export default function Save({ attributes }) {
    const blockProps = useBlockProps.save({
        className: `bg-gray-100 border-2 border-gray-200 flex items-center gap-4`,
    });

    return (
        <div {...blockProps}>
            <Section 
                blockProps={blockProps} 
                attributes={attributes}   
            >
                <RichText.Content
                    tagName="p"
                    value={attributes.content}
                ></RichText.Content>
            </Section>
        </div>
    );
}
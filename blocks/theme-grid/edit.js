import { __ } from '@wordpress/i18n';
import { useMemo, useCallback, useEffect } from '@wordpress/element';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import Settings from './components/settings';
import Styles from './components/styles';
import useClassNames from './hooks/useClassNames';
import './assets/edit.scss';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { content } = attributes;

	const classNamesAttrsMemo = useMemo(() => { 
		return { 
			columns: attributes.columns, 
			columnsAtTablets: attributes.columnsAtTablets,
			columnsAtPhones: attributes.columnsAtPhones,
			gap: attributes.gap
		} 
	}, [ attributes.columns, attributes.columnsAtTablets, attributes.columnsAtPhones, attributes.gap ]);
	const { className } = useClassNames( classNamesAttrsMemo );

	const blockProps = useBlockProps({
		className
	});

	const postTemplate = useSelect( ( select ) => {
		const block = select( 'core/block-editor' ).getBlock( clientId );
		const query = block?.innerBlocks?.find( (b) => b.name === 'core/query' );
		const postTemplate = query?.innerBlocks?.find( (b) => b.name === 'core/post-template' );

		return postTemplate || null;
	}, [ clientId ] );

	const { replaceInnerBlocks, updateBlockAttributes } = useDispatch( 'core/block-editor' );

	const changeContent = useCallback((value) => {
		setAttributes({
			content: value
		});

		replaceInnerBlocks(clientId, []);
	});

	useEffect(() => {
		if(content !== 'custom') {
			if(postTemplate) {
				updateBlockAttributes( postTemplate.clientId, { className } );
			}
		}
	}, [ className ]);
	
	return (
		<>
			<Settings attributes={ attributes } setAttributes={ setAttributes } changeContent={ changeContent } />
			<Styles attributes={ attributes } setAttributes={ setAttributes } />

			{content === 'custom' && (
			<div { ...blockProps }>
				<InnerBlocks 
				template = { [ ...Array.from({ length: attributes.columns }, (_) => [ 
									'po-personal/theme-flex-grid-box', 
									{}, 
									[ [ 'core/paragraph', { placeholder: __( 'Type text or add blocks using /' ) } ] ] 
								])] } 
				templateLock={ false }
				/>
			</div>)}

			{content !== 'custom' && (
				<InnerBlocks
				allowedBlocks={ ['core/query'] }
				template={ [
					[ 'core/query', {}, [ 
						[ 'core/post-template', { className }, [] ],
						[ 'core/query-pagination', {}, [
							[ 'core/query-pagination-previous', {}, [] ],
							[ 'core/query-pagination-numbers', {}, [] ],
							[ 'core/query-pagination-next', {}, [] ],
						] ],
						[ 'core/query-no-results', {}, [] ] 
						]	
					],
				]}
				/>
			)}
		</>
	);
}

import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import Settings from './components/settings';
import Styles from './components/styles';
import './assets/edit.scss';

export default function Edit( { attributes, setAttributes } ) {
	// Tailwind: grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4
	const blockProps = useBlockProps({
		className: `relative z-40 container theme-highlight-section`,
		'data-dots': attributes.dotsShow,
		'data-arrows': attributes.arrowsShow,
		'data-autoplay': attributes.autoPlay,
		'data-swipe': attributes.swipeAllow,
	});

	const { progressShow, progressColor } = attributes;
	const progressClass = `bg-${progressColor}-500`;

	return (
		<div { ...blockProps } style={{ paddingBottom: '0' }}>
			<Settings attributes={attributes} setAttributes={setAttributes} />
			<Styles attributes={attributes} setAttributes={setAttributes} />
			
			<div className={`grid-cols-${attributes.boxes} edit-theme-highlight-section`}>
				<InnerBlocks
					allowedBlocks={ [ 'po-personal/theme-grid-responsive-slider-item' ] }
					templateLock={ false }
					renderAppender={InnerBlocks.ButtonBlockAppender}
				/>
			</div>

			{ progressShow && (
				<div className={`progress transition ease-in-out duration-300 absolute z-40 bottom-0 left-0 right-0 h-[8px] ${progressClass} w-0 lg:hidden`}></div>
			) }
		</div>
	);
}

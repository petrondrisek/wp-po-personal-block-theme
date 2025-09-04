<?php

add_filter('render_block', 'replace_navigation_close_svg', 10, 2);

function replace_navigation_close_svg($block_content, $block) {
    if ($block['blockName'] !== 'core/navigation') {
        return $block_content;
    }

    $new_svg = '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="7.5" width="16" height="1.5"></rect><rect x="4" y="15" width="16" height="1.5"></rect></svg>';

    $pattern = '#(<button[^>]*?class="[^"]*wp-block-navigation__responsive-container-close[^"]*"[^>]*>).*?<svg.*?</svg>(</button>)#s';
    $replacement = '$1' . $new_svg . '$2';

    return preg_replace($pattern, $replacement, $block_content);
}
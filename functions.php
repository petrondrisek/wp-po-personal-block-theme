<?php
if (!defined('ABSPATH')) {
    exit;
}

define('THEME_NAME', 'po-personal');
if(!defined('WEB_URI')) define('WEB_URI', get_site_url());
if(!defined('CONTENT_PATH')) define('CONTENT_PATH', ABSPATH);

require_once __DIR__ . '/inc/BlockManager_class.php';
require_once __DIR__ . '/inc/ScriptManager_class.php';
require_once __DIR__ . '/inc/StyleManager_class.php';
require_once __DIR__ . '/inc/PatternManager_class.php';
include_once __DIR__ . '/inc/Navigation/navigation_render.php';

// register styles
$styleManager = new StyleManager('/wp-content/themes/po-personal/');
$styleManager->register_style('tailwind', 'build/styles/tailwind.css', [], false, "all", false);
$styleManager->register_style('tailwind-admin', 'build/styles/tailwind.css', [], false, "all", true);
$styleManager->register_style('flickity', 'assets/css/flickity.min.css', [], false, "all", false);
$styleManager->register_style('theme-css', 'assets/css/theme.css', ['tailwind'], false, "all", false);
$styleManager->register_style('theme-css-admin', 'assets/css/theme.css', ['tailwind-admin'], false, "all", true);

add_action('wp_enqueue_scripts', [$styleManager, 'init_styles']);
add_action('enqueue_block_editor_assets', [$styleManager, 'init_admin_styles']);

// register scripts
$scriptManager = new ScriptManager('/wp-content/themes/po-personal/');
$scriptManager->register_script('theme-js', 'assets/js/theme.js', [], false, [], false);
$scriptManager->register_script('flickity-js', 'assets/js/flickity.pkgd.min.js', [], false, [], false);
$scriptManager->register_script('slider', 'assets/js/slider.js', ['flickity-js'], false, [], false);

add_action('wp_enqueue_scripts', [$scriptManager, 'init_scripts']);
add_action('enqueue_block_editor_assets', [$scriptManager, 'init_admin_scripts']);

// register blocks
$blockManager = new BlockManager();

$blockManager->register_static_block(__DIR__ . '/build/theme-flex-grid-box', true);
$blockManager->register_static_block(__DIR__ . '/build/theme-grid', true);
$blockManager->register_static_block(__DIR__ . '/build/theme-grid-responsive-slider', true);
$blockManager->register_static_block(__DIR__ . '/build/theme-grid-responsive-slider-item', true);
$blockManager->register_static_block(__DIR__ . '/build/theme-skill-box', true);

$blockManager->register_dynamic_block(__DIR__ . '/build/theme-post-image-slider', 'render_post_image_slider');
$blockManager->register_dynamic_block(__DIR__ . '/build/theme-taxonomy-hierarchy', 'render_taxonomy_hierarchy');
$blockManager->register_dynamic_block(__DIR__ . '/build/theme-post-field', 'render_post_field');

add_action('init', [$blockManager, 'init_blocks']);

// Register pattern
$patternManager = new PatternManager(THEME_NAME);

$patternManager->register_pattern_category("po-personal_theme", "Po-personal theme", "A collection of theme patterns.");

$patternManager->register_pattern(
    "po-personal/header-default", 
    "Header - default", 
    ["po-personal_theme", "header"], 
    "theme", 
    [ContentType::FILE, __DIR__ . '/patterns/header-default.html']
);

$patternManager->register_pattern(
    "po-personal/footer-default", 
    "Footer - default", 
    ["po-personal_theme", "footer"], 
    "theme", 
    [ContentType::FILE, __DIR__ . '/patterns/footer-default.html']
);

$patternManager->register_pattern(
    "po-personal/project-categories",
    "Project categories",
    ["po-personal_theme", "project-categories"],
    "theme",
    [ContentType::FILE, __DIR__ . '/patterns/project-categories.html']
);

$patternManager->register_pattern(
    "po-personal/highlight-hero-section",
    "Highlight hero section",
    ["po-personal_theme", "highlight-hero-section"],
    "theme",
    [ContentType::FILE, __DIR__ . '/patterns/highlight-hero-section.html']
);

add_action('init', [$patternManager, 'init']);

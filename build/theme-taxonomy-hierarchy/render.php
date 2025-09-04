<?php
if (!defined('ABSPATH')) {
	exit;
}

function theme_taxonomy_hierarchy_svg_arrow_down(): string {
	return <<<SVG
		<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 30.727 30.727" width="16px" height="16px">
			<path d="M29.994,10.183L15.363,24.812L0.733,10.184c-0.977-0.978-0.977-2.561,0-3.536
			c0.977-0.977,2.559-0.976,3.536,0l11.095,11.093L26.461,6.647c0.977-0.976,2.559-0.976,3.535,0
			C30.971,7.624,30.971,9.206,29.994,10.183z"/>
		</svg>
	SVG;
}

function theme_taxonomy_hierarchy_get_taxonomy_hierarchy(string $taxonomy): array {
	$terms = get_terms( [
		'taxonomy' => $taxonomy,
		'hide_empty' => false
	]);

	$tree = [];

	foreach ($terms as $term) {
		$parent = $term->parent;
		if (!isset($tree[$parent])) {
			$tree[$parent] = [];
		}
		$tree[$parent][] = $term;
	}

	return $tree;
}

function theme_taxonomy_hierarchy_get_breadcrumb(array $tree, string $termId): array {
    $crumb = [];
    while ($termId && isset($tree)) {
        $found = null;
        foreach ($tree as $terms) {
            foreach ($terms as $term) {
                if ($term->term_id == $termId) {
                    $found = $term;
                    break 2;
                }
            }
        }
        if (!$found) break;
        $crumb[] = $found;
        $termId = $found->parent;
        if ($termId == 0) break;
    }
    return array_reverse($crumb);
}

function theme_taxonomy_hierarchy_build_breadcrumb(
	array $tree, 
	string $termId, 
	WP_Post|null $post, 
	string $mainUrl, 
	string $mainTitle
): void {
	$breadcrumb = theme_taxonomy_hierarchy_get_breadcrumb($tree, $termId);

	echo "<div class='taxonomy-hierarchy-breadcrumb my-4 text-gray-600'> › ";

	if(!empty($mainUrl) && !empty($mainTitle)){
		echo '<a href="' . esc_url($mainUrl) . '">' . esc_html($mainTitle) . '</a> ' . (count($breadcrumb) ? '› ' : '');
	}

	foreach ($breadcrumb as $k => $t) {
		echo '<a href="' . esc_url(get_term_link($t)) . '">' . esc_html($t->name) . '</a> ';
		if(array_key_last($breadcrumb) !== $k) echo '› ';
	}

	if($post !== null){
		echo '› <a href="' . esc_url(get_permalink($post->ID)) . '">' . esc_html($post->post_title) . '</a>';
	}

	echo "</div>";
}

function theme_taxonomy_hierarchy_build_hierarchy(
	array $tree,
	int $parentId,
	string $currentSlug,
	bool $showCount,
	string $staticContent = "",
	int $level = 0
){
	$className = $level == 0 ? "flex gap-2 flex-wrap null-level" : "nested hidden";
	$content = "<ul data-level=\"$level\" data-parent-id=\"$parentId\" class=\"$className\" style=\"--level: $level\">";

	if($level == 0 && !empty($staticContent)) 
		$content .= $staticContent;
	
	foreach($tree[$parentId] as $term){
		$link = get_term_link($term);
		$title = esc_html($term->name);
		$active = $term->slug === $currentSlug ? 'active-slug' : '';
		$hasChild = isset($tree[$term->term_id]);
		$childContent = $hasChild ? theme_taxonomy_hierarchy_build_hierarchy($tree, $term->term_id, $currentSlug, $showCount, "", $level + 1) : ""; 
		$activeChild = strpos($childContent, 'active-slug') !== false ? 'active-child-slug' : '';
		$isFirstLevelClass = $level == 0 ? 'first-level' : '';
		$hasChildClass = $hasChild ? 'has-child' : '';
		$showCountContent = $showCount ? "<span class=\"taxonomy-hierarchy-count\">({$term->count})</span>" : "";

		$content .= "<li class=\"flex flex-col $isFirstLevelClass $hasChildClass\">";
		$content .= "<div class=\"flex justify-between align-center gap-4\">";
		$content .= "<a href=\"$link\" class='taxonomy-hierarchy-link $active $activeChild'>$title $showCountContent</a>";

		if($hasChild) 
		{
			$content .= "<div class=\"taxonomy-hierarchy-toggle-submenu child-trigger cursor-pointer\">".theme_taxonomy_hierarchy_svg_arrow_down()."</div></div>";
			$content .= $childContent;
		} 
		else $content .= "</div>";

		$content .= "</li>";
	}
	$content .= "</ul>";

	return $content;
}


function render_taxonomy_hierarchy($attributes, $block, $context): string {
	$blockProps = get_block_wrapper_attributes([
		'class' => 'taxonomy-hierarchy',
	]);
	$page_id = get_the_ID();

	// archive
	$taxonomy = get_queried_object()->taxonomy ?? null;
	if ($taxonomy !== null){
		$post_type = $taxonomy ? get_taxonomy( $taxonomy )->object_type[0] : null;
		$termId = get_queried_object()->term_id ?? "";
		$post = null;
	}

	// single
	if($taxonomy === null){
		$post = get_queried_object();
		$post_type = $post->post_type ?? null;

		if($post_type !== null){
			$taxonomy = get_object_taxonomies( $post_type, 'names' )[0] ?? null;
			$termId = $taxonomy ? get_the_terms($post->ID, $taxonomy)[0]->term_id ?? "" : "";
		}
	}

	// otherwise check if manually set
	if($taxonomy === null && $attributes['taxonomy'] !== 'none')
	{
		$taxonomy = $attributes['taxonomy'];
		$post_type = get_taxonomy( $taxonomy )->object_type[0];	
		$termId = $attributes['categoryTermId'] ?? "";
		$post = null;
	}

	if($taxonomy === null)
		return "Empty taxonomies for post type: `$post_type`";

	$slug = get_queried_object()->slug ?? "";
	$hierarchy = theme_taxonomy_hierarchy_get_taxonomy_hierarchy($taxonomy);

	$staticContent = "";
	if(!empty($attributes['mainUrl']) && !empty($attributes['mainTitle']))
		$staticContent = "<li class=\"flex flex-col\"><div><a href=\"".$attributes['mainUrl']."\" ".($slug === "" ? "class=\"active\"" : "").">".$attributes['mainTitle']."</a></div></li>";

	ob_start();
	?>
		<div <?=$blockProps?>>
			<?php if($attributes["showBreadcrumbs"]){
				theme_taxonomy_hierarchy_build_breadcrumb($hierarchy, $termId, $post, $attributes['mainUrl'], $attributes['mainTitle']);
			}?>

			<?php if($attributes["showCategories"]):?>
				<?= theme_taxonomy_hierarchy_build_hierarchy($hierarchy, 0, $slug, $attributes["showCount"], $staticContent); ?>
				<span class="text-gray-600 hover:text-gray-800 block lg:hidden mt-2 expand-null-level p-2 text-center cursor-pointer">Tap to expand / collapse</span>
			<?php endif; ?>
		</div>
	<?php
	$content = ob_get_clean();
	return $content;
}
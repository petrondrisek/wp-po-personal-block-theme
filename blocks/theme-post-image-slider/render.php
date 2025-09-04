<?php
/**
 * Get fields of ACF plugin `ACF Galerie 4`
 * 
 * @param array $post_fields - WP function get_fields(post_id)
 * @param string $selected_field - ACF field name that has array of media ID's
 * 
 * @return array - Array of image URLs
 */
function acf_field_type_service(array $post_fields, string $selected_field): array {
    $images = [];

    if(str_starts_with($selected_field, "acf—"))
    {
        $field_name = str_replace("acf—", "", $selected_field);

        if(!array_key_exists($field_name, $post_fields)) {
            return [];
        }

        if(isset($post_fields[$field_name]) && is_array($post_fields[$field_name])) {
            $images = array_map(
                function ($image) { 
                    return $image["metadata"]["full"]["file_url"]; 
                }, 
                $post_fields[$field_name]
            );
        }
    }

    return $images;
}

/**
 * Gets images based on selected field name.
 * 
 * @param string $selected_field - Name of the field to be retrieved from get_fields(post_id).
 * 
 * @return array - Array of image URLs
 */
function get_images(string $selected_field): array {
    $post_id = get_the_ID();
    $post_fields = get_fields($post_id);

    $images = [];
    
    // Selected field is ACF field
    $acf = acf_field_type_service($post_fields, $selected_field);
    $images = array_merge($images, $acf);

    return $images;
}

/**
 * Render block method
 * 
 * @param array $attributes - Block attributes
 * @param object $block - Block object
 * @param object $context - Block context
 * 
 * @return string - Content
 */
function render_post_image_slider($attributes, $block, $context): string
{
    // Atributes
    $selected_field = $attributes["field"] ?? null;
    $progressShow = $attributes["progressShow"] ?? null;
    $progressColor = $attributes["progressColor"] ?? null;
    $dotsShow = $attributes["dotsShow"] ?? null;
    $arrowsShow = $attributes["arrowsShow"] ?? null;
    $autoplay = $attributes["autoplay"] ?? null;
    $swipeAllow = $attributes["swipeAllow"] ?? null;
    $objectFit = $attributes["objectFit"] ?? null;
    $imageWidth = $attributes["imageWidth"] ?? null;
    $imageHeight = $attributes["imageHeight"] ?? null;

    if(!$selected_field) return "<p>The field has not been selected.</p>";

    $images = get_images($selected_field);
    if(empty($images)) $images = [WEB_URI . "/wp-content/themes/po-personal/assets/images/cover.jpg"];

    $blockProps = get_block_wrapper_attributes([
        "class" => "post-image-slider relative"
    ]);

    ob_start();
    ?>
        <div 
            <?=$blockProps?>
            data-arrows="<?=$arrowsShow ? "true" : "false"?>"
            data-dots="<?=$dotsShow ? "true" : "false"?>"
            data-swipe="<?=$swipeAllow ? "true" : "false"?>" 
            data-autoplay="<?=$autoplay ? "true" : "false"?>"
        >
            <div class="post-image-slider flickity slider-desktop">
                <?php foreach($images as $image): ?> 
                    <div class="item flex items-center justify-center">
                        <?=$objectFit != "none" && $objectFit != null ? "<div style=\"width: ".$imageWidth."px; height: ".$imageHeight."px;\">" : ""?> 
                            <img 
                                src="<?= $image ?>" 
                                alt="Image" 
                                <?=($objectFit == "none" || $objectFit == null) && $imageWidth > 0 ? "width=\"".$imageWidth."\"" : ""?> 
                                <?=($objectFit == "none" || $objectFit == null) && $imageHeight > 0 ? "height=\"".$imageHeight."\"" : ""?>
                                style="pointer-events: none; user-select: none;<?=($objectFit != "none" && $objectFit != null) ? "object-fit: ".$objectFit.";width:100%;height:100%;" : ""?>"
                            />
                        <?=$objectFit != "none" || $objectFit == null ? "</div>" : ""?>
                    </div> 
                <?php endforeach ?>
            </div>
            <div 
                class="progress transition ease-in-out duration-300 absolute z-40 bottom-0 left-0 right-0 h-[4px] <?= $progressColor ? "bg-$progressColor-500" : "bg-white" ?> <?= $progressShow ? "" : "hidden" ?> w-0"
                style="max-width: 100%"
                >
            </div>
        </div>
    <?php
    $content = ob_get_clean();
    return $content;
}
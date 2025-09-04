<?php
/**
 * Get fields of ACF plugin
 * 
 * @param array $post_fields - WP function get_fields(post_id)
 * @param string $selected_field - ACF field name
 * 
 * @return array - Content of the field
 */
function theme_post_field_acf_field_type_service(array $post_fields, string $selected_field): string {
    $content = "";

    if(str_starts_with($selected_field, "acf—"))
    {
        $field_name = str_replace("acf—", "", $selected_field);

        if(!array_key_exists($field_name, $post_fields)) {
            return "";
        }

        if(is_array($post_fields[$field_name])) {
            $content = json_encode($post_fields[$field_name]);
        }
        else $content = $post_fields[$field_name];
        
    }

    return $content;
}

/**
 * Gets images based on selected field name.
 * 
 * @param string $selected_field - Name of the field to be retrieved from get_fields(post_id).
 * 
 * @return array - Content of the field
 */
function theme_post_field_get_content(string $selected_field): string {
    $post_id = get_the_ID();
    $post_fields = get_fields($post_id);
    
    // Selected field is ACF field
    $content = theme_post_field_acf_field_type_service($post_fields, $selected_field);

    return $content;
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
function render_post_field($attributes, $block, $context): string
{
    // Atributes
    $selected_field = $attributes["field"] ?? null;
    $tag = $attributes["tag"] ?? null;
    $title = $attributes["title"] ?? "";
    $addLink = $attributes["linkToPost"] ?? false;
    $customLink = $attributes["customLink"] ?? "";
    $newTab = $attributes["openInNewTab"] ? "target='_blank'" : "";
    $isArray = $attributes["isArray"] ?? false;
    $arraySeparator = $attributes["arraySeparator"] ?? "";

    if(!$selected_field) return "<p>The field has not been selected.</p>";

    $getContent = theme_post_field_get_content($selected_field);
    if(empty($getContent) || $getContent === null) return "";

    if($isArray && !empty($arraySeparator)) $getContent = explode($arraySeparator, $getContent);
    else $getContent = [$getContent];

    $blockProps = get_block_wrapper_attributes([
        "class" => "post-field relative post-field-" . $selected_field
    ]);
    $fullContent = "";

    foreach($getContent as $content){
        $fullContent .= $addLink ? "<a $blockProps href='".($customLink ? $customLink : get_the_permalink())."' $newTab>" : "";
        switch($tag){
            case "img":
                $fullContent .= "<img $blockProps src='$content' alt='". (empty($title) ? $selected_field : $title) ."' />";
                break;
            case "video":
                $fullContent .= "<video $blockProps src='$content' controls></video>";
                break;
            case "audio":
                $fullContent .= "<audio $blockProps src='$content' controls></audio>";
                break;
            case "a":
                $fullContent .= "<a $blockProps href='$content' $newTab>". (empty($title) ? $content : $title) ."</a>";
                break;
            default:
                $fullContent .= "<$tag $blockProps>$content</$tag>";
                break;
        }
        $fullContent .= $addLink ? "</a>" : "";
    }

    return $fullContent;
}
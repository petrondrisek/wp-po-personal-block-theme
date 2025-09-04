<?php

if(!class_exists('PatternManager')):
enum ContentType {
    case HTML;
    case FILE;
}

class PatternManager {
    private $name;

    public function __construct($themeOrPluginName) {
        $this->name = $themeOrPluginName;
    }

    private array $categories = [];
    private array $patterns = [];

    /**
     * Add a pattern category
     * 
     * When all patterns are added, call PatternsManager::init_pattern_categories()
     * 
     * @param string $name
     * @param string $label
     * @param string $description
     * 
     * @return void
     * 
     * @throws \Exception When any of the following is empty: name, label, description.
     * @throws \Exception When pattern category already exists.
     */
    public function register_pattern_category($name, $label, $description) : void {
        if(empty($name) || empty($label) || empty($description)) {
            throw new \Exception("Any of the following cannot be empty: name, label, description.");
        }

        if(isset($this->categories[$name])) {
            throw new \Exception("Pattern category `$name` already exists.");
        }

        $this->categories[$name] = [
            'label' => __( $label, $this->name ),
            'description' => __( $description, $this->name ),
        ];
    }

    /**
     * Add a pattern
     * 
     * When all patterns are added, call PatternsManager::init_patterns()
     * 
     * @param string $name
     * @param string $title
     * @param array $category
     * @param string $source
     * @param ContentType $content_type
     * @param string $content
     * 
     * @return void
     * 
     * @throws \Exception When any of the following is empty: name, title, category, source, content.
     * @throws \Exception When pattern already exists.
     */
    public function register_pattern(
        string $name, 
        string $title, 
        array $category, 
        string $source, 
        array $content
     ) : void {
        if(empty($name) || empty($title) || empty($category) || empty($source) || !count($content)) {
            throw new \Exception("Any of the following cannot be empty: name, title, category, source, content.");
        }

        if(isset($this->patterns[$name])) {
            throw new \Exception("Pattern `$name` already exists.");
        }

        // Content
        if (count($content) === 2 && $content[0] instanceof ContentType) {
            $content_type = $content[0];
            $content = $content[1];
        } else {
            $content_type = ContentType::HTML;
            $content = $content[0] ?? '';
        }
        
        switch($content_type) {
            case ContentType::HTML:
                $content = wp_kses_post($content);
                break;
            case ContentType::FILE:
                if (!file_exists($content)) 
                    throw new \Exception("File `$content` for pattern `$name` does not exist.");

                $content = wp_kses_post( file_get_contents($content) );
                break;
        }
        
        $this->patterns[$name] = [
            'title'      => __( $title, $this->name ),
            'categories' => $category,
            'source'     => $source,
            'content'    => $content,
        ];
    }

    /** 
     * Initialize pattern categories and patterns
     * 
     * @return void
     */
    public function init() : void {
        foreach($this->categories as $name => $args) {
            register_block_pattern_category($name, $args);
        }

        foreach($this->patterns as $name => $args) {
            register_block_pattern($name, $args);
        }
    }
}
endif;
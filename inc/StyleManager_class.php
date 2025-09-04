<?php

if(!class_exists('StyleManager')):
class StyleManager {
    private $webUri = WEB_URI;
    private $contentPath = CONTENT_PATH;
    
    public function __construct($pathToTemplateOrPlugin) {
        $this->webUri = WEB_URI . $pathToTemplateOrPlugin;
        $this->contentPath = CONTENT_PATH . $pathToTemplateOrPlugin;
    }

    private array $styles_to_register = [];

    /**
     * Register a style.
     * 
     * After adding all styles, call `StyleManager::init_styles()`.
     * or `StyleManager::init_admin_styles()` to load styles in admin panel.
     * 
     * @param string $name Unique name of the style
     * @param string $path_to_file Path to style file
     * @param array $dependencies Array of dependencies (already registered styles)
     * @param string|null $version Version of the style
     * @param string $media Media of the style (e.g. "all", "screen", "print" or media query)
     * @param bool $admin Whether to load in admin
     * 
     * @return void
     * 
     * @throws \Exception When validation of sent style fails.
     */
    public function register_style(
        string $name, 
        string $path_to_file, 
        array $dependencies = [], 
        string $version = null, 
        string $media = "all",
        bool $admin = false
    ): void
    {
        $name = trim($name);

        [$valid, $valid_issue] = $this->validate_style($name, $path_to_file, $dependencies);

        if(!$valid)
            throw new \Exception(implode(PHP_EOL, $valid_issue));

        $this->styles_to_register[$name] = [
            "file_path" => $path_to_file,
            "dependencies" => $dependencies,
            "version" => $version,
            "media" => $media,
            "admin" => $admin
        ];
    }

    /**
     * Check if style is already registered.
     * 
     * @param string $name Name of the style
     * 
     * @return bool
     */
    public function has_style(string $name): bool {
        return isset($this->styles_to_register[$name]);
    }

    /**
     * Unregister a style.
     * 
     * @param string $name Name of the style
     * 
     * @return void
     */
    public function unregister_style(string $name): void {
        if(!isset($this->styles_to_register[$name]))
            return;

        unset($this->styles_to_register[$name]);
    }

    /**
     * Init all registered styles.
     * 
     * @return void
     */
    public function init_styles(): void 
    {
        foreach($this->styles_to_register as $name => $style) {
            if($style["admin"])
                continue;
            
            wp_enqueue_style($name, $this->webUri . $style["file_path"], $style["dependencies"], $style["version"], $style["media"]);

            unset($this->styles_to_register[$name]);
        }
    }

    /**
     * Init all registered admin styles.
     * 
     * @return void
     */
    public function init_admin_styles(): void {
        foreach($this->styles_to_register as $name => $style) {
            if(!$style["admin"])
                continue;
            
            wp_enqueue_style($name, $this->webUri . $style["file_path"], $style["dependencies"], $style["version"], $style["media"]);

            unset($this->styles_to_register[$name]);
        }
    }

    /**
     * Validate style.
     * 
     * Currently checks:
     * - if name is not empty
     * - if file exists
     * - if style is already registered (name is unique)
     * - if dependencies are valid and registered already
     * 
     * @param string $name Name of the style
     * @param string $path_to_file Path to style file
     * @param array $dependencies Array of dependencies (already registered styles)
     * 
     * @return array{0: bool, 1: string[]} [bool $valid, array $valid_issue] Validation result and list of issues.
     */
    private function validate_style(string $name, string $path_to_file, array $dependencies): array
    {
        $valid = true;
        $valid_issue = [];

        global $wp_styles;
        if (!isset($wp_styles) || !is_object($wp_styles))
           $wp_styles = wp_styles();

        // check name is not empty
        if(empty($name)){
            $valid = false;
            array_push($valid_issue, "Name of style `$path_to_file` is empty.");
        }

        // file 
        $path = $this->contentPath . $path_to_file;
        if(!file_exists($path)){
            $valid = false;
            array_push($valid_issue, "File with style `$path` doesn't exist.");
        }

        // check if style is already registered in WP
        if(isset($wp_styles->registered[$name])){
            $valid = false;
            array_push($valid_issue, "[WP] Style `$name` for file `$path_to_file` is already registered.");
        }

        // check if style is already registered in StylesManager
        if(isset($this->styles_to_register[$name])){
            $valid = false;
            array_push($valid_issue, "[StylesManager] Style `$name` for file `$path_to_file` is already registered.");
        }

        // check valid dependencies - if they're already registered
        foreach ($dependencies as $dependency) {
            $wp_registered = isset($wp_styles->registered[$dependency]);
            $internally_registered = isset($this->styles_to_register[$dependency]);

            if (!$wp_registered && !$internally_registered) {
                $valid = false;
                $valid_issue[] = "Dependency `$dependency` for style `$name` doesn't exist " .
                                "(found in WP: " . ($wp_registered ? "yes" : "no") .
                                ", StylesManager: " . ($internally_registered ? "yes" : "no") . ").";
            }
        }

        return [$valid, $valid_issue];
    }
}
endif;
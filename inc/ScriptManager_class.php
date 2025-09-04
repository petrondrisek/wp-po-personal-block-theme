<?php

if(!class_exists('ScriptManager')):
class ScriptManager {
    private $webUri = WEB_URI;
    private $contentPath = CONTENT_PATH;
    
    public function __construct($pathToTemplateOrPlugin) {
        $this->webUri = WEB_URI . $pathToTemplateOrPlugin;
        $this->contentPath = CONTENT_PATH . $pathToTemplateOrPlugin;
    }

    private array $scripts_to_register = [];

    /**
     * Register a script.
     * 
     * After adding all scripts, call `ScriptManager::init_scripts()`.
     * 
     * @param string $name Unique name of the script
     * @param string $path_to_file Path to script file
     * @param array $dependencies Array of dependencies (already registered scripts)
     * @param string|null $version Version of the script
     * @param array $args Array of arguments
     * @param bool $admin Whether to load in admin
     * 
     * @return void
     * 
     * @throws \Exception When validation of sent script fails.
     */
    public function register_script(
        string $name, 
        string $path_to_file, 
        array $dependencies = [], 
        string $version = null, 
        array $args = [],
        bool $admin = false
    ): void
    {
        $name = trim($name);

        [$valid, $issues] = $this->validate_script($name, $path_to_file, $dependencies);

        if (!$valid)
            throw new \Exception(implode(PHP_EOL, $issues));

        $this->scripts_to_register[$name] = [
            "file_path" => $path_to_file,
            "dependencies" => $dependencies,
            "version" => $version,
            "args" => $args,
            "admin" => $admin
        ];
    }

    /**
     * Check if a script is already registered in the manager.
     * 
     * @param string $name Name of the script
     * 
     * @return bool
     */
    public function has_script(string $name): bool {
        return isset($this->scripts_to_register[$name]);
    }

    /**
     * Unregister a script.
     * 
     * @param string $name Name of the script
     * 
     * @return void
     */
    public function unregister_script(string $name): void {
        if (!isset($this->scripts_to_register[$name]))
            return;

        unset($this->scripts_to_register[$name]);
    }

    /**
     * Init all registered scripts.
     * 
     * @return void
     */
    public function init_scripts(): void {
        foreach($this->scripts_to_register as $name => $script) {
            if($script["admin"])
                continue;

            wp_enqueue_script(
                $name,
                $this->webUri . $script["file_path"],
                $script["dependencies"],
                $script["version"],
                $script["args"]
            );

            unset($this->scripts_to_register[$name]);
        }
    }

    /**
     * Init all registered admin scripts.
     * 
     * @return void
     */
    public function init_admin_scripts(): void {
        foreach($this->scripts_to_register as $name => $script) {
            if(!$script["admin"])
                continue;

            wp_enqueue_script(
                $name,
                $this->webUri . $script["file_path"],
                $script["dependencies"],
                $script["version"],
                $script["args"]
            );

            unset($this->scripts_to_register[$name]);
        }
    }

    /**
     * Validate script.
     * 
     * Currently checks:
     * - if name is not empty
     * - if file exists
     * - if script is already registered (name is unique)
     * - if dependencies are valid and already registered
     * 
     * @param string $name
     * @param string $path_to_file
     * @param array $dependencies Array of dependencies (already registered scripts)
     * 
     * @return array{0: bool, 1: string[]} [bool $valid, array $valid_issue] Validation result and list of issues.
     */
    private function validate_script(string $name, string $path_to_file, array $dependencies): array {
        $valid = true;
        $issues = [];

        global $wp_scripts;
        if (!isset($wp_scripts) || !is_object($wp_scripts)) {
            $wp_scripts = wp_scripts();
        }

        // check name is not empty
        if (empty($name)) {
            $valid = false;
            $issues[] = "Script name is empty (file: `$path_to_file`).";
        }

        // check file exists
        $path = $this->contentPath . $path_to_file;
        if (!file_exists($path)) {
            $valid = false;
            $issues[] = "File with script `$path` doesn't exist.";
        }

        // check if script is already registered in WP
        if (isset($wp_scripts->registered[$name])) {
            $valid = false;
            $issues[] = "[WP] Script `$name` for file `$path_to_file` is already registered.";
        }

        // check if script is already registered in ScriptManager
        if (isset($this->scripts_to_register[$name])) {
            $valid = false;
            $issues[] = "[ScriptManager] Script `$name` for file `$path_to_file` is already registered.";
        }

        // check valid dependencies - if they're already registered
        foreach ($dependencies as $dependency) {
            $wp_registered = isset($wp_scripts->registered[$dependency]);
            $internally_registered = isset($this->scripts_to_register[$dependency]);

            if (!$wp_registered && !$internally_registered) {
                $valid = false;
                $issues[] = "Dependency `$dependency` for script `$name` doesn't exist " .
                            "(found in WP: " . ($wp_registered ? "yes" : "no") .
                            ", ScriptManager: " . ($internally_registered ? "yes" : "no") . ").";
            }
        }

        return [$valid, $issues];
    }
}
endif;
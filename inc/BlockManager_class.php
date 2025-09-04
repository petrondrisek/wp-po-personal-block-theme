<?php

if(!class_exists('BlockManager')):
class BlockManager {
    const RENDER_FILE_NOT_SET = "RENDER_FILE_NOT_SET";
    const RENDER_FILE_NOT_PHP = "RENDER_FILE_NOT_PHP";

    private array $blocks_to_register = [];
    
    /**
     * Register a static block.
     * 
     * After adding all blocks, call `BlockManager::init_blocks()`.
     * 
     * @param string $path_to_dir Path to block directory
     * @param bool $using_metadata Register via register_block_type_from_metadata, otherwise register_block_type
     * 
     * @return void
     * 
     * @throws \Exception When validation of sent path to block directory fails.
     */
    public function register_static_block(string $path_to_dir, bool $using_metadata = false): void
    {
        [$valid, $valid_issue] = $this->validate_block($path_to_dir, false);

        if(!$valid)
            throw new \Exception(implode(PHP_EOL, $valid_issue));

        $this->blocks_to_register[] = [
            "directory" => $path_to_dir,
            "metadata" => $using_metadata,
            "render_file" => null,
            "render_callback" => null,
        ];
    }

    /**
     * Register a dynamic block.
     * 
     * After adding all blocks, call `BlockManager::init_blocks()`.
     * 
     * @param string $path_to_dir Path to block directory
     * @param string $render_method Render callback method name in your block render file (has to be set in `block.json` `render` key)
     * 
     * @return void
     * 
     * @throws \Exception When $render_method is empty.
     * @throws \Exception When validation of sent path to block directory fails.
     */
    public function register_dynamic_block(string $path_to_dir, string $render_method): void
    {
        if(empty($render_method))
            throw new \Exception("Provided render callback method name in `render_method` 
                                for dynamic block `$path_to_dir` is empty.");
        [$valid, $valid_issue] = $this->validate_block($path_to_dir, true);

        if(!$valid)
            throw new \Exception(implode(PHP_EOL, $valid_issue));

        $render_file = $this->get_render_file($path_to_dir);

        $this->blocks_to_register[] = [
            "directory" => $path_to_dir,
            "metadata" => true,
            "render_file" => trailingslashit($path_to_dir) . $render_file,
            "render_callback" => $render_method,
        ];
    }

    /**
     * Initialize all registered blocks.
     * 
     * @return void
     * 
     * @throws \Exception When registered render callback doesn't exist.
     */
    public function init_blocks(): void {
        foreach($this->blocks_to_register as $block) {
            $args = [];

            // load render file to register callback
            if($block["render_file"]){
                require_once($block["render_file"]);

                if(!function_exists($block["render_callback"]))
                    throw new \Exception("Render callback in `".$block["render_file"]."` 
                                        - `".$block["render_callback"]."` doesn't exist while 
                                        registering block `".$block["directory"]."`.");

                $args["render_callback"] = $block["render_callback"];
            }

            if($block["metadata"])
                register_block_type_from_metadata($block["directory"], $args);

            else
                register_block_type($block["directory"], $args);
        }

        $this->blocks_to_register = [];
    }

    /**
     * Validates block directory.
     * 
     * Currently checks:
     * - if directory exists
     * - if block.json exists
     * - if index.js exists
     * - if render file exists if $dynamic is true
     * - if render file is a PHP file if $dynamic is true
     * 
     * @param string $path_to_dir Path to block directory
     * @param bool $dynamic Whether block is dynamic or not
     * 
     * @return array{0: bool, 1: string[]} [bool $valid, array $valid_issue] Validation result and list of issues.
     */
    private function validate_block(string $path_to_dir, bool $dynamic): array {
        $valid = true;
        $valid_issue = [];

        if(!is_dir($path_to_dir))
        {
            $valid = false;
            array_push($valid_issue, "Directory with block `$path_to_dir` doesn't exist.");
        }

        if(!file_exists($path_to_dir . "/block.json"))
        {
            $valid = false;
            array_push($valid_issue, "Missing `block.json` in `$path_to_dir`.");
        }

        if(!file_exists($path_to_dir . "/index.js"))
        {
            $valid = false;
            array_push($valid_issue, "Missing `index.js` in `$path_to_dir`.");
        }

        if($dynamic){
            $render_file = $this->get_render_file($path_to_dir);
            if($render_file === self::RENDER_FILE_NOT_SET) {
                $valid = false;
                array_push(
                    $valid_issue, 
                    "Missing `render` key in `block.json` in `$path_to_dir` 
                    (returned using `BlockManager::get_render_file` '$render_file')."
                );
            }

            if($render_file === self::RENDER_FILE_NOT_PHP) {
                $valid = false;
                array_push(
                    $valid_issue, 
                    "Invalid `render` key in `block.json` in `$path_to_dir`, not a PHP file 
                    (returned using `BlockManager::get_render_file` '$render_file')."
                );
            }
        }

        return [$valid, $valid_issue];
    }


    /**
     * Gets the render file name from the block.json `render` key.
     *
     * @param string $path_to_dir Path to the block directory.
     *
     * @return string Render file name if valid, or one of:
     *                - self::RENDER_FILE_NOT_SET if the `render` key is missing.
     *                - self::RENDER_FILE_NOT_PHP if the render file is not a PHP file.
     */
    private function get_render_file(string $path_to_dir): string {
        $block_json = file_get_contents($path_to_dir . "/block.json");
        $block_json = json_decode($block_json, true);

        if(!isset($block_json["render"]))
            return self::RENDER_FILE_NOT_SET;

        $render_raw = $block_json["render"];
        if (str_starts_with($render_raw, 'file:'))
            $render_raw = substr($render_raw, 5);

        $render_file = basename($render_raw);

        return str_ends_with($render_file, ".php") ? $render_file : self::RENDER_FILE_NOT_PHP;
    }
}
endif;
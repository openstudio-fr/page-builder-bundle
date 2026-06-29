<?php

/**
 * Returns the importmap for this application.
 *
 * - "path" is a path inside the asset mapper system. Use the
 *     "debug:asset-map" command to see the full list of paths.
 *
 * - "entrypoint" (JavaScript only) set to true for any module that will
 *     be used as an "entrypoint" (and passed to the importmap() Twig function).
 *
 * The "importmap:require" command can be used to add new entries to this file.
 */
return [
    'app' => [
        'path' => './assets/app.js',
        'entrypoint' => true,
    ],
    '@hotwired/stimulus' => [
        'version' => '3.2.2',
    ],
    '@symfony/stimulus-bundle' => [
        'path' => './vendor/symfony/stimulus-bundle/assets/dist/loader.js',
    ],
    'grapesjs' => [
        'version' => '0.22.12',
    ],
    'grapesjs/dist/css/grapes.min.css' => [
        'version' => '0.22.12',
        'type' => 'css',
    ],
    'grapesjs/locale/fr' => [
        'version' => '0.22.12',
    ],
    'grapesjs-blocks-basic' => [
        'version' => '1.0.2',
    ],
    'grapesjs-preset-webpage' => [
        'version' => '1.0.3',
    ],
    'grapesjs-component-countdown' => [
        'version' => '1.0.2',
    ],
    'grapesjs-custom-code' => [
        'version' => '1.0.2',
    ],
    '@openstudio/page-builder-bundle/controllers/page_builder_controller.js' => [
        'path' => '@openstudio/page-builder-bundle/controllers/page_builder_controller.js',
    ],
];

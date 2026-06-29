<?php

declare(strict_types=1);

namespace OpenStudio\PageBuilderBundle\DependencyInjection;

use Override;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

final class Configuration implements ConfigurationInterface
{
    #[Override]
    public function getConfigTreeBuilder(): TreeBuilder
    {
        $treeBuilder = new TreeBuilder('openstudio_page_builder');

        $treeBuilder->getRootNode()
            ->children()
                ->scalarNode('render_template_endpoint')
                    ->info('URL the editor calls to render server-side composite blocks. The host owns this endpoint.')
                    ->defaultNull()
                ->end()
                ->scalarNode('app_stylesheet')
                    ->info('Stylesheet injected into the editor canvas so the content renders with the host styles.')
                    ->defaultNull()
                ->end()
                ->integerNode('max_upload_size')
                    ->info('Maximum accepted image size in bytes.')
                    ->defaultValue(5 * 1024 * 1024)
                    ->min(1)
                ->end()
                ->arrayNode('allowed_mime_types')
                    ->info('MIME types accepted by the image upload endpoint. SVG is excluded by default because it can carry scripts.')
                    ->scalarPrototype()->end()
                    ->defaultValue(['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'])
                ->end()
                ->arrayNode('palette')
                    ->info('Color palette offered by the editor color picker.')
                    ->scalarPrototype()->end()
                ->end()
                ->arrayNode('icons')
                    ->info('Icon set available to the icon block and icon traits.')
                    ->arrayPrototype()
                        ->children()
                            ->scalarNode('name')->isRequired()->cannotBeEmpty()->end()
                            ->scalarNode('svg')->isRequired()->cannotBeEmpty()->end()
                        ->end()
                    ->end()
                ->end()
            ->end();

        return $treeBuilder;
    }
}

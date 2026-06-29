<?php

declare(strict_types=1);

namespace OpenStudio\PageBuilderBundle\DependencyInjection;

use OpenStudio\PageBuilderBundle\OpenStudioPageBuilderBundle;
use Override;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\Loader\PhpFileLoader;

final class OpenStudioPageBuilderExtension extends Extension implements PrependExtensionInterface
{
    #[Override]
    public function load(array $configs, ContainerBuilder $container): void
    {
        $configuration = new Configuration();
        /** @var array{render_template_endpoint: string|null, app_stylesheet: string|null, max_upload_size: int, allowed_mime_types: list<string>, palette: list<string>, icons: list<array{name: string, svg: string}>} $config */
        $config = $this->processConfiguration($configuration, $configs);

        $loader = new PhpFileLoader($container, new FileLocator(\dirname(__DIR__, 2).'/config'));
        $loader->load('services.php');

        $container->setParameter('openstudio_page_builder.render_template_endpoint', $config['render_template_endpoint']);
        $container->setParameter('openstudio_page_builder.app_stylesheet', $config['app_stylesheet']);
        $container->setParameter('openstudio_page_builder.max_upload_size', $config['max_upload_size']);
        $container->setParameter('openstudio_page_builder.allowed_mime_types', $config['allowed_mime_types']);
        $container->setParameter('openstudio_page_builder.palette', $config['palette']);
        $container->setParameter('openstudio_page_builder.icons', $config['icons']);
    }

    #[Override]
    public function prepend(ContainerBuilder $container): void
    {
        if (!$this->isAssetMapperAvailable($container)) {
            return;
        }

        $container->prependExtensionConfig('framework', [
            'asset_mapper' => [
                'paths' => [
                    \dirname(__DIR__, 2).'/assets' => OpenStudioPageBuilderBundle::ASSET_NAMESPACE,
                ],
            ],
        ]);
    }

    #[Override]
    public function getAlias(): string
    {
        return 'openstudio_page_builder';
    }

    private function isAssetMapperAvailable(ContainerBuilder $container): bool
    {
        $bundles = $container->getParameter('kernel.bundles');

        return \is_array($bundles) && isset($bundles['FrameworkBundle']) && class_exists(\Symfony\Component\AssetMapper\AssetMapper::class);
    }
}

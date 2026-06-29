<?php

declare(strict_types=1);

use OpenStudio\PageBuilderBundle\Contract\ImageLibraryPortInterface;
use OpenStudio\PageBuilderBundle\Contract\ImageUploadPortInterface;
use OpenStudio\PageBuilderBundle\Contract\PageBuilderConfigProviderInterface;
use OpenStudio\PageBuilderBundle\Controller\Api\ImageLibraryController;
use OpenStudio\PageBuilderBundle\Controller\Api\ImageUploadController;
use OpenStudio\PageBuilderBundle\Service\GrapesJs\GrapesJsFileExtractor;
use OpenStudio\PageBuilderBundle\Service\GrapesJs\GrapesJsResponseBuilder;
use OpenStudio\PageBuilderBundle\Service\ImageLibraryService;
use OpenStudio\PageBuilderBundle\Service\ImageUploadOrchestrator;
use OpenStudio\PageBuilderBundle\Service\NullImageLibraryPort;
use OpenStudio\PageBuilderBundle\Service\NullImageUploadPort;
use OpenStudio\PageBuilderBundle\Service\StaticPageBuilderConfigProvider;
use OpenStudio\PageBuilderBundle\Twig\Components\PageBuilderComponent;

use function Symfony\Component\DependencyInjection\Loader\Configurator\service;

return static function (Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator $container): void {
    $services = $container->services()
        ->defaults()
        ->autowire()
        ->autoconfigure();

    $services->set(GrapesJsFileExtractor::class);
    $services->set(GrapesJsResponseBuilder::class);
    $services->set(ImageUploadOrchestrator::class)
        ->arg('$allowedMimeTypes', '%openstudio_page_builder.allowed_mime_types%')
        ->arg('$maxUploadSize', '%openstudio_page_builder.max_upload_size%');
    $services->set(ImageLibraryService::class);

    $services->set(StaticPageBuilderConfigProvider::class)
        ->arg('$appStylesheet', '%openstudio_page_builder.app_stylesheet%')
        ->arg('$palette', '%openstudio_page_builder.palette%')
        ->arg('$icons', '%openstudio_page_builder.icons%')
        ->arg('$renderTemplateEndpoint', '%openstudio_page_builder.render_template_endpoint%');
    $services->alias(PageBuilderConfigProviderInterface::class, StaticPageBuilderConfigProvider::class);

    $services->set(NullImageUploadPort::class);
    $services->alias(ImageUploadPortInterface::class, NullImageUploadPort::class);

    $services->set(NullImageLibraryPort::class);
    $services->alias(ImageLibraryPortInterface::class, NullImageLibraryPort::class);

    $services->set(PageBuilderComponent::class)
        ->arg('$configProvider', service(PageBuilderConfigProviderInterface::class))
        ->arg('$urlGenerator', service('router'));

    $services->set(ImageUploadController::class)->autoconfigure(false)->public()->tag('controller.service_arguments');
    $services->set(ImageLibraryController::class)->autoconfigure(false)->public()->tag('controller.service_arguments');
};

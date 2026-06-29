<?php

declare(strict_types=1);

use OpenStudio\PageBuilderBundle\Controller\Api\ImageLibraryController;
use OpenStudio\PageBuilderBundle\Controller\Api\ImageUploadController;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

return static function (RoutingConfigurator $routes): void {
    $routes->import(ImageUploadController::class, 'attribute');
    $routes->import(ImageLibraryController::class, 'attribute');
};

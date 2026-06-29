<?php

declare(strict_types=1);

namespace OpenStudio\PageBuilderBundle;

use OpenStudio\PageBuilderBundle\DependencyInjection\OpenStudioPageBuilderExtension;
use Override;
use Symfony\Component\DependencyInjection\Extension\ExtensionInterface;
use Symfony\Component\HttpKernel\Bundle\Bundle;

final class OpenStudioPageBuilderBundle extends Bundle
{
    public const ASSET_NAMESPACE = '@openstudio/page-builder-bundle';

    #[Override]
    public function getContainerExtension(): ?ExtensionInterface
    {
        if (null === $this->extension) {
            $this->extension = new OpenStudioPageBuilderExtension();
        }

        return $this->extension ?: null;
    }

    #[Override]
    public function getPath(): string
    {
        return \dirname(__DIR__);
    }
}

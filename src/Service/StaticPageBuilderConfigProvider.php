<?php

declare(strict_types=1);

namespace OpenStudio\PageBuilderBundle\Service;

use OpenStudio\PageBuilderBundle\Contract\PageBuilderConfigProviderInterface;
use Override;

final readonly class StaticPageBuilderConfigProvider implements PageBuilderConfigProviderInterface
{
    /**
     * @param list<string>                           $palette
     * @param list<array{name: string, svg: string}> $icons
     */
    public function __construct(
        private ?string $appStylesheet = null,
        private array $palette = [],
        private array $icons = [],
        private ?string $renderTemplateEndpoint = null,
    ) {
    }

    #[Override]
    public function getConfig(?string $context = null): array
    {
        return [
            'appStylesheet' => $this->appStylesheet,
            'icons' => $this->icons,
            'palette' => $this->palette,
            'renderTemplateEndpoint' => $this->renderTemplateEndpoint,
        ];
    }
}

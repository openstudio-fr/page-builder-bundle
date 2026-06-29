<?php

declare(strict_types=1);

namespace OpenStudio\PageBuilderBundle\Contract;

interface PageBuilderConfigProviderInterface
{
    /**
     * @return array{
     *   appStylesheet?: string|null,
     *   icons?: list<array{name: string, svg: string}>,
     *   palette?: list<string>,
     *   renderTemplateEndpoint?: string|null
     * }
     */
    public function getConfig(?string $context = null): array;
}

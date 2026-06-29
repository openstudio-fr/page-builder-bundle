<?php

declare(strict_types=1);

namespace OpenStudio\PageBuilderBundle\Contract;

interface PageContentStoreInterface
{
    /**
     * @return array<mixed>|null
     */
    public function getProjectData(): ?array;

    /**
     * @param array<mixed>|null $data
     */
    public function setProjectData(?array $data): void;

    public function getHtml(): ?string;

    public function setHtml(?string $html): void;

    public function getCss(): ?string;

    public function setCss(?string $css): void;

    public function getIdentifier(): string;
}

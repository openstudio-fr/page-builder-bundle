<?php

declare(strict_types=1);

namespace OpenStudio\PageBuilderBundle\Dto;

final readonly class GrapesJsUploadResult
{
    /**
     * @param list<GrapesJsAsset>       $assets
     * @param list<GrapesJsUploadError> $errors
     */
    public function __construct(
        public array $assets = [],
        public array $errors = [],
    ) {
    }

    public function hasAssets(): bool
    {
        return [] !== $this->assets;
    }

    public function hasErrors(): bool
    {
        return [] !== $this->errors;
    }

    public function allFailed(): bool
    {
        return !$this->hasAssets() && $this->hasErrors();
    }
}

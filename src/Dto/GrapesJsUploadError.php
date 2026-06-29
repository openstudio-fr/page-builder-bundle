<?php

declare(strict_types=1);

namespace OpenStudio\PageBuilderBundle\Dto;

final readonly class GrapesJsUploadError
{
    public function __construct(
        public string $fileName,
        public string $errorMessage,
    ) {
    }
}

<?php

declare(strict_types=1);

namespace OpenStudio\PageBuilderBundle\Dto;

final readonly class ImageUploadResponse
{
    public function __construct(
        public string $id,
        public string $url,
        public string $originalFileName,
        public ?int $width = null,
        public ?int $height = null,
    ) {
    }
}

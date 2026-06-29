<?php

declare(strict_types=1);

namespace OpenStudio\PageBuilderBundle\Dto;

final readonly class ImageRecord
{
    public function __construct(
        public string $id,
        public string $url,
        public ?string $name = null,
        public ?int $width = null,
        public ?int $height = null,
    ) {
    }
}

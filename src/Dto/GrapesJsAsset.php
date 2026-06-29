<?php

declare(strict_types=1);

namespace OpenStudio\PageBuilderBundle\Dto;

final readonly class GrapesJsAsset
{
    public function __construct(
        public string $src,
        public string $type = 'image',
        public ?int $width = null,
        public ?int $height = null,
        public ?string $name = null,
        public ?string $id = null,
    ) {
    }

    /**
     * @return array{id: string|null, src: string, type: string, width: int|null, height: int|null, name: string|null}
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'src' => $this->src,
            'type' => $this->type,
            'width' => $this->width,
            'height' => $this->height,
            'name' => $this->name,
        ];
    }
}

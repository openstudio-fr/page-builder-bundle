<?php

declare(strict_types=1);

namespace OpenStudio\PageBuilderBundle\Service;

use OpenStudio\PageBuilderBundle\Contract\ImageLibraryPortInterface;
use OpenStudio\PageBuilderBundle\Dto\GrapesJsAsset;

final readonly class ImageLibraryService
{
    public function __construct(
        private ImageLibraryPortInterface $imageLibraryPort,
    ) {
    }

    /**
     * @return list<GrapesJsAsset>
     */
    public function getLibraryForContext(string $context): array
    {
        return array_map(
            static fn ($record) => new GrapesJsAsset(
                src: $record->url,
                width: $record->width,
                height: $record->height,
                name: $record->name,
                id: $record->id,
            ),
            $this->imageLibraryPort->findByContext($context),
        );
    }

    public function delete(string $imageId): void
    {
        $this->imageLibraryPort->delete($imageId);
    }
}

<?php

declare(strict_types=1);

namespace OpenStudio\PageBuilderBundle\Service;

use OpenStudio\PageBuilderBundle\Contract\ImageLibraryPortInterface;
use Override;

final readonly class NullImageLibraryPort implements ImageLibraryPortInterface
{
    #[Override]
    public function findByContext(string $context): array
    {
        return [];
    }

    #[Override]
    public function delete(string $imageId): void
    {
    }
}

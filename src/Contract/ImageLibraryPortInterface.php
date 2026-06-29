<?php

declare(strict_types=1);

namespace OpenStudio\PageBuilderBundle\Contract;

use OpenStudio\PageBuilderBundle\Dto\ImageRecord;

interface ImageLibraryPortInterface
{
    /**
     * @return list<ImageRecord>
     */
    public function findByContext(string $context): array;

    public function delete(string $imageId): void;
}

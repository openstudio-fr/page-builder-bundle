<?php

declare(strict_types=1);

namespace App\PageBuilder;

use OpenStudio\PageBuilderBundle\Contract\ImageLibraryPortInterface;
use OpenStudio\PageBuilderBundle\Dto\ImageRecord;

final readonly class LocalImageLibraryAdapter implements ImageLibraryPortInterface
{
    public function __construct(
        private string $uploadDir,
        private string $publicPrefix = '/uploads',
    ) {
    }

    public function findByContext(string $context): array
    {
        if (!is_dir($this->uploadDir)) {
            return [];
        }

        $records = [];
        foreach (scandir($this->uploadDir) ?: [] as $file) {
            if ('.' === $file || '..' === $file) {
                continue;
            }
            $records[] = new ImageRecord(id: $file, url: $this->publicPrefix.'/'.$file, name: $file);
        }

        return $records;
    }

    public function delete(string $imageId): void
    {
        $path = $this->uploadDir.'/'.$imageId;

        if (is_file($path)) {
            unlink($path);
        }
    }
}

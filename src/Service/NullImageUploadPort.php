<?php

declare(strict_types=1);

namespace OpenStudio\PageBuilderBundle\Service;

use OpenStudio\PageBuilderBundle\Contract\Exception\ImageUploadException;
use OpenStudio\PageBuilderBundle\Contract\ImageUploadPortInterface;
use OpenStudio\PageBuilderBundle\Dto\ImageUploadResponse;
use Override;
use Symfony\Component\HttpFoundation\File\UploadedFile;

final readonly class NullImageUploadPort implements ImageUploadPortInterface
{
    #[Override]
    public function upload(UploadedFile $file, ?string $context = null, ?string $uploadedBy = null): ImageUploadResponse
    {
        throw new ImageUploadException('No image upload adapter is configured. Implement ImageUploadPortInterface to enable uploads.');
    }

    #[Override]
    public function delete(string $imageId): void
    {
        throw new ImageUploadException('No image upload adapter is configured. Implement ImageUploadPortInterface to enable deletion.');
    }
}

<?php

declare(strict_types=1);

namespace OpenStudio\PageBuilderBundle\Contract;

use OpenStudio\PageBuilderBundle\Contract\Exception\ImageUploadException;
use OpenStudio\PageBuilderBundle\Dto\ImageUploadResponse;
use Symfony\Component\HttpFoundation\File\UploadedFile;

interface ImageUploadPortInterface
{
    /**
     * @throws ImageUploadException
     */
    public function upload(UploadedFile $file, ?string $context = null, ?string $uploadedBy = null): ImageUploadResponse;

    public function delete(string $imageId): void;
}

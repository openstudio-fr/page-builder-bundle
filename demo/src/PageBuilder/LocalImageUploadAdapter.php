<?php

declare(strict_types=1);

namespace App\PageBuilder;

use OpenStudio\PageBuilderBundle\Contract\Exception\ImageUploadException;
use OpenStudio\PageBuilderBundle\Contract\ImageUploadPortInterface;
use OpenStudio\PageBuilderBundle\Dto\ImageUploadResponse;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

final readonly class LocalImageUploadAdapter implements ImageUploadPortInterface
{
    public function __construct(
        private string $uploadDir,
        private string $publicPrefix = '/uploads',
    ) {
    }

    public function upload(UploadedFile $file, ?string $context = null, ?string $uploadedBy = null): ImageUploadResponse
    {
        $name = bin2hex(random_bytes(8)).'.'.$file->guessExtension();

        try {
            $file->move($this->uploadDir, $name);
        } catch (FileException $exception) {
            throw new ImageUploadException($exception->getMessage(), 0, $exception);
        }

        return new ImageUploadResponse(
            id: $name,
            url: $this->publicPrefix.'/'.$name,
            originalFileName: $file->getClientOriginalName(),
        );
    }

    public function delete(string $imageId): void
    {
        $path = $this->uploadDir.'/'.$imageId;

        if (is_file($path)) {
            unlink($path);
        }
    }
}

<?php

declare(strict_types=1);

namespace OpenStudio\PageBuilderBundle\Service;

use OpenStudio\PageBuilderBundle\Contract\Exception\ImageUploadException;
use OpenStudio\PageBuilderBundle\Contract\ImageUploadPortInterface;
use OpenStudio\PageBuilderBundle\Dto\GrapesJsAsset;
use OpenStudio\PageBuilderBundle\Dto\GrapesJsUploadError;
use OpenStudio\PageBuilderBundle\Dto\GrapesJsUploadResult;
use Symfony\Component\HttpFoundation\File\UploadedFile;

final readonly class ImageUploadOrchestrator
{
    /**
     * @param list<string> $allowedMimeTypes
     */
    public function __construct(
        private ImageUploadPortInterface $imageUploadPort,
        private array $allowedMimeTypes,
        private int $maxUploadSize,
    ) {
    }

    /**
     * @param list<UploadedFile> $files
     */
    public function uploadAll(array $files, ?string $context = null, ?string $uploadedBy = null): GrapesJsUploadResult
    {
        $assets = [];
        $errors = [];

        foreach ($files as $file) {
            try {
                $assets[] = $this->uploadOne($file, $context, $uploadedBy);
            } catch (ImageUploadException $exception) {
                $errors[] = new GrapesJsUploadError($file->getClientOriginalName(), $exception->getMessage());
            }
        }

        return new GrapesJsUploadResult($assets, $errors);
    }

    private function uploadOne(UploadedFile $file, ?string $context, ?string $uploadedBy): GrapesJsAsset
    {
        if (!$file->isValid()) {
            throw new ImageUploadException($file->getErrorMessage());
        }

        if ($file->getSize() > $this->maxUploadSize) {
            throw new ImageUploadException(\sprintf('File exceeds the maximum size of %d bytes.', $this->maxUploadSize));
        }

        $mimeType = $file->getMimeType();

        if (null === $mimeType || !\in_array($mimeType, $this->allowedMimeTypes, true)) {
            throw new ImageUploadException(\sprintf('Unsupported file type "%s".', $mimeType ?? 'unknown'));
        }

        $response = $this->imageUploadPort->upload($file, $context, $uploadedBy);

        return new GrapesJsAsset(
            src: $response->url,
            width: $response->width,
            height: $response->height,
            name: $response->originalFileName,
            id: $response->id,
        );
    }
}

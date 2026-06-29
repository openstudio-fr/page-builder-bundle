<?php

declare(strict_types=1);

namespace OpenStudio\PageBuilderBundle\Controller\Api;

use OpenStudio\PageBuilderBundle\Service\GrapesJs\GrapesJsFileExtractor;
use OpenStudio\PageBuilderBundle\Service\GrapesJs\GrapesJsResponseBuilder;
use OpenStudio\PageBuilderBundle\Service\ImageUploadOrchestrator;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/images/upload', name: 'openstudio_page_builder_image_upload', methods: ['POST'])]
final readonly class ImageUploadController
{
    public function __construct(
        private GrapesJsFileExtractor $fileExtractor,
        private ImageUploadOrchestrator $uploadOrchestrator,
        private GrapesJsResponseBuilder $responseBuilder,
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $files = $this->fileExtractor->extract($request);

        if ([] === $files) {
            return $this->responseBuilder->buildError('No files uploaded');
        }

        $result = $this->uploadOrchestrator->uploadAll(
            files: $files,
            context: $request->request->getString('context') ?: null,
        );

        return $this->responseBuilder->buildFromResult($result);
    }
}

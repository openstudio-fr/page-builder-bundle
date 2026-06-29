<?php

declare(strict_types=1);

namespace OpenStudio\PageBuilderBundle\Controller\Api;

use OpenStudio\PageBuilderBundle\Service\ImageLibraryService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/images', name: 'openstudio_page_builder_image_')]
final readonly class ImageLibraryController
{
    public function __construct(
        private ImageLibraryService $imageLibraryService,
    ) {
    }

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $context = $request->query->getString('context');

        if ('' === $context) {
            return new JsonResponse(['error' => 'Missing required parameter: context', 'data' => []], Response::HTTP_BAD_REQUEST);
        }

        $assets = array_map(
            static fn ($asset) => $asset->toArray(),
            $this->imageLibraryService->getLibraryForContext($context),
        );

        return new JsonResponse(['data' => $assets]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(string $id): JsonResponse
    {
        $this->imageLibraryService->delete($id);

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
}

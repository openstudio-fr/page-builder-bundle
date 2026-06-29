<?php

declare(strict_types=1);

namespace OpenStudio\PageBuilderBundle\Service\GrapesJs;

use OpenStudio\PageBuilderBundle\Dto\GrapesJsUploadResult;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

final readonly class GrapesJsResponseBuilder
{
    public function buildSuccess(GrapesJsUploadResult $result): JsonResponse
    {
        $data = array_map(
            static fn ($asset) => $asset->toArray(),
            $result->assets,
        );

        return new JsonResponse(['data' => $data], Response::HTTP_OK);
    }

    public function buildError(string $message, int $statusCode = Response::HTTP_BAD_REQUEST): JsonResponse
    {
        return new JsonResponse(['error' => $message, 'data' => []], $statusCode);
    }

    public function buildFromResult(GrapesJsUploadResult $result): JsonResponse
    {
        if ($result->allFailed()) {
            $messages = array_map(static fn ($error) => $error->errorMessage, $result->errors);

            return $this->buildError(
                'All uploads failed: '.implode(', ', $messages),
                Response::HTTP_UNPROCESSABLE_ENTITY,
            );
        }

        return $this->buildSuccess($result);
    }
}

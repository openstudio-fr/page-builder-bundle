<?php

declare(strict_types=1);

namespace OpenStudio\PageBuilderBundle\Service\GrapesJs;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;

final readonly class GrapesJsFileExtractor
{
    private const string FILES_FIELD = 'files';

    /**
     * @return list<UploadedFile>
     */
    public function extract(Request $request): array
    {
        $files = $request->files->get(self::FILES_FIELD);

        if (null === $files) {
            return [];
        }

        if ($files instanceof UploadedFile) {
            return [$files];
        }

        if (!\is_array($files)) {
            return [];
        }

        return array_values(array_filter(
            $files,
            static fn (mixed $file): bool => $file instanceof UploadedFile,
        ));
    }

    public function hasFiles(Request $request): bool
    {
        return [] !== $this->extract($request);
    }
}

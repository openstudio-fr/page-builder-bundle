<?php

declare(strict_types=1);

namespace OpenStudio\PageBuilderBundle\Twig\Components;

use InvalidArgumentException;
use OpenStudio\PageBuilderBundle\Contract\PageBuilderConfigProviderInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\Routing\Exception\RouteNotFoundException;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

#[AsTwigComponent(name: 'PageBuilder', template: '@OpenStudioPageBuilder/components/PageBuilder.html.twig')]
final class PageBuilderComponent
{
    /** @psalm-suppress PropertyNotSetInConstructor */
    public FormView $form;

    /** @var array<string, mixed> */
    public array $options = [];

    public ?string $context = null;

    public string $controller = 'page-builder';

    /** @var list<array{name: string, svg: string}> */
    public array $icons = [];

    /** @var list<string> */
    public array $palette = [];

    /** @var array<string, string> */
    public array $endpoints = [];

    /** @var array<string, string> */
    public array $fields = [];

    public function __construct(
        private readonly PageBuilderConfigProviderInterface $configProvider,
        private readonly UrlGeneratorInterface $urlGenerator,
    ) {
    }

    /**
     * @param array<string, mixed> $options
     */
    public function mount(FormView $form, array $options = [], ?string $context = null): void
    {
        $this->form = $form;
        $this->context = $context;

        $this->fields = [
            'data' => $this->fieldId($form, 'projectData'),
            'html' => $this->fieldId($form, 'html'),
            'css' => $this->fieldId($form, 'css'),
        ];

        $config = $this->configProvider->getConfig($context);

        $this->icons = $config['icons'] ?? [];
        $this->palette = $config['palette'] ?? [];

        $appStylesheet = $config['appStylesheet'] ?? null;

        if (null !== $appStylesheet) {
            $this->options['externalStylesheets'] = [$appStylesheet];
        }

        $this->options = [...$this->options, ...$options];

        $this->endpoints = array_filter([
            'uploadImage' => $this->tryGenerate('openstudio_page_builder_image_upload'),
            'listImages' => $this->tryGenerate('openstudio_page_builder_image_list'),
            'render-template' => $config['renderTemplateEndpoint'] ?? null,
        ], static fn (?string $value): bool => null !== $value);
    }

    private function fieldId(FormView $form, string $child): string
    {
        if (!isset($form[$child])) {
            throw new InvalidArgumentException(\sprintf('The page builder form must expose a "%s" field.', $child));
        }

        /** @psalm-suppress PossiblyNullArrayAccess */
        $id = $form[$child]->vars['id'] ?? null;

        if (!\is_string($id)) {
            throw new InvalidArgumentException(\sprintf('The "%s" form field has no resolvable id.', $child));
        }

        return $id;
    }

    private function tryGenerate(string $route): ?string
    {
        try {
            return $this->urlGenerator->generate($route);
        } catch (RouteNotFoundException) {
            return null;
        }
    }
}

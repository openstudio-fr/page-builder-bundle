# Page Builder Bundle

A GrapesJS page builder for Symfony 7, served through AssetMapper. It ships the editor, the structural blocks and the integration points, and stays out of your domain: no entities, no firewall, no admin pages. You provide the host page, the form and the persistence.

It works in three steps:

- **Level 0** gives a working editor with no custom backend. The content is saved into hidden form fields.
- **Level 1** adds a media library once you implement two ports for upload and listing.
- **Level 2** adds server-rendered composite blocks once you point the editor at a render endpoint you own.

## Requirements

- PHP 8.3+
- Symfony 7.4
- AssetMapper, Stimulus and Twig Component (pulled in as dependencies)

## Installation

```bash
composer require openstudio/page-builder-bundle
```

If you do not use Symfony Flex, register the bundle:

```php
// config/bundles.php
return [
    // ...
    OpenStudio\PageBuilderBundle\OpenStudioPageBuilderBundle::class => ['all' => true],
];
```

Add the JavaScript dependencies to your importmap:

```bash
php bin/console importmap:require \
    grapesjs@0.22.12 \
    "grapesjs/dist/css/grapes.min.css@0.22.12" \
    "grapesjs/locale/fr@0.22.12" \
    grapesjs-blocks-basic@1.0.2 \
    grapesjs-preset-webpage@1.0.3 \
    grapesjs-component-countdown@1.0.2 \
    grapesjs-custom-code@1.0.2
```

## Quick start (Level 0)

Create a Stimulus controller that extends the one from the bundle. Add its source to the importmap so the import resolves:

```bash
php bin/console importmap:require \
    "@openstudio/page-builder-bundle/controllers/page_builder_controller.js" \
    --path="@openstudio/page-builder-bundle/controllers/page_builder_controller.js"
```

```js
// assets/controllers/page_builder_controller.js
import PageBuilderController from "@openstudio/page-builder-bundle/controllers/page_builder_controller.js";

export default class extends PageBuilderController {}
```

The host form needs three hidden fields named `projectData`, `html` and `css`:

```php
// src/Form/PageType.php
$builder
    ->add('projectData', HiddenType::class)
    ->add('html', HiddenType::class)
    ->add('css', HiddenType::class);
```

Render the form fields and the component on the same page:

```twig
{{ form_start(form) }}
    {{ form_widget(form.projectData) }}
    {{ form_widget(form.html) }}
    {{ form_widget(form.css) }}

    {{ component('PageBuilder', { form: form }) }}
{{ form_end(form) }}
```

The save button writes the content into the hidden fields. Submitting the form persists it the way you persist any form. On the next load the editor reads the content back from the `projectData` field.

## Media library (Level 1)

Implement the two ports and bind them. The bundle calls them; you decide where the files live (local disk, S3, a CDN).

```php
use OpenStudio\PageBuilderBundle\Contract\ImageUploadPortInterface;
use OpenStudio\PageBuilderBundle\Contract\ImageLibraryPortInterface;
use OpenStudio\PageBuilderBundle\Dto\ImageUploadResponse;
use OpenStudio\PageBuilderBundle\Dto\ImageRecord;

final readonly class ImageUploadAdapter implements ImageUploadPortInterface
{
    public function upload(UploadedFile $file, ?string $context = null, ?string $uploadedBy = null): ImageUploadResponse
    {
        // store $file, then return where it lives
        return new ImageUploadResponse(id: '...', url: '...', originalFileName: $file->getClientOriginalName());
    }

    public function delete(string $imageId): void { /* ... */ }
}
```

```yaml
# config/services.yaml
OpenStudio\PageBuilderBundle\Contract\ImageUploadPortInterface: '@App\PageBuilder\ImageUploadAdapter'
OpenStudio\PageBuilderBundle\Contract\ImageLibraryPortInterface: '@App\PageBuilder\ImageLibraryAdapter'
```

Mount the image endpoints under a prefix of your choice and pass a `context` to the component:

```yaml
# config/routes/page_builder.yaml
openstudio_page_builder:
    resource: '@OpenStudioPageBuilderBundle/config/routes.php'
    prefix: /admin/page-builder
```

```twig
{{ component('PageBuilder', { form: form, context: page.id }) }}
```

The `context` is an opaque string. The bundle forwards it to the ports and to the listing endpoint so you can scope images to a page, a tenant or anything else.

## Server-rendered blocks (Level 2)

Some blocks render their HTML on the server. The editor sends `POST { templateName, parameters }` to a `render-template` endpoint and expects `{ "content": "<html>" }`. The bundle does not provide this endpoint; you own it and you own the template allowlist.

```php
#[Route('/admin/page-builder/render-template', methods: ['POST'])]
final class PageBuilderRenderController extends AbstractController
{
    private const ALLOWED = [
        'cta_button' => 'page_builder/blocks/cta_button.html.twig',
    ];

    public function __invoke(Request $request): JsonResponse
    {
        $payload = $request->toArray();
        $template = (string) ($payload['templateName'] ?? '');

        if (!isset(self::ALLOWED[$template])) {
            return $this->json(['error' => 'Unknown template'], 400);
        }

        return $this->json([
            'content' => $this->renderView(self::ALLOWED[$template], (array) ($payload['parameters'] ?? [])),
        ]);
    }
}
```

Point `render_template_endpoint` at this route through the bundle configuration, then wire your block with `twigRendererFactory` (exported from `@openstudio/page-builder-bundle/scripts/grapesjs/utils/index.js`).

## Configuration

```yaml
# config/packages/openstudio_page_builder.yaml
openstudio_page_builder:
    app_stylesheet: '/build/app.css'      # stylesheet injected into the editor canvas
    render_template_endpoint: null         # URL for server-rendered blocks
    palette: ['#000000', '#ffffff']        # colors offered by the color picker
    icons:                                 # icon set for the icon block and icon traits
        - { name: 'star', svg: '<svg>...</svg>' }
```

All keys are optional. The bundle ships a static config provider; replace it by binding your own `PageBuilderConfigProviderInterface` when you need per-context configuration.

## Security

The bundle ships no firewall and no access control. Its endpoints are plain routes, mounted under the prefix you chose. Secure that prefix with your `access_control`:

```yaml
# config/packages/security.yaml
access_control:
    - { path: ^/admin/page-builder, roles: ROLE_ADMIN }
```

The endpoints validate file size and type on their own. The `render-template` endpoint is yours, so its template allowlist and input validation are your responsibility.

## License

Proprietary. OpenStudio.

<?php

declare(strict_types=1);

namespace App\Controller;

use App\Form\PageType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class PageBuilderDemoController extends AbstractController
{
    #[Route('/', name: 'demo_page_builder', methods: ['GET', 'POST'])]
    public function __invoke(Request $request): Response
    {
        $storage = $this->getParameter('kernel.project_dir').'/var/page.json';
        $stored = is_file($storage) ? json_decode((string) file_get_contents($storage), true) : [];

        $form = $this->createForm(PageType::class, $stored);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            file_put_contents($storage, json_encode($form->getData(), \JSON_THROW_ON_ERROR));

            return $this->redirectToRoute('demo_page_builder');
        }

        return $this->render('page_builder/index.html.twig', ['form' => $form->createView()]);
    }
}

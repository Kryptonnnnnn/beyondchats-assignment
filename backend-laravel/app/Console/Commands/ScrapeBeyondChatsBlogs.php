<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Symfony\Component\DomCrawler\Crawler;
use App\Models\Article;

class ScrapeBeyondChatsBlogs extends Command
{
    protected $signature = 'scrape:beyondchats';
    protected $description = 'Scrape 5 oldest blogs from BeyondChats';

    public function handle()
    {
        $this->info('Fetching blog list...');

        $url = 'https://beyondchats.com/blogs/';
        $html = Http::get($url)->body();
        $crawler = new Crawler($html);

        // Collect blog links safely
        $links = $crawler->filter('a')->each(fn ($node) => $node->attr('href'));
        $articleLinks = array_values(array_filter($links, fn ($l) =>
            $l && str_starts_with($l, 'https://beyondchats.com/blogs/')
        ));

        // Take last 5 (oldest)
        $articleLinks = array_slice(array_unique($articleLinks), -5);

        foreach ($articleLinks as $link) {
            if (Article::where('source_url', $link)->exists()) {
                continue;
            }

            $this->info("Scraping: $link");

            $articleHtml = Http::get($link)->body();
            $articleCrawler = new Crawler($articleHtml);

            // 🛡 SAFE title extraction
            $title = $articleCrawler->filter('title')->count()
                ? trim($articleCrawler->filter('title')->text())
                : 'Untitled Article';

            // 🛡 SAFE content extraction
            $paragraphs = $articleCrawler->filter('p')->each(
                fn ($p) => trim($p->text())
            );

            if (empty($paragraphs)) {
                $this->warn("No content found, skipping...");
                continue;
            }

            Article::create([
                'title' => $title,
                'content' => implode("\n\n", $paragraphs),
                'source_url' => $link,
                'version' => 'original'
            ]);
        }

        $this->info('BeyondChats blogs scraped successfully.');
    }
}

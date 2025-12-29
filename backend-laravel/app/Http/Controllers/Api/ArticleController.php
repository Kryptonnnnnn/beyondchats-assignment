<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    // Get all articles
    public function index()
    {
        return response()->json(
            Article::orderBy('created_at', 'desc')->get()
        );
    }

    // Get latest article
    public function latest()
    {
        return response()->json(
            Article::orderBy('created_at', 'desc')->first()
        );
    }

    // Get single article
    public function show($id)
    {
        return response()->json(
            Article::findOrFail($id)
        );
    }

    // Store article (used by NodeJS LLM)
    public function store(Request $request)
    {
        $article = Article::create([
            'title' => $request->title,
            'content' => $request->content,
            'version' => $request->version ?? 'updated',
            'references' => $request->references ?? [],
            'source_url' => $request->source_url,
        ]);

        return response()->json($article, 201);
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleNextJsRequests
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if this is a Next.js RSC request
        if ($this->isNextJsRscRequest($request)) {
            // Don't process RSC requests through Laravel
            // These should be handled by Next.js server
            return response()->json([
                'error' => 'RSC requests should be handled by Next.js server',
                'message' => 'This endpoint is for API calls only. Please ensure your Next.js app is running on the correct port.'
            ], 400);
        }

        // Check if this is a Next.js static file request
        if ($this->isNextJsStaticRequest($request)) {
            // Don't process static file requests through Laravel
            return response()->json([
                'error' => 'Static file requests should be handled by Next.js server',
                'message' => 'Please ensure your Next.js app is running and serving static files.'
            ], 404);
        }

        $response = $next($request);

        // Add CORS headers for Next.js
        if ($this->shouldAddCorsHeaders($request)) {
            $response->headers->set('Access-Control-Allow-Origin', $this->getAllowedOrigin($request));
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, RSC, Next-Url, Next-Router-State-Tree, Next-Pathname-Index, Next-Action');
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
        }

        return $response;
    }

    /**
     * Check if this is a Next.js RSC request
     */
    private function isNextJsRscRequest(Request $request): bool
    {
        return $request->hasHeader('RSC') || 
               $request->hasHeader('Next-Router-State-Tree') ||
               $request->has('__flight__') ||
               str_contains($request->path(), '_next/flight');
    }

    /**
     * Check if this is a Next.js static file request
     */
    private function isNextJsStaticRequest(Request $request): bool
    {
        return str_starts_with($request->path(), '_next/') ||
               str_starts_with($request->path(), '__next/') ||
               str_contains($request->path(), '_next/static/');
    }

    /**
     * Check if we should add CORS headers
     */
    private function shouldAddCorsHeaders(Request $request): bool
    {
        $origin = $request->header('Origin');
        return in_array($origin, [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://agent-ai.test',
            'https://agent-ai.test',
        ]);
    }

    /**
     * Get allowed origin for the request
     */
    private function getAllowedOrigin(Request $request): string
    {
        $origin = $request->header('Origin');
        $allowedOrigins = [
            'http://localhost:3000',
            'http://127.0.0.1:3000', 
            'http://agent-ai.test',
            'https://agent-ai.test',
        ];

        return in_array($origin, $allowedOrigins) ? $origin : 'http://localhost:3000';
    }
}

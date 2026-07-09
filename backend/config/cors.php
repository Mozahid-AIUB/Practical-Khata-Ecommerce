<?php

// FRONTEND_URL supports a comma-separated list so local dev (localhost:3000)
// and the deployed Vercel URL can both reach this API, e.g.:
// FRONTEND_URL=https://practical-khata-ecommerce.vercel.app,http://localhost:3000
$allowedOrigins = array_map(
    'trim',
    explode(',', env('FRONTEND_URL', 'http://localhost:3000'))
);

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => $allowedOrigins,
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];

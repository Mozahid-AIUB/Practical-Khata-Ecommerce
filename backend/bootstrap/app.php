<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->statefulApi();

        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        // guest cart/checkout routes are identified by their own cart_session
        // cookie, not a Sanctum-authenticated session — CSRF protection here
        // would only add friction for zero benefit until customer accounts
        // (phase 6) start using session-authenticated Sanctum requests.
        $middleware->validateCsrfTokens(except: [
            'api/v1/cart*',
            'api/v1/orders*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

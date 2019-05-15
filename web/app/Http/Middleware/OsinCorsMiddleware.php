<?php

namespace App\Http\Middleware;

use Closure;

class OsinCorsMiddleware {

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next) {
//        return $next($request)
//                        ->header('Access-Control-Allow-Origin', '*')
//                        ->header("Access-Control-Allow-Headers", "Content-Type, Authorization")
//                        ->header('X-Powered-By', 'Nitin Kumar Soni')
//                        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
         return $next($request)->header('X-Powered-By', 'Nitin')
                        ->header('Access-Control-Allow-Origin', '*')
                        ->header('Access-Control-Allow-Headers', 'Content-Type, x-xsrf-token, text/html, x_csrftoken')
                 ->header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS'); 
    }

}

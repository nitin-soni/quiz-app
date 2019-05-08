<?php

namespace Themes\SbAdmin\Providers;

use Caffeinated\Themes\Support\ServiceProvider;

class ThemeServiceProvider extends ServiceProvider
{
    public function boot()
    {
        parent::boot();

        //
    }

    public function register()
    {
        $this->app->register(RouteServiceProvider::class);
    }
}

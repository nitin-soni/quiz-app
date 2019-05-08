<?php

namespace App\Modules\Auth\Providers;

use Caffeinated\Modules\Support\ServiceProvider;

class ModuleServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the module services.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadTranslationsFrom(module_path('auth', 'Resources/Lang', 'app'), 'auth');
        $this->loadViewsFrom(module_path('auth', 'Resources/Views', 'app'), 'auth');
        $this->loadMigrationsFrom(module_path('auth', 'Database/Migrations', 'app'), 'auth');
        $this->loadConfigsFrom(module_path('auth', 'Config', 'app'));
        $this->loadFactoriesFrom(module_path('auth', 'Database/Factories', 'app'));
    }

    /**
     * Register the module services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->register(RouteServiceProvider::class);
    }
}

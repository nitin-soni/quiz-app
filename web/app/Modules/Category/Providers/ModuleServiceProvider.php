<?php

namespace App\Modules\Category\Providers;

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
        $this->loadTranslationsFrom(module_path('category', 'Resources/Lang', 'app'), 'category');
        $this->loadViewsFrom(module_path('category', 'Resources/Views', 'app'), 'category');
        $this->loadMigrationsFrom(module_path('category', 'Database/Migrations', 'app'), 'category');
        $this->loadConfigsFrom(module_path('category', 'Config', 'app'));
        $this->loadFactoriesFrom(module_path('category', 'Database/Factories', 'app'));
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

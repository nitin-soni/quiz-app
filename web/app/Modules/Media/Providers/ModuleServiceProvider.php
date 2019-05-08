<?php

namespace App\Modules\Media\Providers;

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
        $this->loadTranslationsFrom(module_path('media', 'Resources/Lang', 'app'), 'media');
        $this->loadViewsFrom(module_path('media', 'Resources/Views', 'app'), 'media');
        $this->loadMigrationsFrom(module_path('media', 'Database/Migrations', 'app'), 'media');
        $this->loadConfigsFrom(module_path('media', 'Config', 'app'));
        $this->loadFactoriesFrom(module_path('media', 'Database/Factories', 'app'));
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

<?php

namespace App\Modules\User\Providers;

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
        $this->loadTranslationsFrom(module_path('user', 'Resources/Lang', 'app'), 'user');
        $this->loadViewsFrom(module_path('user', 'Resources/Views', 'app'), 'user');
        $this->loadMigrationsFrom(module_path('user', 'Database/Migrations', 'app'), 'user');
        $this->loadConfigsFrom(module_path('user', 'Config', 'app'));
        $this->loadFactoriesFrom(module_path('user', 'Database/Factories', 'app'));
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

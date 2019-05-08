<?php

namespace App\Modules\Package\Providers;

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
        $this->loadTranslationsFrom(module_path('package', 'Resources/Lang', 'app'), 'package');
        $this->loadViewsFrom(module_path('package', 'Resources/Views', 'app'), 'package');
        $this->loadMigrationsFrom(module_path('package', 'Database/Migrations', 'app'), 'package');
        $this->loadConfigsFrom(module_path('package', 'Config', 'app'));
        $this->loadFactoriesFrom(module_path('package', 'Database/Factories', 'app'));
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

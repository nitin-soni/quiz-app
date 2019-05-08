<?php

namespace App\Modules\Quiz\Providers;

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
        $this->loadTranslationsFrom(module_path('quiz', 'Resources/Lang', 'app'), 'quiz');
        $this->loadViewsFrom(module_path('quiz', 'Resources/Views', 'app'), 'quiz');
        $this->loadMigrationsFrom(module_path('quiz', 'Database/Migrations', 'app'), 'quiz');
        $this->loadConfigsFrom(module_path('quiz', 'Config', 'app'));
        $this->loadFactoriesFrom(module_path('quiz', 'Database/Factories', 'app'));
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

<?php

namespace App\Providers\Filament;

use App\Filament\Widgets\CctvAlertTableWidget;
use App\Filament\Widgets\CctvStatsOverviewWidget;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\View\PanelsRenderHook;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\HtmlString;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->colors([
                'primary' => Color::Emerald,
            ])
            ->viteTheme('resources/css/filament/admin/theme.css')
            ->brandName('Sentinel DMK')
            ->brandLogo(new HtmlString('
                <span class="fi-logo-sync">
                    <svg class="fi-logo-sync-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="4" y="4" width="40" height="40" rx="10" fill="#10B981"/>
                        <path d="M16 14h16v6l-8 14h8" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="fi-logo-sync-text">
                        <span class="fi-logo-sync-title">SENTINEL</span>
                        <span class="fi-logo-sync-sub">DMK</span>
                    </span>
                </span>
            '))
            ->brandLogoHeight('1.75rem')
            ->favicon(asset('images/logo.svg'))
            ->topbar(false)
            ->sidebarCollapsibleOnDesktop()
            ->sidebarWidth('16rem')
            ->collapsibleNavigationGroups()
            ->renderHook(PanelsRenderHook::SIDEBAR_LOGO_BEFORE, fn (): string => '
<div style="display:flex;align-items:center;width:100%">
    <div x-on:click="$store.sidebar.open()" class="fi-sidebar-logo-toggle" style="cursor:pointer;display:inline-flex;align-items:center;justify-content:center;position:relative;width:28px;height:28px">
        <svg class="fi-logo-toggle-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="40" height="40" rx="10" fill="#10B981"/>
            <path d="M16 14h16v6l-8 14h8" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>')
            ->renderHook(PanelsRenderHook::SIDEBAR_LOGO_AFTER, fn (): string => '
        <svg class="fi-sidebar-expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M15 3v18"/>
            <path d="m8 9 3 3-3 3"/>
        </svg>
    </div>
    <button x-on:click="$store.sidebar.close()" class="fi-sidebar-collapse-btn" style="cursor:pointer;display:flex;align-items:center;justify-content:center;background:none;border:none;padding:3px;border-radius:6px;flex-shrink:0;width:28px;height:28px;margin-left:auto;transition:all 0.15s ease;color:rgba(255,255,255,0.35)">
        <svg class="fi-collapse-default" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M15 3v18"/>
        </svg>
        <svg class="fi-collapse-hover" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" style="display:none">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M15 3v18"/>
            <path d="m10 9-3 3 3 3"/>
        </svg>
    </button>
</div>')
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                \App\Filament\Pages\Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->widgets([
                CctvStatsOverviewWidget::class,
                CctvAlertTableWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                PreventRequestForgery::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}

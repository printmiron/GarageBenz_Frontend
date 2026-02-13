import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { CitasClienteComponent } from './pages/dash-cliente/citas-cliente/citas-cliente.component';
import { ReparacionesClienteComponent } from './pages/dash-cliente/reparaciones-cliente/reparaciones-cliente.component';
import { VehiculoListComponent } from './pages/dash-cliente/vehiculo-list/vehiculo-list.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AgendaDiariaComponent } from './pages/dash-trabajador/agenda-diaria/agenda-diaria.component';
import { OrdenesDeTrabajoComponent } from './pages/dash-trabajador/ordenes-de-trabajo/ordenes-de-trabajo.component';
import { StockComponent } from './pages/stock/stock.component';
import { FacturacionComponent } from './pages/dash-administrador/facturacion/facturacion.component';
import { GestionUsuarioListComponent } from './pages/dash-administrador/gestion-usuario-list/gestion-usuario-list.component';
import { roleGuard } from './guards/role-guard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'landingPage' },

    { path: 'landingPage', component: LandingPageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registro', loadComponent: () => import('./pages/registro/registro').then(m => m.RegistroComponent) },


    {
        path: 'dashboard-cliente', component: HomeComponent, canActivate: [roleGuard, authGuard], data: { role: 'cliente' }, children: [

            { path: 'citas', component: CitasClienteComponent },
            { path: 'reparaciones', component: ReparacionesClienteComponent },
            { path: 'vehiculos', component: VehiculoListComponent },
            { path: 'perfil', component: ProfileComponent },
            { path: '', redirectTo: 'dashboard-cliente', pathMatch: 'full' }
        ]
    },
    {
        path: 'dashboard-trabajador', component: HomeComponent, canActivate: [roleGuard, authGuard], data: { role: 'trabajador' }, children: [

            { path: 'agenda', component: AgendaDiariaComponent },
            { path: 'ordenes', component: OrdenesDeTrabajoComponent },
            { path: 'stock', component: StockComponent },
            { path: 'perfil', component: ProfileComponent },
            { path: '', redirectTo: 'dashboard-trabajador', pathMatch: 'full' }
        ]
    },
    {
        path: 'dashboard-administrador', component: HomeComponent, canActivate: [roleGuard, authGuard], data: { role: 'administrador' }, children: [

            { path: 'facturacion', component: FacturacionComponent },
            { path: 'usuarios', component: GestionUsuarioListComponent },
            { path: 'stock', component: StockComponent },
            { path: 'perfil', component: ProfileComponent },
            { path: '', redirectTo: 'dashboard-administrador', pathMatch: 'full' }
        ]
    },


    { path: "**", redirectTo: "landingPage" }

];

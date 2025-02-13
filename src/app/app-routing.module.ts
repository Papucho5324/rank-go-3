import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Página inicial: Landing
  {
    path: '',
    loadChildren: () => import('./auth/landing/landing.module').then(m => m.LandingPageModule)
  },
  // Autenticación: Login y Signup
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./auth/signup/signup.module').then(m => m.SignupPageModule)
  },
  // Sección autenticada: Tabs
  {
    path: 'app',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),  canActivate: [AuthGuard]
  },
  // Si no encuentra ruta, redirige a Landing
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

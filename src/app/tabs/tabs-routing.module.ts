import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'concursantes',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule), canActivate: [AuthGuard]
      },
      {
        path: 'evaluar',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule), canActivate: [AuthGuard]
      },
      {
        path: 'resultados',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule), canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: 'evaluar',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}

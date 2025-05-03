import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardsService } from './guards/guards.service';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },

  {
    path: 'chamados',
    loadChildren: () => import('./chamados/chamados.module').then(m => m.ChamadosModule),
    canActivate: [GuardsService]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

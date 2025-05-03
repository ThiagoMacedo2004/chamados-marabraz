import { OcorrenciasModule } from './ocorrencias/ocorrencias.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChamadosComponent } from './chamados.component';
import { LojasComponent } from './lojas/lojas.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { MicrosComponent } from './micros/micros.component';
import { GuardsService } from '../guards/guards.service';


const routes: Routes = [
  {
    path: '',
    component: ChamadosComponent,
    children: [

      {
        path: 'ocorrencias',
        loadChildren: () => import('./ocorrencias/ocorrencias.module').then(m => m.OcorrenciasModule),
        canActivate: [GuardsService]
      },

      {
        path: 'lojas',
        component: LojasComponent
      },

      {
        path: 'usuarios',
        component: UsuariosComponent
      },

      {
        path: 'micros',
        component: MicrosComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChamadosRoutingModule { }

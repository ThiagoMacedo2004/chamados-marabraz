import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChamadosRoutingModule } from './chamados-routing.module';
import { LojasComponent } from './lojas/lojas.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AppMaterialModule } from '../shared/app-material/app-material.module';
import { ChamadosComponent } from './chamados.component';
import { MicrosComponent } from './micros/micros.component';
import { TabelaMicrosComponent } from './micros/tabela-micros/tabela-micros.component';


@NgModule({
  declarations: [
    LojasComponent,
    UsuariosComponent,
    ChamadosComponent,
    MicrosComponent,
    TabelaMicrosComponent

  ],
  imports: [
    CommonModule,
    ChamadosRoutingModule,
    AppMaterialModule
  ]
})
export class ChamadosModule { }

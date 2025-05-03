import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OcorrenciasRoutingModule } from './ocorrencias-routing.module';

import { GerarOcorrenciaComponent } from './gerar-ocorrencia/gerar-ocorrencia.component';
import { OcorrenciasComponent } from './ocorrencias.component';
import { TabelaOcorrenciasComponent } from './tabela-ocorrencias/tabela-ocorrencias.component';
import { AppMaterialModule } from 'src/app/shared/app-material/app-material.module';
import { FormsModule } from '@angular/forms';
import { DetalheOcorrenciaComponent } from './detalhe-ocorrencia/detalhe-ocorrencia.component';
import { PesquisaOcorrenciaComponent } from './pesquisa-ocorrencia/pesquisa-ocorrencia.component';
import { OpcoesOcorrenciasComponent } from './opcoes-ocorrencias/opcoes-ocorrencias.component';
import { DialogLojasComponent } from './gerar-ocorrencia/dialog-lojas/dialog-lojas.component';
import { DialogOpcoesOcComponent } from './opcoes-ocorrencias/dialog-opcoes-oc/dialog-opcoes-oc.component';


@NgModule({
  declarations: [
    TabelaOcorrenciasComponent,
    GerarOcorrenciaComponent,
    OcorrenciasComponent,
    DetalheOcorrenciaComponent,
    PesquisaOcorrenciaComponent,
    OpcoesOcorrenciasComponent,
    DialogLojasComponent,
    DialogOpcoesOcComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    OcorrenciasRoutingModule,
    AppMaterialModule
  ]
})
export class OcorrenciasModule { }

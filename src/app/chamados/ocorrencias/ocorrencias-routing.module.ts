import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GerarOcorrenciaComponent } from './gerar-ocorrencia/gerar-ocorrencia.component';
import { OcorrenciasComponent } from './ocorrencias.component';
import { TabelaOcorrenciasComponent } from './tabela-ocorrencias/tabela-ocorrencias.component';
import { DetalheOcorrenciaComponent } from './detalhe-ocorrencia/detalhe-ocorrencia.component';
import { PesquisaOcorrenciaComponent } from './pesquisa-ocorrencia/pesquisa-ocorrencia.component';
import { OpcoesOcorrenciasComponent } from './opcoes-ocorrencias/opcoes-ocorrencias.component';

const routes: Routes = [
  {
    path: '',
    component: OcorrenciasComponent,
    children: [
      {
        path: 'gerar-ocorrencia',
        component: GerarOcorrenciaComponent
      },

      {
        path: 'tabela-ocorrencias',
        component: TabelaOcorrenciasComponent
      },

      // {
      //   path: 'tabelaPesquisaOc',
      //   component: PesquisaOcorrenciaComponent
      // },

      {
        path: 'detalheOcorrencia',
        component: DetalheOcorrenciaComponent
      },

      {
        path: 'opcoesOcorrencia',
        component: OpcoesOcorrenciasComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OcorrenciasRoutingModule { }

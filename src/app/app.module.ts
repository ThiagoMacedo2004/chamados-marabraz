import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {HttpClientModule} from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { DialogNovaLojaComponent } from './dialogs/dialog-nova-loja/dialog-nova-loja.component';
import {MatButtonModule} from '@angular/material/button';
import { AppMaterialModule } from './shared/app-material/app-material.module';
import { TextMaskModule } from 'angular2-text-mask';
import { DialogEditarLojaComponent } from './dialogs/dialog-editar-loja/dialog-editar-loja.component';
import { DialogNovoServicoLojaComponent } from './dialogs/dialog-novo-servico-loja/dialog-novo-servico-loja.component';
import { DialogMicrosComponent } from './dialogs/dialog-micros/dialog-micros.component';
import { DialogHistoricoMicroComponent } from './dialogs/dialog-historico-micro/dialog-historico-micro.component';
import { DialogMovimentarMicroComponent } from './dialogs/dialog-movimentar-micro/dialog-movimentar-micro.component';
import { FormsModule } from '@angular/forms';
import { DialogAdicionarMicroComponent } from './dialogs/dialog-adicionar-micro/dialog-adicionar-micro.component';
import { DialogEditarMicroComponent } from './dialogs/dialog-editar-micro/dialog-editar-micro.component';
import { DialogUsuarioComponent } from './dialogs/dialog-usuario/dialog-usuario.component';
import { DialogPesquisaOcComponent } from './dialogs/dialog-pesquisa-oc/dialog-pesquisa-oc.component';
import { DialogSubmotivoComponent } from './dialogs/dialog-submotivo/dialog-submotivo.component';
import { DialogDeletaOcorrenciaComponent } from './dialogs/dialog-deleta-ocorrencia/dialog-deleta-ocorrencia.component';



@NgModule({
  declarations: [
    AppComponent,
    DialogNovaLojaComponent,
    DialogEditarLojaComponent,
    DialogNovoServicoLojaComponent,
    DialogMicrosComponent,
    DialogHistoricoMicroComponent,
    DialogMovimentarMicroComponent,
    DialogAdicionarMicroComponent,
    DialogEditarMicroComponent,
    DialogUsuarioComponent,
    DialogPesquisaOcComponent,
    DialogSubmotivoComponent,
    DialogDeletaOcorrenciaComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    HttpClientModule,
    MatSnackBarModule,
    MatButtonModule,
    AppMaterialModule,
    TextMaskModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

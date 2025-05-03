import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { DialogUsuarioComponent } from '../dialogs/dialog-usuario/dialog-usuario.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lojas',
  templateUrl: './chamados.component.html',
  styleUrls: ['./chamados.component.css']
})
export class ChamadosComponent implements OnInit {

  menus = [
    {router: 'ocorrencias', icon: 'home', label: 'Ocorrências'},
    // {router: 'chamadosvivo', icon: 'rss_feed', label: 'Chamados Vivo'},
    {router: 'lojas', icon: 'store', label: 'Lojas'},
    {router: 'usuarios', icon: 'manage_accounts', label: 'Usuarios'},
    {router: 'micros', icon: 'computer', label: 'Micros'},

  ]


  user!:Usuarios

  constructor(
    private _services: LoginService,
    private _dialog: MatDialog,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.getUser()
  }

  getUser() {
    this.user = this._services.usuario

  }

  logout() {
    this._services.logOff()
  }

  dialogUsuario(acao: string) {
    console.log(this.user)
    this._dialog.open(DialogUsuarioComponent, {
      width: '60%',
      position: {
        top: '8%',
        left: '25%'
      },
      data: {
        acao: acao,
        data: this.user
      }
    })
  }

  redirect(caminho: string) {
    if(caminho === 'ocorrencias') {

      let url = this._router.routerState.snapshot.url
      if (url === '/chamados/ocorrencias' || url === '/chamados/ocorrencias/gerar-ocorrencia' || '/chamados/ocorrencias/tabela-ocorrencias') {
        this._router.navigate(['/chamados/ocorrencias/tabela-ocorrencias'])
      }
    }
  }

}


interface Usuarios {
  ID: number,
  MATRICULA: number,
  NOME: string,
  SENHA: string,
  EMAIL: string,
  DATE_CREATE: Date,
  DATE_BLOCK: Date,
  STATUS: string
}

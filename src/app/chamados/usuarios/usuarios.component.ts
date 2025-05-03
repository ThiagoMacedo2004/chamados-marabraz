import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogUsuarioComponent } from 'src/app/dialogs/dialog-usuario/dialog-usuario.component';
import { LoginService } from 'src/app/login/login.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  dataSource= new MatTableDataSource<Usuarios>()
  columnsToDisplay: string[] = ['ID', 'MATRICULA', 'NOME','EMAIL']
  columnsWitchDate: string[] = [...this.columnsToDisplay,'DATE_CREATE', 'DATE_BLOCK', 'STATUS', 'ACAO']
  btnVisivel: boolean = true

  constructor(
    private _service: LoginService,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if(this._service.usuario.MATRICULA != '217314' ) {
      this.columnsWitchDate = [...this.columnsToDisplay,'DATE_CREATE', 'DATE_BLOCK', 'STATUS']
      this.btnVisivel = false
    }
    this.getusuarios()
  }

  getusuarios() {
    this._service.getUsuarios().subscribe(
      (result: any) => {
        console.log(result)
        this.setData(result)
      }
    )
  }

  alterarStatusUsuario(id: number, status: string) {
    const obj = {
      acao: 'alterarStatusUsuario',
      id: id,
      status: status
    }

    this._service.alterarStatusUsuario(JSON.stringify(obj)).subscribe(
      (result: any) => {
        if(result.sucesso) {
          this._service.msg('Usuário editado !')
          this.getusuarios()
        }
      }
    )
  }

  dialogUsuario(acao: string, data: Usuarios | string) {
    this._dialog.open(DialogUsuarioComponent, {
      width: '60%',
      position: {
        top: '8%',
        left: '25%'
      },
      data: {
        acao: acao,
        data: data
      }
    }).afterClosed().subscribe(
      (result: any) => {
        if(result) {
          this.getusuarios()
        }
      }
    )
  }

  setData(data: Usuarios[]) {
    this.dataSource.data = data

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

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

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { MatTableDataSource } from '@angular/material/table';
import { DialogSubmotivoComponent } from 'src/app/dialogs/dialog-submotivo/dialog-submotivo.component';
import { LoginService } from 'src/app/login/login.service';
import { DialogOpcoesOcComponent } from './dialog-opcoes-oc/dialog-opcoes-oc.component';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-opcoes-ocorrencias',
  templateUrl: './opcoes-ocorrencias.component.html',
  styleUrls: ['./opcoes-ocorrencias.component.css']
})
export class OpcoesOcorrenciasComponent implements OnInit {

  dataSource = new MatTableDataSource<Submotivo>()
  columnsToDisplay = ['submotivo', 'acao'];



  motivos:any[] = []
  subMotivos: any[] = []
  listSubmotivos: boolean = false
  motivoSelecionado!: any

  constructor(
    private _service: LoginService,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getMotivos()

  }

  getMotivos() {
    this._service.getMotivos().subscribe(
      (result: any) => {
        this.motivos = result
        this.motivoSelecionado = this.motivos[0]
        this.getSubmotivos(this.motivos[0].id)
      }
    )
  }

  changeMotivo(event: MatSelectChange ) {

    let idMotivo = event.value

    console.log(idMotivo)

    // let idMotivo = event.selectedOptions.selected[0]?.value

    this.motivoSelecionado = this.motivos.filter((i:any) => i.id === idMotivo)[0]

    if(idMotivo) {
      this.getSubmotivos(idMotivo)
    } else {
      this.subMotivos = []
      this.dataSource.data = []
    }
  }

  getSubmotivos(idMotivo: any) {
    this._service.getSubMotivos(idMotivo).subscribe(
      (result: any) => {
        console.log(result)
        this.subMotivos = result
        this.listSubmotivos = true
        this.dataSource.data = this.subMotivos.sort((a:any, b:any) => a - b)

        if(this.subMotivos.length === 0) {
          this.listSubmotivos = false
        }
      }
    )
  }

  adicionarSubmotivo(motivo: any) {

    this._dialog.open(DialogOpcoesOcComponent,{
      data: motivo,
      width: '22%',
      position: {
        top: '12%',
        left: '44%'
      }
    }).afterClosed().subscribe(
      (result: any) => {
        if(result) {
          this.getSubmotivos(motivo.id)
        }
      }
    )
  }

}

export interface Submotivo {
  id: string,
  submotivo: string
}

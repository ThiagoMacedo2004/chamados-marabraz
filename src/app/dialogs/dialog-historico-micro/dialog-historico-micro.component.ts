import { Micros } from './../../chamados/lojas/lojas.component';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoginService } from 'src/app/login/login.service';

@Component({
  selector: 'app-dialog-historico-micro',
  templateUrl: './dialog-historico-micro.component.html',
  styleUrls: ['./dialog-historico-micro.component.css']
})
export class DialogHistoricoMicroComponent implements OnInit {

  dataSource = new MatTableDataSource<HistoricoMicro>();
  columnsToDisplay:string[] = ['SERVICE_TAG', 'ASSET_TAG', 'FABRICANTE', 'MODELO', 'ANALISTA', 'OBSERVACAO'];
  columnsToDisplayWithacao = ['MOVIMENTACAO', ...this.columnsToDisplay, 'DATA', 'STATUS'];

  constructor(
    private _dialogRef: MatDialogRef<DialogHistoricoMicroComponent>,
    private _service: LoginService,
    @Inject(MAT_DIALOG_DATA) public data: Micros
  ) { }

  ngOnInit(): void {
    this._dialogRef.disableClose = true
    this.getHistoricoMicro(this.data.ID_MICRO)
  }

  getHistoricoMicro(idMicro: any) {
    this._service.getHistoricoMicro(parseInt(idMicro)).subscribe(
      (result: HistoricoMicro[]) => {
        this.redefinirDialog(result)
        this.dataSource.data = result

      }
    )
  }

  redefinirDialog(result: HistoricoMicro[]) {
    if(result.length === 0) {
      this._dialogRef.updateSize('38%')
      this._dialogRef.updatePosition({
        left: '38%'
      })
    }
  }
}

interface HistoricoMicro {
  ANALISTA   : string,
  ASSET_TAG  : string,
  DATA       : Date,
  FABRICANTE : string,
  LOJA_ANTIGA: string,
  LOJA_NOVA  : string,
  ID_LOJA    : number,
  ID_MICRO   : number,
  ID         : number,
  ID_USUARIO : number,
  MODELO     : string,
  OBSERVACAO : string,
  SERVICE_TAG: string,
  STATUS     : string,
}

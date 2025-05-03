import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Micros } from 'src/app/chamados/lojas/lojas.component';
import { LoginService } from 'src/app/login/login.service';
import { DialogHistoricoMicroComponent } from '../dialog-historico-micro/dialog-historico-micro.component';
import { DialogMovimentarMicroComponent } from '../dialog-movimentar-micro/dialog-movimentar-micro.component';
import { DialogEditarMicroComponent } from '../dialog-editar-micro/dialog-editar-micro.component';

@Component({
  selector: 'app-dialog-micros',
  templateUrl: './dialog-micros.component.html',
  styleUrls: ['./dialog-micros.component.css']
})
export class DialogMicrosComponent implements OnInit {

  dataSource = new MatTableDataSource<Micros>();
  columnsToDisplay:string[] = ['LOJA', 'SERVICE_TAG', 'ASSET_TAG', 'FABRICANTE', 'MODELO', 'STATUS', 'ID_MICRO'];
  columnsToDisplayWithacao = [...this.columnsToDisplay, 'acao'];

  constructor(
    private _service: LoginService,
    private _fb: FormBuilder,
    private _dialog: MatDialog,
    private _dialoRef: MatDialogRef<DialogMicrosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this._dialoRef.disableClose = true
    this.dataSource.data = this.data.micros
    this.redimencionar()
  }

  historicoMicro(micro:Micros) {
    this._dialog.open(DialogHistoricoMicroComponent, {
      data: micro,
      width: '80%',
      position: {
        left: '17%',
        top: '10%'
      }
    })
  }

  movimentarMicro(micro:Micros) {
    console.log(micro)
    this._dialog.open(DialogMovimentarMicroComponent, {
      data: micro,
      width: '50%',
      position: {
        top: '4%',
        left: '31%'
      }
    }).afterClosed().subscribe(
      (result: any) => {
        if(result) {
          this._dialoRef.close(result)
        }
      }
    )
  }

  editarMicro(micro: Micros) {
    this._dialog.open(DialogEditarMicroComponent, {
      data: micro
    }).afterClosed().subscribe(
      (result:any) => {
        if(result) {
          this._dialoRef.close('ok')
        }
      }
    )
  }

  redimencionar() {
    if(this.dataSource.data.length == 0) {
      this._dialoRef.updateSize('35%')
      this._dialoRef.updatePosition({
        left: '37%',
        top: '12%'
      })
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

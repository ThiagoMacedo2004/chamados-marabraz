import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginService } from 'src/app/login/login.service';

@Component({
  selector: 'app-dialog-deleta-ocorrencia',
  templateUrl: './dialog-deleta-ocorrencia.component.html',
  styleUrls: ['./dialog-deleta-ocorrencia.component.css']
})
export class DialogDeletaOcorrenciaComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _service: LoginService,
    private _dialog: MatDialog,
    private _dialogRef: MatDialogRef<DialogDeletaOcorrenciaComponent>
  ) { }

  ngOnInit(): void {
    this._dialogRef.disableClose = true
  }

  detelaOcorrencia() {

    const obj = {
      acao: 'deletaOcorrencia',
      idOcorrencia: this.data.ID,
      ocorrencia: this.data.OCORRENCIA

    }

    this._service.deletaOcorrencia(JSON.stringify(obj)).subscribe(
      (result: any) => {
        if(result.sucesso) {
          this._service.msg(result.sucesso)
          this._dialogRef.close(result)
        } else {
          this._service.msg(result.erro)
        }
      }
    )
  }

}

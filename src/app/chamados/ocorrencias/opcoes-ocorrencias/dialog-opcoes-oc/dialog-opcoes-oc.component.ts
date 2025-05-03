import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoginService } from 'src/app/login/login.service';
import { MyErrorStateMatcher } from 'src/app/shared/erros-form';

@Component({
  selector: 'app-dialog-opcoes-oc',
  templateUrl: './dialog-opcoes-oc.component.html',
  styleUrls: ['./dialog-opcoes-oc.component.css']
})
export class DialogOpcoesOcComponent implements OnInit {

  formGroup!: UntypedFormGroup
  matcher = new MyErrorStateMatcher();

  constructor(
    private _fb: UntypedFormBuilder,
    private _service: LoginService,
    private _dialogRef: MatDialogRef<DialogOpcoesOcComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.formulario()
  }

   formulario() {
      this.formGroup = this._fb.group({
        acao: 'adicionaSubmomtivo',
        submotivo: ['', Validators.required],
        idMotivo: [this.data.id]
      })
    }

    adicionaSubmomtivo() {
      this._service.adicionaSubmomtivo(JSON.stringify(this.formGroup.value)).subscribe(
        (result: any) => {
          if(result.erro) {
            this._service.msg(result.erro)
          } else {
            this._service.msg(result.sucesso)
            this._dialogRef.close(result.sucesso)
          }

        }
      )
    }

}

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoginService } from 'src/app/login/login.service';
import { MyErrorStateMatcher } from 'src/app/shared/erros-form';

@Component({
  selector: 'app-dialog-submotivo',
  templateUrl: './dialog-submotivo.component.html',
  styleUrls: ['./dialog-submotivo.component.css']
})
export class DialogSubmotivoComponent implements OnInit {

  formGroup!: FormGroup
  matcher = new MyErrorStateMatcher();

  constructor(
    private _service: LoginService,
    private _dialoRef: MatDialogRef<DialogSubmotivoComponent>,
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.formulario()
    console.log(this.data)
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
          this._dialoRef.close(result.sucesso)
        }

      }
    )
  }

}

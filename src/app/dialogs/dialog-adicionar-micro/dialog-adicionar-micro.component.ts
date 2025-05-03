import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { Lojas } from 'src/app/chamados/lojas/lojas.component';
import { LoginService } from 'src/app/login/login.service';
import { MyErrorStateMatcher } from 'src/app/shared/erros-form';

@Component({
  selector: 'app-dialog-adicionar-micro',
  templateUrl: './dialog-adicionar-micro.component.html',
  styleUrls: ['./dialog-adicionar-micro.component.css']
})
export class DialogAdicionarMicroComponent implements OnInit {

  filterLojas: Lojas[] = [];
  lojas: Lojas[] = []
  formGroup!: UntypedFormGroup
  matcher = new MyErrorStateMatcher();

  myModel       = ''
  mask          = [ /\d/, /\d/, '.', /\d/, /\d/, /\d/]

  constructor(
    private _service: LoginService,
    private _fb: UntypedFormBuilder,
    private _router: Router,
    private _dialoRef: MatDialogRef<DialogAdicionarMicroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.getLojas()
  }

  ngOnInit(): void {

    this.formulario()
    this._dialoRef.disableClose = true

    this.formGroup.get('LOJA')!.valueChanges.subscribe(
      loja => this.filterLojas = this.filtrandoLojas(loja || '')
    )


  }

  formulario() {
    this.formGroup = this._fb.group({
      acao       : ['adicionarMicro'],
      LOJA       : ['', Validators.required],
      ID_LOJA    : [''],
      ASSET_TAG  : ['', Validators.required],
      SERVICE_TAG: ['', Validators.required],
      FABRICANTE : [{value: 'Dell Inc.', disabled: true}, Validators.required],
      MODELO     : [{value: 'Optiplex 3080', disabled: true}, Validators.required],
      STATUS     : ['', Validators.required]
    })
  }

  getLojas() {
    this._service.getLojas().subscribe(
      (data:Lojas[]) => {
        this.lojas = data
        this.filterLojas = data
      }
    )
  }

  getIdLoja() {
    let idLoja = this.lojas.filter(loja => loja.LOJA === this.formGroup.get('LOJA')!.value)

    if(!idLoja || idLoja.length === 0) {
      return this._service.msg("Selecione uma loja válida !")
    }

    return idLoja[0].ID
  }

  adicionarMicro() {
    this.formGroup.get('ID_LOJA')?.reset(this.getIdLoja())
    this.formGroup.get('MODELO')?.reset({value: 'Optiplex 3080', disabled: false}, Validators.required)
    this.formGroup.get('FABRICANTE')?.reset({value: 'Dell Inc.', disabled: false}, Validators.required)

    const obj = this.formGroup.value

    this._service.adicionarMicro(obj).subscribe(
      (result: any) => {
        if(result.erro) {
          this._service.msg(result.erro)
        } else {
          this._service.msg(result.sucesso)

          this._dialoRef.close('OK')
        }
      }
    )
  }

  filtrandoLojas(value: string): Lojas[] {
    const filterLoja = value.toLowerCase()

    return this.lojas.filter(loja => loja.LOJA.toLowerCase().includes(filterLoja))
  }

}

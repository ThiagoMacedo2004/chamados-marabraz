import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { Lojas } from 'src/app/chamados/lojas/lojas.component';
import { LoginService } from 'src/app/login/login.service';
import { MyErrorStateMatcher } from 'src/app/shared/erros-form';
import { DialogAdicionarMicroComponent } from '../dialog-adicionar-micro/dialog-adicionar-micro.component';

@Component({
  selector: 'app-dialog-editar-micro',
  templateUrl: './dialog-editar-micro.component.html',
  styleUrls: ['./dialog-editar-micro.component.css']
})
export class DialogEditarMicroComponent implements OnInit {

  filterLojas!: Observable<Lojas[]>;
  lojas: Lojas[] = []
  formGroup!: FormGroup
  matcher = new MyErrorStateMatcher();

  myModel       = ''
  mask          = [ /\d/, /\d/, '.', /\d/, /\d/, /\d/]

  constructor(
    private _service: LoginService,
    private _fb: FormBuilder,
    private _dialog: MatDialog,
    private _dialoRef: MatDialogRef<DialogEditarMicroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.getLojas()
  }

  ngOnInit(): void {

    this.formulario()

    this._dialoRef.disableClose = true

    this.filterLojas = this.formGroup.get('LOJA')!.valueChanges.pipe(
      map(loja => this.filtrandoLojas(loja || ''))
    )

  }

  formulario() {
    this.formGroup = this._fb.group({
      acao       : ['editarMicro'],
      LOJA       : [{value: this.data.LOJA, disabled: true}, Validators.required],
      ID_LOJA    : [''],
      ID_MICRO   : [this.data.ID_MICRO],
      ASSET_TAG  : [this.data.ASSET_TAG, Validators.required],
      SERVICE_TAG: [this.data.SERVICE_TAG, Validators.required],
      FABRICANTE : [{value: 'Dell Inc.', disabled: true}, Validators.required],
      MODELO     : [{value: 'Optiplex 3080', disabled: true}, Validators.required],
      STATUS     : [this.data.STATUS, Validators.required]
    })
  }

  getLojas() {
    this._service.getLojas().subscribe(
      (data:Lojas[]) => this.lojas = data
    )
  }

  getIdLoja() {
    let idLoja = this.lojas.filter(loja => loja.LOJA === this.formGroup.get('LOJA')!.value)

    if(!idLoja || idLoja.length === 0) {
      return this._service.msg("Selecione uma loja válida !")
    }

    return idLoja[0].ID
  }

  editarMicro() {
    this.formGroup.get('ID_LOJA')?.reset(this.getIdLoja())
    this.formGroup.get('MODELO')?.reset({value: 'Optiplex 3080', disabled: false}, Validators.required)
    this.formGroup.get('FABRICANTE')?.reset({value: 'Dell Inc.', disabled: false}, Validators.required)

    const obj = this.formGroup.value

    console.log(this.formGroup.value)

    this._service.editarMicro(obj).subscribe(
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

import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { LoginService } from 'src/app/login/login.service';
import { MyErrorStateMatcher } from 'src/app/shared/erros-form';

@Component({
  selector: 'app-dialog-movimentar-micro',
  templateUrl: './dialog-movimentar-micro.component.html',
  styleUrls: ['./dialog-movimentar-micro.component.css']
})
export class DialogMovimentarMicroComponent implements OnInit {

  filterLojas!: Observable<Lojas[]>;
  lojas: Lojas[] = []
  lojaAtual!: string
  usuarioLogado: any
  formGroup!: UntypedFormGroup
  matcher = new MyErrorStateMatcher();

  constructor(
    private _service: LoginService,
    private _fb: UntypedFormBuilder,
    private _dialog: MatDialog,
    private _dialoRef: MatDialogRef<DialogMovimentarMicroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Micro
  ) {

  }

  ngOnInit(): void {
    this.lojaAtual = this.data.LOJA
    this._dialoRef.disableClose = true
    this.getUser()
    this.getLojas()
    this.formulario()

    this.filterLojas = this.formGroup.get('loja')!.valueChanges.pipe(
      startWith(''),
      map(loja => this.filtrandoLojas(loja || ''))
    )
  }

  formulario() {
    this.formGroup = this._fb.group({
      acao:      ['movimentacaoMicro'],
      idMicro:   [this.data.ID_MICRO],
      loja:      ['', Validators.required],
      idLojaNew: [''],
      idLojaOld: [this.data.ID_LOJA],
      idUsuario: [this.usuarioLogado.ID],
      observacao:['', Validators.required],
      data:      ['', Validators.required],
      status:    [this.data.STATUS]
    })
  }

  movimentacaoMicro() {
    this.formGroup.get('idLojaNew')?.reset(this.getIdLoja())
    this.formGroup.get('data')?.reset(this.getDate())

    if (this.formGroup.get('idLojaNew')?.value == '' || !this.formGroup.get('idLojaNew')?.value) {
      return this._service.msg('Selecione uma loja Valida !')
    }

    const obj = this.formGroup.value

    console.log(this.formGroup.value)

    this._service.movimentacaoMicro(JSON.stringify(obj)).subscribe(
      (result: any) => {
        if(result.sucesso) {
          this._service.msg(result.sucesso)
          this._dialoRef.close('OK')
        } else {
          this._service.msg(result.erro)
        }
      }
    )
  }

  getLojas() {
    this._service.getLojas().subscribe(
      (data:Lojas[]) => this.lojas = data
    )
  }

  getUser() {
    this.usuarioLogado = this._service.usuario
    console.log(this.usuarioLogado)
  }

  getDate() {
    let data = new Date(this.formGroup.get('data')?.value)

    let ano: any = data.getFullYear()
    let mes: any = (data.getMonth()) + 1
    let dia: any = data.getDate()

    if(mes <= 9) {
      mes = `0${mes}`
    }

    if(dia <= 9) {
      dia = `0${dia}`
    }

    return `${ano}-${mes}-${dia}`
  }

  getIdLoja() {
    let idLoja = this.lojas.filter(loja => loja.LOJA === this.formGroup.get('loja')!.value)

    if(!idLoja || idLoja.length === 0) {
      return this._service.msg("Selecione uma loja válida !")
    }

    return idLoja[0].ID
  }

  filtrandoLojas(value: string): Lojas[] {
    const filterLoja = value.toLowerCase()

    return this.lojas.filter(loja => loja.LOJA.toLowerCase().includes(filterLoja))
  }

}

interface Lojas {
  ID: string,
  LOJA: string
}

interface Micro {
  ID_LOJA: number
  LOJA: string,
  ID_MICRO: number,
  SERVICE_TAG: string,
  ASSET_TAG: string,
  FABRICANTE: string,
  MODELO: string,
  STATUS: string
}

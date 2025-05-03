import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Lojas } from 'src/app/chamados/lojas/lojas.component';
import { LoginService } from 'src/app/login/login.service';
import { MyErrorStateMatcher } from 'src/app/shared/erros-form';

@Component({
  selector: 'app-dialog-editar-loja',
  templateUrl: './dialog-editar-loja.component.html',
  styleUrls: ['./dialog-editar-loja.component.css']
})
export class DialogEditarLojaComponent implements OnInit {

  url: string = 'http://www.infraestrutura.com.br/ocorrencias_php/src/api/ApiCep.php'
  // url: string = 'http://cpl-inf-02.marabraz.com.br/ocorrencias_php/src/api/ApiCep.php'

  formGroup!: UntypedFormGroup
  matcher = new MyErrorStateMatcher();

  myModel       = ''
  mask          = [ /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]
  loja!:Lojas

  status: string[] = ['ABERTA', 'INAUGURAÇÃO', 'FECHADA']
  locais: string[] = ['Rua', 'Shopping', 'Carrefour'];
  horarios: string[] = ['09h as 20h', '09h às 18h', '10h às 22h']

  constructor(
    private _service: LoginService,
    private _fb: UntypedFormBuilder,
    private _dialogRef: MatDialogRef<DialogEditarLojaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.loja = this.data.data
    this.loja.CEP = this.loja.CEP.replace(/[^0-9]/g, '')
    this.formulario()
    this._dialogRef.disableClose = true
  }



  formulario() {
    this.formGroup = this._fb.group({
      acao       : ['editarLoja'],
      id         : [this.loja.ID],
      loja       : ['', Validators.required],
      local      : ['', Validators.required],
      endereco   : ['', Validators.required],
      complemento: [''],
      numero     : ['', Validators.required],
      bairro     : ['', Validators.required],
      localidade : ['', Validators.required],
      cep        : ['', [Validators.required, Validators.minLength(8)]],
      horario    : ['', Validators.required],
      status     : ['', Validators.required]
    })
  }

  mascara() {
    return this.mask
  }

  editarLoja() {
    const obj = this.formGroup.value
    this._service.editarLoja(JSON.stringify(obj)).subscribe(
      (result:any) => {
        if(result.sucesso) {
          this._service.msg(result.sucesso)
          this._dialogRef.close('sucesso')
        } else {
          this._service.msg(result.erro)
        }
      }
    )
  }

  consultaCEP() {
    const obj = {
      acao: 'apiCEP',
      cep: this.formGroup.get('cep')?.value,
      url: this.url
    }

    this._service.getApiCep(obj).subscribe(
      (data: any) => this.setEndereco(data)
    )
  }

  setEndereco(result: Endereco) {

    if(!result || result === null) {
      this._service.msg('CEP inválido. Verifique e tente novamente')
      return
    }

    this.formGroup.get('endereco')?.reset(result.logradouro)
    this.formGroup.get('complemento')?.reset(result.complemento)
    this.formGroup.get('bairro')?.reset(result.bairro)
    this.formGroup.get('localidade')?.reset(result.localidade)
  }


  getErrorMessage() {
    if (this.formGroup.get('cep')?.hasError('required')) {
      return 'CEP é Obrigatorio';
    }

    return this.formGroup.get('cep')?.errors ? 'CEP inválido' : '';

  }
}

export interface Endereco {
  bairro: string
  complemento: string,
  localidade: string,
  logradouro: string,
  error: string
}

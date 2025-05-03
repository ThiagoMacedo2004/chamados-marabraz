import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoginService } from 'src/app/login/login.service';
import { MyErrorStateMatcher } from 'src/app/shared/erros-form';

@Component({
  selector: 'app-dialog-usuario',
  templateUrl: './dialog-usuario.component.html',
  styleUrls: ['./dialog-usuario.component.css']
})
export class DialogUsuarioComponent implements OnInit {

  formGroup!: FormGroup
  matcher = new MyErrorStateMatcher();

  visualizar: boolean = true
  visualizarDois: boolean = true

  icon: string = ''
  titulo: string = ''
  infoUsuario!: Usuarios
  acao: string = ''

  constructor(
    private _dialoRef: MatDialogRef<DialogUsuarioComponent>,
    private _service: LoginService,
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) { }

  ngOnInit(): void {
    this.formulario()
    this.verificaAcao()
    this.disabledInput()
    this._dialoRef.disableClose = true


  }

  verificaAcao() {
    if(this.data.acao == 'cadastrarNovoUsuario') {
      this.icon = 'person_add'
      this.titulo = 'Novo Usuário'
      this.acao = 'cadastrarNovoUsuario'

      this.formGroup.get('acao')?.reset(this.acao)
    } else {
      this.icon = 'edit'
      this.titulo = 'Editar Usuário'
      this.acao = 'editarUsuario'

      this.infoUsuario = this.data.data
      this.formGroup.get('acao')?.reset(this.acao)
      this.formGroup.get('id')?.reset(this.infoUsuario.ID)
      this.formGroup.get('nome')?.reset(this.infoUsuario.NOME)
      this.formGroup.get('matricula')?.reset(this.infoUsuario.MATRICULA)
      this.formGroup.get('email')?.reset(this.infoUsuario.EMAIL)
      this.formGroup.get('senha')?.reset(this.infoUsuario.SENHA)
      this.formGroup.get('repetirSenha')?.reset(this.infoUsuario.SENHA)
    }
  }

  formulario() {
    this.formGroup = this._fb.group({
      acao        : [this.acao],
      id          : [''],
      nome        : ['', [Validators.required]],
      matricula   : ['', [Validators.required]],
      email       : ['', [Validators.required, Validators.email]],
      senha       : ['', [Validators.required]],
      repetirSenha: ['', [Validators.required]],
    })
  }

  salvar() {
    if(this.formGroup.get('senha')?.value !== this.formGroup.get('repetirSenha')?.value) {
      return this._service.msg('As senhas não conferem. Verifique e tente novamente.')
    }

    if(this.acao === 'cadastrarNovoUsuario') {

      this._service.cadastrarNovoUsuario(JSON.stringify(this.formGroup.value)).subscribe(
        (result: any) => {
          if(result.sucesso) {
            this._service.msg(result.sucesso)
            this._dialoRef.close('OK')
          } else {
            this._service.msg(result.erro)
          }
        }
      )
    } else {
      this._service.editarUsuario(JSON.stringify(this.formGroup.value)).subscribe (
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

  }

  getErrorMessage() {
    if (this.formGroup.get('email')?.hasError('required')) {
      return 'Digite um e-mail';
    }

    return this.formGroup.get('email')?.hasError('email') ? 'E-mail inválido' : '';
  }

  disabledInput() {
    if(this._service.usuario.MATRICULA == 217314) {
      return false
    }

    return true
  }

}

interface Usuarios {
  ID: number,
  MATRICULA: number,
  NOME: string,
  SENHA: string,
  EMAIL: string,
  DATE_CREATE: Date,
  DATE_BLOCK: Date,
  STATUS: string
}

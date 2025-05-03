import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MyErrorStateMatcher } from 'src/app/shared/erros-form';
import { LoginService } from 'src/app/login/login.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Lojas, Servicos } from 'src/app/chamados/lojas/lojas.component';

@Component({
  selector: 'app-dialog-novo-servico-loja',
  templateUrl: './dialog-novo-servico-loja.component.html',
  styleUrls: ['./dialog-novo-servico-loja.component.css']
})
export class DialogNovoServicoLojaComponent implements OnInit {

  formGroup!: FormGroup
  cnpjs:any = []
  matcher = new MyErrorStateMatcher();
  titulo: string = ''
  velocidade: number = 0
  dadosServico:any = {}
  idServico: any

  operadoras: string[] = [
    'Telefonica - Vivo',
    'Claro-net',
    'Sat Fibra',
    'Net Facil',
    'Tesa',
    '76 Telecom',
    'America Net',
    'Wcs',
    'Ultranet',
    'Dtech'
  ].sort()

  servicos: string[] = [
    'Link De Dados',
    'Banda Larga',
    'Vivo Fibra',
    'Speedy',
    'VGR (Vivo Gestão de Redes)'
  ].sort()

  constructor(
    private _service: LoginService,
    private _fb: FormBuilder,
    private _dialoRef: MatDialogRef<DialogNovoServicoLojaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.getServicoEdicao()
    this._dialoRef.disableClose = true
    this.acao()
    this.formulario()
    this.getCnpjs()

  }

  acao() {
    if(this.data.acao == 'adicionarServicoLoja') {
      this.titulo = `Novo Serviço: ${this.data.loja.LOJA}`
    } else {
      this.titulo = `Editar Serviço: ${this.data.loja.LOJA}`
    }
  }

  formulario() {
    this.formGroup = this._fb.group({
      acao       : [this.data.acao],
      idServico  : [this.idServico],
      idLoja     : [this.data.loja.ID],
      idCnpj     : ['', Validators.required],
      operadora  : ['', Validators.required],
      tipoServico: ['', Validators.required],
      designacao : ['', Validators.required],
      velocidade : ['', Validators.required],
      observacao : ['']
    })
  }

  getCnpjs() {
    this._service.getCpnjs().subscribe(
      (result:any) => this.cnpjs = result
    )
  }

  adicionarServicoLoja() {
    const obj = this.formGroup.value

    this._service.adicionarServicoLoja(JSON.stringify(obj)).subscribe(
      (result:any) => {
        if(result.sucesso) {
          this._service.msg(result.sucesso)
          this._dialoRef.close('sucesso')
        } else {
          this._service.msg(result.erro)
        }
      }
    )
  }

  editarServicoLoja() {
    const obj = this.formGroup.value

    this._service.editarServicoLoja(JSON.stringify(obj)).subscribe(
      (result: any) => {
        if(result.sucesso) {
          this._service.msg(result.sucesso)
          this._dialoRef.close('ok')
        } else {
          this._service.msg(result.erro)
        }
      }
    )

  }

  executarAcao() {
    if(this.data.acao === 'adicionarServicoLoja') {
      this.adicionarServicoLoja()
    } else {
      this.editarServicoLoja()
    }
  }

  getServicoEdicao() {
    if(this.data.servico) {
      this.idServico = this.data.servico.ID_SERVICO
      this.dadosServico.operadora   = this.data.servico.OPERADORA ? this.data.servico.OPERADORA: ''
      this.dadosServico.tipoServico = this.data.servico.TIPO_SERVICO || null
      this.dadosServico.designacao  = this.data.servico.DESIGNACAO   || null
      this.dadosServico.velocidade  = this.data.servico.VELOCIDADE.replace('MB', '')   || null
      this.dadosServico.idCnpj      = this.data.servico.ID_CNPJ     || null
      this.dadosServico.observacao  = this.data.servico.OBSERVACAO  || null
    }
  }

}

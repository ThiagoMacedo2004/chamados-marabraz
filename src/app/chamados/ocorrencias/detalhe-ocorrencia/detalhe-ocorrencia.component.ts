import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { min, Subscription } from 'rxjs';
import { DialogDeletaOcorrenciaComponent } from 'src/app/dialogs/dialog-deleta-ocorrencia/dialog-deleta-ocorrencia.component';
import { LoginService } from 'src/app/login/login.service';
import { MyErrorStateMatcher } from 'src/app/shared/erros-form';

@Component({
  selector: 'app-detalhe-ocorrencia',
  templateUrl: './detalhe-ocorrencia.component.html',
  styleUrls: ['./detalhe-ocorrencia.component.css']
})
export class DetalheOcorrenciaComponent implements OnInit, OnDestroy {

  path: string = 'http://www.infraestrutura.com.br/ocorrencias_php/src/api/pdf.php'
  // path: string = 'http://cpl-inf-02.marabraz.com.br/ocorrencias_php/src/api/pdf.php'
  ocorrencia: any
  inscricao!: Subscription
  detalheOc?: any
  detalheAtendimentoOc?: any
  materiaisUtilizados?: any[] = []
  tecnicos: Usuario[] = []
  veiculos: Veiculo[] = []
  materiais: Material[] = []
  materiaisSelecionados: MaterialSelecionado[] = []
  qtdMaterial!: number | null
  maxDate?: Date
  minDate?: Date
  user: any

  formGroup!: FormGroup

  matcher = new MyErrorStateMatcher();

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _service: LoginService,
    private _fb: FormBuilder,
    private _dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.formulario()
    this.user = this._service.usuario

    this.inscricao = this._route.queryParams.subscribe(
      (queryParams: any) => {
        this.detalheOcorrencia(queryParams)
      }
    )
  }

  formulario() {
    this.formGroup = this._fb.group({
      acao           : ['finalizarOc'],
      idOcorrencia   : [''],
      dataAtendimento: ['', Validators.required],
      idAnalista     : [''],
      idTecnico      : ['', Validators.required],
      idVeiculo      : ['', Validators.required],
    })
  }

  finalizarOc() {
    this.formGroup.get('dataAtendimento')?.reset(this.getDataAtendimento(), Validators.required)
    this.formGroup.get('idAnalista')?.reset(this.user.ID, Validators.required)
    this.formGroup.get('idOcorrencia')?.reset(this.detalheOc.ID, Validators.required)
    const obj = {
      informacoes: this.formGroup.value,
      materiais: this.materiaisSelecionados
    }

    this._service.finalizarOc(JSON.stringify(obj)).subscribe(
      (data: any) => {
        if(data.sucesso) {
          this._service.msg(data.sucesso)
          this._router.navigate(['/chamados/ocorrencias/tabela-ocorrencias'])
        } else {
          this._service.msg(data.erro)
        }
      }
    )
  }

  detalheOcorrencia(queryParams: any) {

    const obj = {
      acao: 'detalheOcorrencia',
      ocorrencia: queryParams['ocorrencia'],
      status: queryParams['status'],
      id: queryParams['id']
    }

    this._service.detalheOcorrencia(obj).subscribe(
      (result: any) => {
        this.detalheOc = result.DETALHE_OC,
        this.detalheAtendimentoOc = result.DETALHE_ATENDIMENTO_OC
        this.materiaisUtilizados = result.MATERIAIS_UTILIZADOS
        if(this.detalheOc?.STATUS === 'Aberta') {
          this.tecnicos = result.TECNICOS.filter((t: Usuario) => t.STATUS === 'ATIVO')
          this.veiculos = result.VEICULOS
          this.materiais = result.MATERIAIS
          const currentYear = new Date().getFullYear();
          this.maxDate = new Date(currentYear, new Date().getMonth(), new Date().getDate());

          let minDate = this.detalheOc?.DATA.split('-')
          this.minDate = new Date(minDate[0], (minDate[1] -1), minDate[2])
        }



      }
    )
  }

  voltar() {
    this._location.back()
  }

  getTecnicos(tecnicos: Usuario[]) {
    // this._service.getUsuarios().subscribe(
    //   (result: any) => {
    //     this.tecnicos = result
    //     this.tecnicos = this.tecnicos.filter((t) => t.STATUS === 'ATIVO')
    //   }
    // )

    this.tecnicos = tecnicos
    this.tecnicos = this.tecnicos.filter((t) => t.STATUS === 'ATIVO')

  }

  getVeiculos(veiculos: any) {
    // this._service.getVeiculos().subscribe(
    //   (result: any) => {
    //     this.veiculos = result
    //   }
    // )
    this.veiculos = veiculos
  }

  getMateriais(materiais: any) {
    // this._service.getMateriais().subscribe(
    //   (result: any) => {
    //     this.materiais = result

    //   }
    // )

    this.materiais = materiais
  }

  selecionarMateriais(idMaterial: number, qtd: number) {

    let filtrarMaterial = this.materiais.filter((m) => m.ID === idMaterial)

    let materialSel: MaterialSelecionado = {
      ID: filtrarMaterial[0].ID,
      MATERIAL: filtrarMaterial[0].MATERIAL,
      QTD: qtd
    }

    // excluir material selecionado da listagem de materiais
    var i = this.materiais.indexOf(filtrarMaterial[0])
    this.materiais.splice(i, 1)

    // add material selecionado na tabela de materiais
    this.materiaisSelecionados.push(materialSel)

    this.qtdMaterial = 0
  }

  deletarMaterial(material: MaterialSelecionado) {

    // excluir material da tabela de materiais
    var i = this.materiaisSelecionados.indexOf(material)
    this.materiaisSelecionados.splice(i, 1)

    let addMaterial: Material = {
      ID: material.ID,
      MATERIAL: material.MATERIAL
    }

    this.materiais.push(addMaterial)
    this.materiais.sort((a:Material, b:Material) => {
      return a.MATERIAL < b.MATERIAL ? -1 : a.MATERIAL > b.MATERIAL ? 1 : 0;
    })
  }

  getDataAtendimento() {
    let data = new Date(this.formGroup.get('dataAtendimento')?.value)

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

  deletaOcorrencia(ocorrencia: any) {
    console.log(ocorrencia)
    this._dialog.open(DialogDeletaOcorrenciaComponent, {
      data: ocorrencia,
      width: '30%'
    }).afterClosed().subscribe(
      (result: any) => {
        if(result) {
          this._router.navigate(['/chamados/ocorrencias/tabela-ocorrencias'])
        }
      }
    )
  }

  pdfOs(ocorrencia: any) {

    this._service.pdfOs(this.path, JSON.stringify(ocorrencia)).subscribe(
      (result: any) => {
        // console.log(result)
        const file = new Blob([result], {
          type: result.type
        })

        const blob = window.URL.createObjectURL(file)

        const link = document.createElement('a')
        link.href = blob
        link.target = 'ordemDeServico.pdf'
        link.click()

        window.URL.revokeObjectURL(blob)
        link.remove()
      }
    )
  }

  enviaEmail(detalheOc: any) {
    const obj = {
      acao: 'sendEmail',
      data: detalheOc,
      user: this.user
    }
    this._service.enviarEmail(JSON.stringify(obj)).subscribe(
      (result: any) => {
        if(result.sucesso) {
          this._service.msg(result.sucesso)
        } else {
          this._service.msg(result.erro)
        }
      }
    )
  }

  ngOnDestroy(): void {
   this.inscricao.unsubscribe()
  }

}

interface Usuario {
  ID: number,
  MATRICULA: number,
  NOME: string,
  SENHA: string,
  EMAIL: string,
  DATE_CREATE: Date,
  DATE_BLOCK: Date,
  STATUS: string
}

interface Veiculo {
  ID: number,
  MARCA: string,
  MODELO: string,
  PLACA: string
}

interface Material {
  ID: number,
  MATERIAL: string
}

interface MaterialSelecionado {
  ID: number,
  MATERIAL: string,
  QTD: number
}

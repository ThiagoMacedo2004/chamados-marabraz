import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Lojas } from '../../lojas/lojas.component';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Ocorrencia } from '../tabela-ocorrencias/tabela-ocorrencias.component';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login/login.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-pesquisa-ocorrencia',
  templateUrl: './pesquisa-ocorrencia.component.html',
  styleUrls: ['./pesquisa-ocorrencia.component.css']

})
export class PesquisaOcorrenciaComponent implements OnInit {

  @Output() resultPesquisa = new EventEmitter()
  @Input() ocorrenciaSelecionada: any[] = []

  result: any
  filterOptions: Lojas[] = []
  lojas: Lojas[] = []
  formGroup!: UntypedFormGroup
  motivos: any[] = []
  subMotivos: any[] = []
  ocorrencias: Ocorrencia[] = []
  maxDate?: Date
  maxDate2?: Date
  minDate?: Date
  dateFinal: boolean = true
  user: any

  constructor(
    private _router: Router,
    private _service: LoginService,
    private _location: Location,
    private _fb: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
    this.formulario()
    this.getLojas()
    this.getMotivos()
    this.getLojas()

    this.user = this._service.usuario

    this.formGroup.get('idSubmotivo')?.reset({value: '', disabled: true})


  }

  formulario() {
    this.formGroup = this._fb.group({
      acao: 'pesquisaOcorrencia',
      idLoja: [''],
      ocorrencia: [''],
      idMotivo: [''],
      idSubmotivo: [''],
      dateInicial: [''],
      dateFinal: ['']
    })
  }

  gerarOc() {
    if(localStorage.hasOwnProperty('ocorrencia')) {
      localStorage.removeItem('ocorrencia')
    }
    this._router.navigate(['chamados/ocorrencias/gerar-ocorrencia'])
  }

  opcoesOcorrencia() {
    this._router.navigate(['chamados/ocorrencias/opcoesOcorrencia'])
  }

  excel() {

    const obj = {
      acao: 'excelOcorrencias',
      data: this.ocorrenciaSelecionada
    }

    this._service.excel(JSON.stringify(obj)).subscribe(
      (result: any) => {
        // console.log(result)
        const file = new Blob([result], {
          type: result.type
        })

        const blob = window.URL.createObjectURL(file)

        const link = document.createElement('a')
        link.href = blob
        link.download = 'relatorio_ocorrencias.xls'
        link.click()

        window.URL.revokeObjectURL(blob)
        // link.remove()
      }
    )
  }

  getLojas() {
    this._service.getLojas().subscribe(
      (data:Lojas[]) => {
        this.lojas = data
        this.filterOptions = data
      }
    )
  }

  changeMotivo(event: any) {
    if(event.value) {
      this.formGroup.get('idSubmotivo')?.reset({value: '', disabled: false})
      this.getSubMotivos(event.value)
    } else {
      this.formGroup.get('idSubmotivo')?.reset({value: '', disabled: true})
      this.subMotivos = []
    }
  }

  getMotivos() {
    this._service.getMotivos().subscribe(
      (result: any) => {
        this.motivos = result

      }
    )
  }

  getSubMotivos(idMotivo: string) {
    this._service.getSubMotivos(idMotivo).subscribe(
      (result: any) => {
        this.subMotivos = result
      }
    )
  }


  pesquisaOc() {
    let dateInicial = this.formGroup.get('dateInicial')?.value
    let dateFinal = this.formGroup.get('dateFinal')?.value


    if(dateInicial && !dateFinal) {
      console.log(this._service.msg('Informe a data Final...'))
      return
    }



    console.log(this.formGroup.value)

    if(localStorage.hasOwnProperty('resultadoPesquisa')) {
      localStorage.removeItem('resultadoPesquisa')
    }

    this._service.pesquisaOcorrencia(JSON.stringify(this.formGroup.value)).subscribe(
      (result: any) => {
        this.ocorrencias = result

        if(this.ocorrencias.length > 0) {
          this.setResultPesquisa(this.ocorrencias)
          localStorage.setItem('resultadoPesquisa', JSON.stringify(this.ocorrencias) )
        } else {
          this._service.msg('Nehuma ocorrência encontrada para os filtros informado. !')
        }
      }
    )

  }

  setResultPesquisa(result: Ocorrencia[]) {
    this.resultPesquisa.emit(result)
  }

  dateLimit() {
    this.dateFinal = false
    this.formGroup.get('dateFinal')?.reset('')
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(currentYear, new Date().getMonth(), new Date().getDate());
    let minDate = this.dateFormat(this.formGroup.get('dateInicial')?.value).split("-")
    this.minDate = new Date(minDate[0], (minDate[1] -1), minDate[2])
  }

  dateFormat(date: any):any {
    let data = new Date(date)
    console.log(data)
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

  limparFormulario() {
    this.formGroup.reset(this.formulario(), {})

    this.formGroup.get('idSubmotivo')?.reset({value: '', disabled: true})
    this.dateFinal = true

    if(localStorage.hasOwnProperty('resultadoPesquisa')) {
      localStorage.removeItem('resultadoPesquisa')
    }
    this.setResultPesquisa([])
  }

  getErrorMessage() {
    if (this.formGroup.get('dateFinal')?.hasError('required')) {
      return 'Data Final deve ser maior ou igual a Data Inicial';
    }

    return this.formGroup.get('dateFinal')?.errors ? 'Data Final deve ser maior ou igual a Data Inicial' : '';

  }

}

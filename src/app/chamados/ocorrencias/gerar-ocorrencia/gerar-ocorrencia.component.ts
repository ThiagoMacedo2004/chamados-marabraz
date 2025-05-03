import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login/login.service';
import { MyErrorStateMatcher } from 'src/app/shared/erros-form';
import { DialogLojasComponent } from './dialog-lojas/dialog-lojas.component';

@Component({
  selector: 'app-gerar-ocorrencia',
  templateUrl: './gerar-ocorrencia.component.html',
  styleUrls: ['./gerar-ocorrencia.component.css']
})
export class GerarOcorrenciaComponent implements OnInit {

  dataSource = new MatTableDataSource<Ocorrencia>()
  columnsToDisplay = ['OCORRENCIA', 'MOTIVO', 'SUBMOTIVO'];
  columnsWitchData = [...this.columnsToDisplay,'DATA', 'STATUS']

  formGroup!: FormGroup
  matcher = new MyErrorStateMatcher();
  filterOptions: Loja[] = []
  lojas: Loja[] = []
  motivos: any[] = []
  subMotivos: any[] = []
  lojaSelecionada: Loja[] = []
  qtdMicrosLoja: any
  historicoOcLj: any[] = []
  dataOc: any = {}
  cardHistorico: boolean = false
  infoLojaSel: any

  constructor(
    private _service: LoginService,
    private _fb: FormBuilder,
    private _router: Router,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.setObj()
    this.formulario()
    this.getLojas()
    this.getMotivos()
    this.formGroup.get('ID_SUBMOTIVO')?.reset({value: '', disabled: true}, Validators.required)
    // this.formGroup.get('LOJA')?.reset({value: '', disabled: true}, Validators.required)

    // this.formGroup.get('LOJA')?.valueChanges.subscribe(
    //   value => this.filterOptions = this.filterData(value || '')
    // )

    this.getInfo()
  }

  formulario() {
    this.formGroup = this._fb.group({
      ID_ANALISTA : [this._service.usuario.ID],
      OCORRENCIA  : ['', Validators.required],
      LOJA        : ['', Validators.required],
      ID_LOJA     : [''],
      ID_MOTIVO   : ['', Validators.required],
      ID_SUBMOTIVO: ['', Validators.required],
      DESCRICAO   : ['', Validators.required],
      TRIAGEM     : ['', Validators.required]
    })
  }

  getInfo() {
    if(localStorage.hasOwnProperty('ocorrencia')) {
      let data: any = localStorage.getItem('ocorrencia')
      data = JSON.parse(JSON.stringify(data), (key, value) => JSON.parse(value))

      console.log(data.lojaSelecionada)

      this.infoLojaSelecionada(data.lojaSelecionada)

      this.dataSource.data = data.arrayOcs

      this.dataOc.ocorrencia = data.data?.OCORRENCIA
      this.dataOc.loja = data.data?.LOJA

      this.formGroup.get('LOJA')?.setValue(data.data?.ID_LOJA )
      this.formGroup.get('ID_LOJA')?.setValue(data.data?.ID_LOJA)
      this.formGroup.get('ID_MOTIVO')?.setValue(data.data?.ID_MOTIVO)

      console.log(this.formGroup.value)

      if(data.data?.ID_SUBMOTIVO) {
        this.getSubMotivos(data.data?.ID_MOTIVO)
        this.formGroup.get('ID_SUBMOTIVO')?.reset({value: data.data?.ID_SUBMOTIVO, disabled: false})
      }

      this.dataOc.descricao = data.data?.DESCRICAO
      this.dataOc.triagem = data.data?.TRIAGEM

      this.historicoOcLoja(data.data?.ID_LOJA)

    }

  }

  setObj() {
    this.dataOc.ocorrencia = ''
    this.dataOc.loja = ''
    this.dataOc.idMotivo = ''
    this.dataOc.idSubmotivo = ''
    this.dataOc.descricao = ''
    this.dataOc.triagem = ''
  }

  getLojas() {
    this._service.getLojas().subscribe(
      (data: Loja[]) => {
        this.lojas = data
        this.filterOptions = data
      }
    )
  }

  dialogSelecionaLoja() {
    this._dialog.open(DialogLojasComponent, {
      data: this.lojas,
      width: '24%',
      position: {
        top: '4%'
      }
    }).afterClosed().subscribe(
      (data: Loja) => this.infoLojaSelecionada(data)
    )
  }

  changeMotivo(event: any) {
    if(event.value) {
      this.formGroup.get('ID_SUBMOTIVO')?.reset({value: '', disabled: false}, Validators.required)
      this.getSubMotivos(event.value)
    } else {
      this.formGroup.get('ID_SUBMOTIVO')?.reset({value: '', disabled: true}, Validators.required)
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

  salvarOs() {

    if(this.formGroup.get('ID_LOJA')?.value === "") {
      this._service.msg(`Por favor, selecione uma loja da lista.`)
      return
    }

    const obj = {
      acao: 'gravarOcorrencia',
      data: this.formGroup.value,
      user: this._service.usuario
    }

    this._service.gravarOcorrencia(JSON.stringify(obj)).subscribe(
      (result: any) => {
        if (result.erro) {
          this._service.msg(result.erro)
          // this._router.navigate(['chamados/ocorrencias/tabela-ocorrencias'])
        } else {
          if(localStorage.hasOwnProperty('resultadoPesquisa')) {
            localStorage.removeItem('resultadoPesquisa')
          }
          this._service.msg(result.sucesso)
          this._router.navigate(['chamados/ocorrencias/tabela-ocorrencias'])
        }
      }
    )
  }

  infoLojaSelecionada(event: Loja | any) {

    console.log(event.value)

    if(event.value == '' || event == '') {
      this.cardHistorico = false
    } else {
      this.cardHistorico = true
    }


    if(event.value) {
      var loja: Loja = event.value
      this.infoLojaSel = this.lojas.filter((l:any) => l.ID === loja)[0]
    } else {
      var loja: Loja = event.ID
      this.infoLojaSel = event
    }

    this.formGroup.get('LOJA')?.setValue(loja)
    this.historicoOcLoja(loja)
  }



  historicoOcLoja(idLoja: any) {
    this._service.getMicrosLoja(idLoja).subscribe(
      (result: any) => {
        this.qtdMicrosLoja = result.QTD_MICROS_LJ.QTD
        this.historicoOcLj = result.HISTORICO_OC_LJ
        this.dataSource.data = this.historicoOcLj
        this.formGroup.get('ID_LOJA')?.reset(idLoja)

      }
    )
  }

  detalhesOcorrencia(ocorrencia: Ocorrencia) {
    // this.formGroup.get('LOJA')?.reset({value: this.infoLojaSel, disabled: false}, Validators.required)

    const obj = {
      data: this.formGroup.value,
      arrayOcs: this.historicoOcLj,
      lojaSelecionada: this.infoLojaSel
    }

    localStorage.setItem('ocorrencia', JSON.stringify(obj))
    this._router.navigate(
      ['chamados/ocorrencias/detalheOcorrencia'],{
        queryParams: {
          status: ocorrencia.STATUS,
          ocorrencia: ocorrencia.OCORRENCIA,
          id: ocorrencia.ID
        }
      }
    )


  }

  // filterData(dados:string): Loja[] {
  //   const filterValue = dados.toLowerCase();
  //   return this.lojas.filter(loja => loja.LOJA.toLowerCase().includes(filterValue));
  // }

}

interface Loja {
  BAIRRO: string,
  CEP: string,
  ENDERECO: string,
  HORARIO_FUNC: string,
  ID: string,
  LOCAL: string,
  LOJA: string,
  STATUS: string,
  NUMERO: string,
  LOCALIDADE: string
}

export interface Ocorrencia {
  ID: string,
  LOJA: string,
  OCORRENCIA: string,
  MOTIVO: string,
  SUBMOTIVO: string,
  DATA: Date,
  DATA_ATEND: Date,
  STATUS: string
}

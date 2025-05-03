import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DialogPesquisaOcComponent } from 'src/app/dialogs/dialog-pesquisa-oc/dialog-pesquisa-oc.component';
import { LoginService } from 'src/app/login/login.service';

import { DialogDeletaOcorrenciaComponent } from 'src/app/dialogs/dialog-deleta-ocorrencia/dialog-deleta-ocorrencia.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Lojas } from '../../lojas/lojas.component';
import { MyErrorStateMatcher } from 'src/app/shared/erros-form';

@Component({
  selector: 'app-tabela-ocorrencias',
  templateUrl: './tabela-ocorrencias.component.html',
  styleUrls: ['./tabela-ocorrencias.component.css']
})
export class TabelaOcorrenciasComponent implements OnInit {

  @Input() ocorrenciaPesquisa: Ocorrencia[] = []
  matcher = new MyErrorStateMatcher();

  path: string = 'http://www.infraestrutura.com.br/ocorrencias_php/src/api/pdf.php'
  // path: string = 'http://cpl-inf-02.marabraz.com.br/ocorrencias_php/src/api/pdf.php'
  user: any

  dataSource = new MatTableDataSource<Ocorrencia>()
  columnsToDisplay = ['LOJA', 'OCORRENCIA', 'MOTIVO', 'SUBMOTIVO'];
  columnsToDisplayWithSelect = ['select', ...this.columnsToDisplay, 'DATA', 'DATA_ATEND', 'STATUS', 'ACAO'];
  selection = new SelectionModel<Ocorrencia>(true, []);

  qtdOcorrencias: number = 0
  qtdOcorrenciaSelecionada: number = 0;

  strFilter: string = ''
  colorStatus: string = ''

  icon: string = ''
  titulo: string = ''

  constructor(
    private _router: Router,
    private _service: LoginService,
    private _liveAnnouncer: LiveAnnouncer,
    private _dialog: MatDialog,
    private _location: Location,
    private _fb: FormBuilder,
  ) { }

  @ViewChild(MatSort, {static: false}) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }


  ngOnInit(): void {
    console.log('OnInit')
    this.configIni()
    this.user = this._service.usuario
  }

  setResultPesquisa(event: Ocorrencia[] | []) {
    this.selection.clear()
    if(event.length > 0) {
      this.dataSource.data = event
      this.qtdOcorrencias = event.length
    } else {
      this.getOcorrencias()
    }
  }

  configIni() {
    if(localStorage.hasOwnProperty('resultadoPesquisa')) {
      let data:any = localStorage.getItem('resultadoPesquisa')
      data = JSON.parse(JSON.stringify(data), (key, value) => JSON.parse(value))
      this.setResultPesquisa(data)
      // localStorage.removeItem('resultadoPesquisa')

    } else {
      this.getOcorrencias()
    }
  }

  getOcorrencias() {
    this._service.getOcorrencias().subscribe(
      (result: Ocorrencia[]) => {
        this.setData(result)
      }
    )
  }

  setData(ocorrencias: Ocorrencia[]) {
    this.dataSource.data = ocorrencias
    this.qtdOcorrencias = this.dataSource.data.length
  }

  gerarOc() {
    this._router.navigate(['chamados/ocorrencias/gerar-ocorrencia'])
  }

  // pesquisaOc() {
  //   this._dialog.open(DialogPesquisaOcComponent, {
  //     width: '44%',
  //     position: {
  //       left: '28%'
  //     }
  //   }).afterClosed().subscribe(
  //     (result: Ocorrencia[]) => {
  //       if(result.length == 0) {
  //         this._service.msg('Nenhuma ocorrência encontrada !!!')
  //       } else {
  //         // this.dataSource.data = []
  //         this.dataSource.data = result
  //         this.qtdOcorrencias = this.dataSource.data.length
  //         this.strFilter = ''
  //         this.dataSource.filter = this.strFilter
  //         this.selection.clear()
  //       }
  //     }
  //   )
  // }

  opcoesOcorrencia() {
    this._router.navigate(['chamados/ocorrencias/opcoesOcorrencia'])
  }

  detalhesOcorrencia(ocorrencia: Ocorrencia) {
    // this._router.navigate(['chamados/ocorrencias/', ocorrencia ],)
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

  deletaOcorrencia(ocorrencia: any) {
      console.log(ocorrencia)
      this._dialog.open(DialogDeletaOcorrenciaComponent, {
        data: ocorrencia,
        width: '30%'
      }).afterClosed().subscribe(
        (result: any) => {
          if(result) {
            this.getOcorrencias()
          }
        }
      )
    }

  excel() {

    const obj = {
      acao: 'excelOcorrencias',
      data: this.selection.selected
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




  isAllSelected() {
    if(this.dataSource.filteredData.length === 0) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;

    } else {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.filteredData.length;

      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {

    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    if(this.dataSource.filteredData.length > 0) {
      this.selection.select(...this.dataSource.filteredData)

    } else {

      this.selection.select(...this.dataSource.data);
    }

  }


  applyFilter(event: Event) {
    this.selection.clear()
    this.qtdOcorrenciaSelecionada = this.selection.selected.length
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    this.qtdOcorrencias = this.dataSource.filteredData.length
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  voltar() {
    this._location.back()
  }



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

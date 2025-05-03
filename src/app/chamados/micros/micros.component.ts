import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Micros } from '../lojas/lojas.component';
import { LoginService } from 'src/app/login/login.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogHistoricoMicroComponent } from 'src/app/dialogs/dialog-historico-micro/dialog-historico-micro.component';
import { DialogAdicionarMicroComponent } from 'src/app/dialogs/dialog-adicionar-micro/dialog-adicionar-micro.component';


interface Status {
  value: string,
  texto: string
}

@Component({
  selector: 'app-micros',
  templateUrl: './micros.component.html',
  styleUrls: ['./micros.component.css']
})

export class MicrosComponent implements OnInit {

  dataSource = new MatTableDataSource<Micros>()
  columnsToDisplay = ['LOJA', 'SERVICE_TAG', 'ASSET_TAG', 'FABRICANTE', 'MODELO', 'STATUS'];
  columnsToDisplayWithSelect = ['select', ...this.columnsToDisplay, 'ACAO'];
  selection = new SelectionModel<Micros>(true, []);

  urlExcel = "http://www.infraestrutura.com.br/ocorrencias_php/src/api/ApiFormularios.php"
  // urlExcel = "http://cpl-inf-02.marabraz.com.br/ocorrencias_php/src/api/ApiFormularios.php"
  subtitulo: string = 'Todos os Micros'

  links: string[] = ['Todos os Micros', 'Micros em Loja', 'Micros Danificados', 'Micros Furtados']


  micros: Micros[] = []
  totalMicros: Micros[] = []
  microsEmLoja: Micros[] = []
  microsDanificados: Micros[] = []
  microsFurtados: Micros[] = []
  btnchecked = false

  emiteEventMicros = new EventEmitter()

  qdtMicros: number = 0
  qtdMicrosSelecionado: number = 0

  carregando = true

  dataExcel: Micros[] = []


  constructor(
    private _service: LoginService,
    private _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getMicros()

  }



  microsSelecionados(evento: any) {
    this.qtdMicrosSelecionado = evento.qtdMicrosSelecao
    this.dataExcel = evento.data
  }

  getMicros() {
    this._service.getMicros().subscribe(
      (result: Micros[]) => {
        this.micros = result
        this.setData(result)
      }
    )
  }

  excel() {

    const obj = {
      acao: 'excelMicros',
      data: this.dataExcel
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
        link.download = 'relatorio.xls'
        link.click()

        window.URL.revokeObjectURL(blob)
        link.remove()
      }
    )


  }

  setData(micros: Micros[]) {
    this.carregando = false

    this.qdtMicros = micros.length
    this.totalMicros = micros
    this.microsEmLoja = micros.filter((m) => m.STATUS != 'FURTO')
    this.microsDanificados = micros.filter((m) => m.STATUS === 'DANIFICADA')
    this.microsFurtados = micros.filter((m) => m.STATUS === 'FURTO')

    // this.enviarMicrosStatus(status)

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
      console.log(this.selection.selected)
      console.log(this.selection.selected.length)
    } else {
      console.log(this.selection.selected.length)
      this.selection.select(...this.dataSource.data);
    }

  }

  applyFilter(event: Event) {
    this.selection.clear()
    this.qtdMicrosSelecionado = this.selection.selected.length
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();



    this.qdtMicros = this.dataSource.filteredData.length
  }

  historicoMicro(micro:Micros) {
    this._dialog.open(DialogHistoricoMicroComponent, {
      data: micro,
      width: '80%',
      position: {
        left: '17%',
        top: '10%'
      }
    })
  }

  // movimentarMicro(micro:Micros) {
  //   console.log(micro)
  //   this._dialog.open(DialogMovimentarMicroComponent, {
  //     data: micro,
  //     width: '50%',
  //     position: {
  //       top: '4%',
  //       left: '31%'
  //     }
  //   }).afterClosed().subscribe(
  //     (result: any) => {
  //       if(result === 'OK') {
  //         this.dataSource.data = []
  //         this.getMicros()
  //       }
  //     }
  //   )
  // }

  // editarMicro(micro: Micros) {
  //   this._dialog.open(DialogEditarMicroComponent, {
  //     data: micro
  //   }).afterClosed().subscribe(
  //     (result:any) => {
  //       if(result === 'OK') {
  //         this.dataSource.data = []
  //         this.getMicros()
  //       }
  //     }
  //   )
  // }

  dialogAdicionarMicro() {

    this._dialog.open(DialogAdicionarMicroComponent, {
      data: '',
      width: '26%'
    }).afterClosed().subscribe(
      (result: any) => {
        if(result === 'OK') {
          this.dataSource.data = []
          this.getMicros()

        }
      }
    )
  }

}

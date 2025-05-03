import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Micros } from '../../lojas/lojas.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { DialogMovimentarMicroComponent } from 'src/app/dialogs/dialog-movimentar-micro/dialog-movimentar-micro.component';
import { DialogEditarMicroComponent } from 'src/app/dialogs/dialog-editar-micro/dialog-editar-micro.component';
import { DialogAdicionarMicroComponent } from 'src/app/dialogs/dialog-adicionar-micro/dialog-adicionar-micro.component';
import { DialogHistoricoMicroComponent } from 'src/app/dialogs/dialog-historico-micro/dialog-historico-micro.component';
import { LoginService } from 'src/app/login/login.service';


@Component({
  selector: 'app-tabela-micros',
  templateUrl: './tabela-micros.component.html',
  styleUrls: ['./tabela-micros.component.css']
})
export class TabelaMicrosComponent implements OnInit, OnChanges {

  // @Input() eventMicros!: EventEmitter<Micros[]>
  @Input() microsTb: Micros[] = []
  @Input() addMicro: any
  @Output() eventoAlterarMicro = new EventEmitter()

  filterTable: string = ''

  dataSource = new MatTableDataSource<Micros>()
  columnsToDisplay = ['LOJA', 'SERVICE_TAG', 'ASSET_TAG', 'FABRICANTE', 'MODELO', 'STATUS'];
  columnsToDisplayWithSelect = ['select', ...this.columnsToDisplay, 'ACAO'];
  selection = new SelectionModel<Micros>(true, []);




  qdtMicros: number = 0
  qtdMicrosSelecionado: number = 0

  constructor(
    private _dialog: MatDialog,
    private _service: LoginService
  ) {

  }

  ngOnInit(): void {

    this.dataSource.data = this.microsTb

  }

  ngOnChanges() {
    this.dataSource.data = this.microsTb
  }


  getMicros() {
    this._service.getMicros().subscribe(
      (result: Micros[]) => this.dataSource.data = result
    )

  }

  historicoMicro(micro:Micros) {
    this._dialog.open(DialogHistoricoMicroComponent, {
      data: micro,
      width: '80%',
      position: {
        left: '16%',
        top: '8%'
      }
    })
  }

  movimentarMicro(micro:Micros) {
    console.log(micro)
    this._dialog.open(DialogMovimentarMicroComponent, {
      data: micro,
      width: '50%',
      position: {
        top: '4%',
        left: '31%'
      }
    }).afterClosed().subscribe(
      (result: any) => {
        if(result === 'OK') {
          this.dataSource.data = []
          this.getMicros()
        }
      }
    )
  }

  checkboxSelecao(status: string) {
    this.selection.clear();
    if(status === 'EM LOJA') {
      this.selection.select(...this.microsTb.filter((m: Micros) => m.STATUS !== 'FURTO'))
      this.eventoSelecao(this.selection)
    }
    this.selection.select(...this.microsTb.filter((m: Micros) => m.STATUS === status))
    this.eventoSelecao(this.selection)
  }

  editarMicro(micro: Micros) {
    this._dialog.open(DialogEditarMicroComponent, {
      data: micro
    }).afterClosed().subscribe(
      (result:any) => {
        if(result === 'OK') {

          this.filterTable = ''
          this.dataSource.filter = ''
          this.selection.clear()
          this.eventoSelecao(this.selection)
          this.dataSource.data = []
          this.getMicros()

        }
      }
    )
  }

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
      this.eventoSelecao(this.selection)
      return;
    }

    if(this.dataSource.filteredData.length > 0) {
      this.selection.select(...this.dataSource.filteredData)
      this.eventoSelecao(this.selection)
    } else {
      console.log(this.selection.selected.length)

    }

  }

  microSelecionado() {
    this.eventoSelecao(this.selection)
  }

  eventoSelecao(selection: SelectionModel<any>) {

    this.eventoAlterarMicro.emit({
      qtdMicrosSelecao: selection.selected.length,
      data: selection.selected
    })
  }


  applyFilter(event: Event) {
    this.selection.clear()
    this.eventoSelecao(this.selection)
    this.qtdMicrosSelecionado = this.selection.selected.length
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.qdtMicros = this.dataSource.filteredData.length

  }

}

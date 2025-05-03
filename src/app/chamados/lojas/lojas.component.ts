import { Observable } from 'rxjs';
import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { LoginService } from 'src/app/login/login.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogNovaLojaComponent } from 'src/app/dialogs/dialog-nova-loja/dialog-nova-loja.component';
import { DialogEditarLojaComponent } from 'src/app/dialogs/dialog-editar-loja/dialog-editar-loja.component';
import { DialogNovoServicoLojaComponent } from 'src/app/dialogs/dialog-novo-servico-loja/dialog-novo-servico-loja.component';
import { DialogMicrosComponent } from 'src/app/dialogs/dialog-micros/dialog-micros.component';
import { DialogAdicionarMicroComponent } from 'src/app/dialogs/dialog-adicionar-micro/dialog-adicionar-micro.component';


@Component({
  selector: 'app-lojas',
  templateUrl: './lojas.component.html',
  styleUrls: ['./lojas.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LojasComponent implements OnInit {
  dataSource = new MatTableDataSource<Lojas>();
  columnsToDisplay:string[] = ['LOJA', 'LOCAL', 'ENDERECO', 'NUMERO', 'BAIRRO','LOCALIDADE', 'CEP', 'STATUS'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedLoja!: Lojas | null;

  allMicros: Micros[] = []
  qtdMicros:Micros[] = []
  microsEmLoja:Micros[] = []
  microsFurtado:Micros[] = []

  allServicos: Servicos[] = []
  servicos:  Servicos[] = []

  constructor(
    private _service: LoginService,
    private _dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.getLojas()
    this.getMicros()
    this.getServicos()
  }

  novaLoja() {
    this._dialog.open(DialogNovaLojaComponent, {
      width: '61%'
    }).afterClosed().subscribe(
      (result) => {
        if(result == 'sucesso') {
          this.getLojas()
        }
      }
    )
  }

  editarEndereco(loja: Lojas) {
    this._dialog.open(DialogEditarLojaComponent, {
      width: '61%',
      data: {
        data: loja,
        titulo: `Editar: ${loja.LOJA}`
      }
    })
  }

  dialogServico(loja: Lojas, acao: string, servico: Servicos | null = null) {
    this._dialog.open(DialogNovoServicoLojaComponent, {
      width: '61%',
      data: {
        acao: acao,
        loja: loja,
        servico: servico
      }
    }).afterClosed().subscribe(
      (result: any) => {
        if(result) {
          this.getLojas()
          this.getServicos()
        }
      }
    )
  }

  dialogMicros(loja: Lojas, micros:Micros[], status: string) {
    this._dialog.open(DialogMicrosComponent, {
      width: '70%',
      data: {
        loja: loja,
        micros: micros,
        status: status
      },
      position: {
        left: '22%'
      }
    }).afterClosed().subscribe(
      (result: any) => result ? [this.getMicros(), this.filterInfoLoja(loja), this.explandedClick(loja)] : null
    )
  }

  getLojas() {
    this._service.getLojas().subscribe(
      (data:Lojas[]) => {
        this.dataSource.data = data
      }
    )
  }

  dialogAdicionarMicro(loja: Lojas) {
    this._dialog.open(DialogAdicionarMicroComponent, {
      data: loja,
      width: '26%'
    }).afterClosed().subscribe(
      (result: any) => {
        if(result === 'OK') {

          this.getMicros()
          this.filterInfoLoja(loja)
          this.explandedClick(loja)
        }
      }
    )
  }

  getMicros() {
    this._service.getMicros().subscribe(
      (result: Micros[]) =>{
        this.allMicros = result
      }
    )
  }

  getServicos(idLoja:number = 0) {
    this._service.getSevicosLoja(idLoja).subscribe(
      (result: Servicos[]) => {
       this.allServicos = result
      }

    )
  }

  filterInfoLoja(loja: Lojas) {
    this.microsEmLoja = this.allMicros.filter((micro:Micros) => (micro.STATUS !== 'FURTO' && micro.ID_LOJA === loja.ID))
    this.microsFurtado = this.allMicros.filter((micro: Micros) => (micro.STATUS == 'FURTO' && micro.ID_LOJA === loja.ID ))
    this.servicos = this.allServicos.filter((servico: Servicos) => servico.ID_LOJA === loja.ID)
  }

  explandedClick(item: Lojas) {
    console.log('teste')
    this.expandedLoja = this.expandedLoja === item ? null : item

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

export interface Lojas {
  ID: string,
  LOJA: string,
  LOCAL: string,
  ENDERECO: string,
  COMPLEMENTO: string,
  NUMERO: string,
  BAIRRO: string,
  LOCALIDADE: string
  CEP: string,
  HORARIO_FUNC: string,
  STATUS: string
}

export interface Micros {
  ID_LOJA: string,
  LOJA: string,
  ID_MICRO: string,
  SERVICE_TAG: string,
  ASSET_TAG: string,
  FABRICANTE: string,
  MODELO: string,
  STATUS: string
}

export interface Servicos {
  ID_LOJA: string,
  LOJA: string,
  ID_CNPJ: string,
  CNPJ: string,
  RAZAO: string,
  ID_SERVICO: string,
  OPERADORA: string,
  TIPO_SERVICO: string,
  DESIGNACAO: string,
  VELOCIDADE: string,
  OBSERVACAO: string
}

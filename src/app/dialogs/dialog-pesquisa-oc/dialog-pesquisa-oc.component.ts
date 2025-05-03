import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Lojas } from 'src/app/chamados/lojas/lojas.component';
import { LoginService } from 'src/app/login/login.service';

@Component({
  selector: 'app-dialog-pesquisa-oc',
  templateUrl: './dialog-pesquisa-oc.component.html',
  styleUrls: ['./dialog-pesquisa-oc.component.css']
})
export class DialogPesquisaOcComponent implements OnInit {

  dataSource = new MatTableDataSource<any>()
  columnsToDisplay = ['ID', 'MATERIAL', 'QTD'];

  filterOptions: Lojas[] = []
  lojas: Lojas[] = []
  formGroup!: FormGroup
  motivos: any[] = []
  subMotivos: any[] = []
  ocorrencias: Ocorrencia[] = []

  constructor(
    private _dialoRef: MatDialogRef<DialogPesquisaOcComponent>,
    private _service: LoginService,
    private _fb: FormBuilder,
    private _router: Router
  ) {
   }

  ngOnInit(): void {
    this.formulario()
    this.getLojas()
    this.getMotivos()
    this.getTotalMateriais()

    this._dialoRef.disableClose = true

    this.formGroup.get('idSubmotivo')?.reset({value: '', disabled: true})

    this.formGroup.get('loja')?.valueChanges.subscribe(
      value => this.filterOptions = this.filterData(value || '')
    )

  }

  formulario() {
    this.formGroup = this._fb.group({
      acao: 'pesquisaOcorrencia',
      loja: [''],
      idLoja: [''],
      ocorrencia: [''],
      idMotivo: [''],
      idSubmotivo: ['']
    })
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

  validaLojaSelecionada() {
    let lojaSelecionada = this.formGroup.get('loja')?.value

    if (lojaSelecionada === null) {
      return true
    }

    if(lojaSelecionada != '') {
      let idLoja = this.lojas.filter((l) => l.LOJA === lojaSelecionada)

      if(idLoja.length === 0) {
        this._service.msg('Selecione uma loja valida da lista, ou, filtre por um dos campos.')
        return false
      } else {
        this.formGroup.get('idLoja')?.reset(idLoja[0].ID)
      }
    }

    return true

  }

  pesquisaOc() {

    if((this.formGroup.get('loja')?.value != '' || this.formGroup.get('loja')?.value != null)) {
      this.validaLojaSelecionada()
    }

    if (!this.validaLojaSelecionada()) {
      return
    }

    if(
      (this.formGroup.get('idLoja')?.value === '' || this.formGroup.get('idLoja')?.value === null ) &&
      (this.formGroup.get('ocorrencia')?.value === '' || this.formGroup.get('ocorrencia')?.value === null) &&
      (this.formGroup.get('idMotivo')?.value === '' || this.formGroup.get('idMotivo')?.value === null ) &&
      (this.formGroup.get('idSubmotivo')?.value === '' || this.formGroup.get('idSubmotivo')?.value === null)
      ) {
      this._service.msg('Filtre pelo menos um dos campos, ou, verifique a loja selecionada.')

    } else {

      if(localStorage.hasOwnProperty('resultadoPesquisa')) {
        localStorage.removeItem('resultadoPesquisa')
      }

      this.formGroup.get('acao')?.reset('pesquisaOcorrencia')

      this._service.pesquisaOcorrencia(JSON.stringify(this.formGroup.value)).subscribe(
        (result: any) => {
          this.ocorrencias = result

          const obj = {
            array: result
          }

          localStorage.setItem('resultadoPesquisa', JSON.stringify(obj) )
          this._router.navigate(['chamados/ocorrencias/tabelaPesquisaOc'])
          this._dialoRef.close(this.ocorrencias)

        })

    }
  }

  getTotalMateriais() {
    this._service.getTotalMateriais().subscribe(
      (result: any) => {
        this.dataSource.data = result
      }
    )
  }

  pesquisaOcorrenciaMaterial(id: number) {
    this.ocorrencias = []
    const obj = {
      acao: 'pesquisaOcorrenciaMaterial',
      id_material: id
    }

    this._service.pesquisaOcorrenciaMaterial(JSON.stringify(obj)).subscribe(
      (result: any) => {

        this.ocorrencias = result
        const obj2 = {
          array: result
        }

        localStorage.setItem('resultadoPesquisa', JSON.stringify(obj2) )
        this._router.navigate(['chamados/ocorrencias/tabelaPesquisaOc'])
        this._dialoRef.close(this.ocorrencias)

      }
    )
  }

  filterData(value: string): Lojas[] {
    const filterLoja = value.toLowerCase()

    return this.lojas.filter(loja => loja.LOJA.toLowerCase().includes(filterLoja))
  }

}

interface Ocorrencia {
  ID: string,
  LOJA: string,
  OCORRENCIA: string,
  MOTIVO: string,
  SUBMOTIVO: string,
  DATA: Date,
  DATA_ATEND: Date,
  STATUS: string
}

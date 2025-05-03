import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-dialog-lojas',
  templateUrl: './dialog-lojas.component.html',
  styleUrls: ['./dialog-lojas.component.css']
})
export class DialogLojasComponent implements OnInit {

  dataSource = new MatTableDataSource<Loja>();
  columnsToDisplay:string[] = ['LOJA', 'STATUS'];

  constructor(
    private _dialogRef: MatDialogRef<DialogLojasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Loja[],
  ) { }

  ngOnInit(): void {
    this.setData(this.data)
    this._dialogRef.disableClose = true
  }

  setData(lojas: Loja[]) {
    this.dataSource.data = lojas
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

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

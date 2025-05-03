import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ocorrencias',
  templateUrl: './ocorrencias.component.html',
  styleUrls: ['./ocorrencias.component.css']
})
export class OcorrenciasComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {

    console.log(this._router.routerState.snapshot.url)
    this._router.navigate(['chamados/ocorrencias/tabela-ocorrencias'])

    if(localStorage.hasOwnProperty('resultadoPesquisa')) {
      localStorage.removeItem('resultadoPesquisa')
    }
  }

  navegar() {

  }


}

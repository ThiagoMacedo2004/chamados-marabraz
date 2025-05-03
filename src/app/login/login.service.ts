import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarLoginComponent } from './snack-bar-login/snack-bar-login.component';
import { Lojas, Micros, Servicos } from '../chamados/lojas/lojas.component';
import { first } from 'rxjs';
import { Ocorrencia } from '../chamados/ocorrencias/tabela-ocorrencias/tabela-ocorrencias.component';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // private URL_USUARIOS = 'http://www.infraestrutura.com.br/ocorrencias_php/src/api/ApiUsuarios.php'
  // private URL_LOJAS = 'http://www.infraestrutura.com.br/ocorrencias_php/src/api/ApiLojas.php'
  // private URL_MICROS = 'http://www.infraestrutura.com.br/ocorrencias_php/src/api/ApiMicros.php'
  // private URL_FORM = 'http://www.infraestrutura.com.br/ocorrencias_php/src/api/ApiFormularios.php'
  // private URL_OC = 'http://www.infraestrutura.com.br/ocorrencias_php/src/api/ApiOcorrencias.php'

  private BASE_PATH = 'http://www.infraestrutura.com.br/ocorrencias_php/src/api'
  // private BASE_PATH = 'http://cpl-inf-02.marabraz.com.br/ocorrencias_php/src/api'



  autenticado: boolean = false
  usuario: any

  constructor(
    private _http:HttpClient,
    private _msg:MatSnackBar,
    private _router: Router
  ) { }

  public autenticacao(obj: any, path: string) {
    return this._http.post(`${this.BASE_PATH}${path}`, obj).subscribe(
      (data: any) => {
        this.veriifcarAutenticacao(data)
      },
      (e: HttpErrorResponse) => {
        console.log(e)
        this.msg(`Verifique o servidor: ${e.url}`)
      }
    )
  }

  public veriifcarAutenticacao(result: any) {
    if(result.sucesso) {
      this.autenticado = true
      this.usuario = result.sucesso
      this._router.navigate(['/chamados/ocorrencias'])
    } else {
      this.autenticado = false
    }
    result.sucesso ? this.msg(`Bem vindo, ${result.sucesso.NOME}`) : this.msg(result.erro)
  }

  public logOff() {
    this.autenticado = false
    this._router.navigate([''])
  }

  /**
   *
   * API USUARIOS
   *
   */

  public getUsuarios() {
  return this._http.get(`${this.BASE_PATH}/ApiUsuarios.php` , {
      params: {
        acao: 'getUsuarios',
        matricula: this.usuario.MATRICULA
      }
    })
  }

  public alterarStatusUsuario(obj: string) {
  return this._http.post(`${this.BASE_PATH}/ApiUsuarios.php` , obj).pipe(
      (first())
    )
  }

  public cadastrarNovoUsuario(obj: any) {
  return this._http.post(`${this.BASE_PATH}/ApiUsuarios.php` , obj).pipe(
      first()
    )
  }

  public editarUsuario (obj: any) {
    return this._http.post(`${this.BASE_PATH}/ApiUsuarios.php`, obj).pipe(
      first()
    )
  }

  /**
   *
   * API LOJAS
   */

  public getLojas() {
    return this._http.get<Lojas[]>(`${this.BASE_PATH}/ApiLojas.php`, {
      params: {
        acao: 'getLojas'
      }
    }).pipe(
      (first())
    )
  }

  public adicionarLoja(obj: any) {
    return this._http.post(`${this.BASE_PATH}/ApiLojas.php`, obj)
  }

  public editarLoja(obj:any) {
    return this._http.post(`${this.BASE_PATH}/ApiLojas.php`, obj)
  }

  public adicionarServicoLoja(obj: any) {
    return this._http.post(`${this.BASE_PATH}/ApiLojas.php`, obj)
  }

  public getSevicosLoja(idLoja: number) {
    return this._http.get<Servicos[]>(`${this.BASE_PATH}/ApiLojas.php`, {
      params: {
        acao: 'getServicosLoja',
        idLoja: idLoja
      }
    }).pipe(
      (first())
    )
  }

  public editarServicoLoja(obj: any) {
    return this._http.post(`${this.BASE_PATH}/ApiLojas.php`, obj)
  }

  public getCpnjs(){
    return this._http.get(`${this.BASE_PATH}/ApiLojas.php`, {
      params: {
        acao: 'getCnpjs'
      }
    })
  }

  /**
   *
   * API MICROS
   */

  public adicionarMicro(obj: any) {
    return this._http.post(`${this.BASE_PATH}/ApiMicros.php`, obj)
  }

  public getMicros() {
    return this._http.get<Micros[]>(`${this.BASE_PATH}/ApiMicros.php`, {
      params: {
        acao: 'getMicros'
      }
    }).pipe(
      first())
  }

  public getMicrosLoja(idLoja: string) {
    return this._http.get(`${this.BASE_PATH}/ApiMicros.php`, {
      params: {
        acao: 'getMicrosLoja',
        idLoja: idLoja
      }
    }).pipe(
      first()
    )
  }

  public movimentacaoMicro(obj: any) {
    return this._http.post(`${this.BASE_PATH}/ApiMicros.php`, obj).pipe(
      first()
    )
  }

  public getHistoricoMicro(idMicro: number) {
    return this._http.get<any>(`${this.BASE_PATH}/ApiMicros.php`, {
      params: {
        acao   : 'getHistoricoMicro',
        idMicro: idMicro
      }
    }).pipe(
      (first())
    )
  }

  public editarMicro(obj: any) {
    return this._http.post<any>(`${this.BASE_PATH}/ApiMicros.php`, obj).pipe(
      first()
    )
  }

  /***
   *
   *
   * API GERAR OCORRÊNCIA
   *
   */

  public getMotivos() {
    return this._http.get(`${this.BASE_PATH}/ApiOcorrencias.php`, {
      params: {
        acao: 'getMotivos'
      }
    }).pipe(
      first()
    )
  }

  public getSubMotivos(idMotivo: string) {
    return this._http.get(`${this.BASE_PATH}/ApiOcorrencias.php`, {
      params: {
        acao: 'getSubMotivos',
        idMotivo: idMotivo
      }
    }).pipe(
      first()
    )
  }

  public adicionaSubmomtivo(obj: any) {
    return this._http.post(`${this.BASE_PATH}/ApiOcorrencias.php`, obj).pipe(first())
  }

  public gravarOcorrencia(obj: any) {
    return this._http.post(`${this.BASE_PATH}/ApiOcorrencias.php`, obj).pipe(
      first()
    )
  }

  public getOcorrencias() {
    return this._http.get<Ocorrencia[]>(`${this.BASE_PATH}/ApiOcorrencias.php`, {
      params: {
        acao: 'getOcorrencias'
      }
    }).pipe(
      first()
    )
  }

  public finalizarOc(obj: any) {
    return this._http.post(`${this.BASE_PATH}/ApiOcorrencias.php`, obj).pipe(first())
  }

  public detalheOcorrencia(obj: any) {
    return this._http.get(`${this.BASE_PATH}/ApiOcorrencias.php`, {
      params: {
        acao: obj.acao,
        ocorrencia: obj.ocorrencia,
        status: obj.status,
        id: obj.id
      }
    }).pipe(first())
  }

  public pesquisaOcorrencia(obj: any) {
    return this._http.post(`${this.BASE_PATH}/ApiOcorrencias.php`, obj).pipe(first())
  }

  public getTotalMateriais() {
    return this._http.get(`${this.BASE_PATH}/ApiOcorrencias.php`, {
      params: {
        acao: 'getTotalMateriais'
      }
    }).pipe(first())
  }

  public pesquisaOcorrenciaMaterial(obj: any) {
    return this._http.post(`${this.BASE_PATH}/ApiOcorrencias.php`, obj).pipe(first())
  }

  public getVeiculos() {
    return this._http.get(`${this.BASE_PATH}/ApiOcorrencias.php`, {
      params: {
        acao: 'getVeiculos'
      }
    }).pipe(
      first()
    )
  }

  public getMateriais() {
    return this._http.get(`${this.BASE_PATH}/ApiOcorrencias.php`, {
      params: {
        acao: 'getMateriais'
      }
    }).pipe (
      first()
    )
  }

  deletaOcorrencia(obj: any) {
    return this._http.post(`${this.BASE_PATH}/ApiOcorrencias.php`, obj).pipe(first())
  }

  pdfOs(path: string, obj: any) {
    return this._http.post(path, obj, {
      responseType: 'blob' as 'json'
    }).pipe(first())
  }

  enviarEmail(obj: any) {
    return this._http.post(`${this.BASE_PATH}/ApiOcorrencias.php`, obj).pipe(first())
  }

  /**
   *
   * outros
   *
   */

  public getApiCep(obj: any) {
    console.log(obj.url)
    return this._http.get(obj.url, {
      params: {
        acao: obj.acao,
        cep: obj.cep
      }
    })
  }

  public msg(data:any) {
    this._msg.openFromComponent(SnackBarLoginComponent, {
      duration: 4000,
      verticalPosition: 'top',
      data:data
    })
  }

  public excel(obj: any) {
    return this._http.post(`${this.BASE_PATH}/ApiFormularios.php`, obj, {
      responseType: 'blob' as 'json'
    })
  }
}

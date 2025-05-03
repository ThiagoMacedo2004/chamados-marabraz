import { LoginService } from '../login/login.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree  } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardsService implements CanActivate {

  constructor(
    private _service: LoginService,
    private _router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {


    if(this._service.autenticado){
      return true
    }
      this._router.navigate(['/login'])
      return false
  }
}

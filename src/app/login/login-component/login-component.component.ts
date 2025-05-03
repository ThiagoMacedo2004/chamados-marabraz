import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/shared/erros-form';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent implements OnInit {

  formGroup!: FormGroup
  matcher = new MyErrorStateMatcher();
  hide: boolean = true
  usuario: {} = {}
  path: string = '/ApiUsuarios.php'

  constructor(
    private _fb: FormBuilder,
    private _service: LoginService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.formulario()
    this._service.logOff()
  }


  formulario() {
    this.formGroup = this._fb.group({
      acao     : 'autenticacao',
      matricula: ['', Validators.required],
      senha    : ['', Validators.required]
    })
  }


  onSubmit() {
    const obj = this.formGroup.value
    this._service.autenticacao(obj, this.path)

  }

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponentComponent } from './login-component/login-component.component';
import { AppMaterialModule } from '../shared/app-material/app-material.module';
import { SnackBarLoginComponent } from './snack-bar-login/snack-bar-login.component';


@NgModule({
  declarations: [
    LoginComponentComponent,
    SnackBarLoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    AppMaterialModule,

  ]
})
export class LoginModule { }

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
@Component({
  selector: 'app-snack-bar-login',
  templateUrl: './snack-bar-login.component.html',
  styleUrls: ['./snack-bar-login.component.css']
})
export class SnackBarLoginComponent implements OnInit {

  constructor(
    private _snackBarRef: MatSnackBarRef<SnackBarLoginComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) { }

  ngOnInit(): void {

  }

  fechar() {
    this._snackBarRef.dismiss()
  }

}

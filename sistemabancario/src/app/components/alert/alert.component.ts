import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  constructor(private router: Router){

  }
  menuItems1 = ["Inicio", "Necesidades", "Producto y Servicios", "Educacion Financiera"]
  gologin(){
    this.router.navigate(['/login'])
  }
}

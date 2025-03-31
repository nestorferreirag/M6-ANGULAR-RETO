import { Component } from '@angular/core';
import { State } from '../state/state';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
constructor(public state:State){}
}

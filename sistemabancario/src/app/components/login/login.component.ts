import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { State } from '../state/state';
import { delay, map, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);
  public prices = 20000;

  constructor(private state: State, private router: Router) {
    const obs = of(1, 2, 3, 4).pipe(
      delay(10000),
      map(value => value *2)
    );
    obs.subscribe(value => console.log(value));
   }

  loginForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  })

    submit() {
      if (this.loginForm.valid) {
        const usuario = this.loginForm.get('username')?.value;
        const password = this.loginForm.get('password')?.value;
        if(usuario === 'nestor' && password === '12345678') {
          console.log('Usuario logueado');
          this.state.userEmail = 'nferreira90@hotmail.com';
          console.log('Usuario logueado');
          this.router.navigate(['/boards']);
        }else {
          alert('Usuario o contraseña incorrectos');
        }
      } 
    }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { loginGuard } from './guard.guard';
import { BoardsComponent } from './components/boards/boards.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    //canActivate:[loginGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./components/home/home.component').then( m => m.HomeComponent),
    // canActivate: [guardGuard]
  },
  {
    path: 'boards',
    component: BoardsComponent,
    canActivate:[loginGuard]
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

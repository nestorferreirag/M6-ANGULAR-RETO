import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { State } from "./components/state/state";

@Injectable({providedIn: 'root'})
export class loginGuard implements CanActivate {

  constructor(private router: Router, private state: State) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    let email = '';
    this.state.userEmail$.subscribe((value) => {
      email = value
    });
    if (email == 'nferreira90@hotmail.com') {
      return true;
    } else {
return false;
  }
}
}

import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
@Injectable({
    providedIn: 'root'
})
export class State {
    private _userEmail = new BehaviorSubject<string>(null);
    private _password = new BehaviorSubject<string>(null);

    get userEmail$(): Observable<string>{
        return this._userEmail.asObservable();
    }
    set userEmail(value:string){
        this._userEmail.next(value);
    }

    get password$(): Observable<string>{
        return this._password.asObservable();
    }
    set password(value:string){
        this._password.next(value);
    }
}

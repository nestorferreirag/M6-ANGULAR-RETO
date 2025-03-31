import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperacionesService {
  private urlDepositoSuc =  'http://localhost:8080/operaciones/depositoDesdeSucursal';
  private urlDepositoCuenta =  'http://localhost:8080/operaciones/depositoDesdeCuenta';
  private urlDepositoCajero =  'http://localhost:8080/operaciones/depositoDesdeCajero';
  private urlCompraFisica =  'http://localhost:8080/operaciones/compraFisica';
  private urlCompraWeb =  'http://localhost:8080/operaciones/compraWeb';
  private urlRetiroCajero =  'http://localhost:8080/operaciones/retiroCajero';
  constructor(private httpClient: HttpClient) { }

  postrealizarDepositoSucursal(cuenta: number, monto: number): Observable<string> {
    const body = { cuenta, monto };
    return this.httpClient.post<string>(this.urlDepositoSuc, body, { responseType: 'text' as 'json' })
      .pipe(
        catchError(this.handleError) // Manejo de errores
      );
  }

  postrealizarDepositoCuenta(cuenta: number, monto: number): Observable<string> {
    const body = { cuenta, monto };
    return this.httpClient.post<string>(this.urlDepositoCuenta, body, { responseType: 'text' as 'json' })
      .pipe(
        catchError(this.handleError) // Manejo de errores
      );
  }

  postrealizarDepositoCajero(cuenta: number, monto: number): Observable<string> {
    const body = { cuenta, monto };
    return this.httpClient.post<string>(this.urlDepositoCajero, body, { responseType: 'text' as 'json' })
      .pipe(
        catchError(this.handleError) // Manejo de errores
      );
  }

  postrealizarCompraFisica(cuenta: number, monto: number): Observable<string> {
    const body = { cuenta, monto };
    return this.httpClient.post<string>(this.urlCompraFisica, body, { responseType: 'text' as 'json' })
      .pipe(
        catchError(this.handleError) // Manejo de errores
      );
  }

  postrealizarCompraWeb(cuenta: number, monto: number): Observable<string> {
    const body = { cuenta, monto };
    return this.httpClient.post<string>(this.urlCompraWeb, body, { responseType: 'text' as 'json' })
      .pipe(
        catchError(this.handleError) // Manejo de errores
      );
  }

  postrealizarRetiroCajero(cuenta: number, monto: number): Observable<string> {
    const body = { cuenta, monto };
    return this.httpClient.post<string>(this.urlRetiroCajero, body, { responseType: 'text' as 'json' })
      .pipe(
        catchError(this.handleError) // Manejo de errores
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la API:', error);
    
    let mensajeError = 'Error en la transacción, intenta de nuevo más tarde.';
  
    if (error.error instanceof ErrorEvent) {
      // Error de cliente o de red
      mensajeError = `Error de red: ${error.error.message}`;
    } else if (error.status === 0) {
      // Error de conexión (Servidor no responde)
      mensajeError = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    } else if (error.error && typeof error.error === 'string') {
      // Si el backend devuelve un error en texto plano
      mensajeError = error.error;
    } else if (error.error?.message) {
      // Si el backend envía un error en formato JSON con un campo "message"
      mensajeError = error.error.message;
    } else if (error.message) {
      // Si Angular detecta un error HTTP y lo encapsula
      mensajeError = error.message;
    } else {
      // Otros errores del servidor con código de estado
      mensajeError = `Error en el servidor (${error.status}): ${error.statusText}`;
    }
  
    return throwError(() => new Error(mensajeError));
  }
}

import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {
  private urlconsultasaldo = 'http://localhost:8080/consultas/saldo';
  private urlconsultatx = 'http://localhost:8080/consultas/transacciones';
  constructor(private httpClient: HttpClient) { }


  postConsultarSaldo(cuentaId: number): Observable<string> {
    const body = { cuentaId };
    return this.httpClient.post<string>(this.urlconsultasaldo, body, { responseType: 'text' as 'json' })
      .pipe(
        catchError(this.handleError) // Manejo de errores
      );
  }

  postConsultarTx(cuentaId: number): Observable<string> {
    const body = { cuentaId };
    return this.httpClient.post<string>(this.urlconsultatx, body, { responseType: 'text' as 'json' })
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

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConsultasService } from 'src/app/servicios/consultas.service';
import { OperacionesService } from 'src/app/servicios/operaciones.service';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent {

transaccionForm: FormGroup = new FormGroup({});
transaccionFormC: FormGroup = new FormGroup({});
mensajeRespuesta: string = '';
errorMensaje: string = '';
mensajeRespuestaC: string = '';
mensajeRespuestaT: any[] = [];
errorMensajeC: string = ''
mostrarForm: boolean = false;
mostrarFormC: boolean = false;
tituloFormulario = '';
tipoTransaccion: string = '';



constructor(
  private consultasService: ConsultasService,
  private fb: FormBuilder,
  private operacionesService: OperacionesService
) {
  this.transaccionForm = this.fb.group({
    cuenta: ['', [Validators.required]],
    monto: ['', [Validators.required, Validators.min(1)]]
  });
  this.transaccionFormC = this.fb.group({
    cuentaId: ['', [Validators.required]]
  });
}

mostrarFormulario(tipo: string) {
      this.mostrarForm = true;
      this.mostrarFormC = false;
      this.tipoTransaccion = tipo;

      // 🧹 Limpiar mensajes y resetear formulario
      this.mensajeRespuesta = '';
      this.errorMensaje = '';
      this.transaccionForm.reset(); 
  
      switch (tipo) {
        case 'depSuc':
          this.tituloFormulario = 'Depósito desde Sucursal';
          break;
        case 'depCuenta':
          this.tituloFormulario = 'Depósito desde Cuenta';
          break;
        case 'depCajero':
          this.tituloFormulario = 'Depósito desde Cajero';
          break;
        case 'comFis':
          this.tituloFormulario = 'Compra Física';
          break;
        case 'comWeb':
          this.tituloFormulario = 'Compra Web';
          break;
        case 'retCaj':
          this.tituloFormulario = 'Retiro desde Cajero';
          break;
        default:
          this.tituloFormulario = 'Transacción';
      }
    }

mostrarFormularioC(tipo: string) {
      this.mostrarForm = false;
      this.mostrarFormC = true;
      this.tipoTransaccion = tipo;

      // 🧹 Limpiar mensajes y resetear formulario
      this.mensajeRespuestaC = '';
      this.errorMensajeC = '';
      this.transaccionFormC.reset(); 
  
      switch (tipo) {
        case 'conSal':
          this.tituloFormulario = 'Consultar Saldo';
          break;
        case 'conTx':
          this.tituloFormulario = 'Consultar Transacciones';
          break;
        default:
          this.tituloFormulario = 'Consultas';
      }
    }
    
onSubmit() {
      if (this.transaccionForm.invalid) {
        this.transaccionForm.markAllAsTouched(); // 🚨 Marcar todos los campos como "tocados" para que se vean los errores
        this.errorMensaje = '⚠️ Por favor, completa todos los campos correctamente.';
    return;
      }  
      const { cuenta, monto } = this.transaccionForm.value;
      console.log('Enviando datos:', { cuenta, monto });
  
      let transaccionObservable;
  
      switch (this.tipoTransaccion) {
        case 'depSuc':
          transaccionObservable = this.postDepositoSuc(cuenta, monto);
          break;
        case 'depCuenta':
          transaccionObservable = this.postDepositoCuenta(cuenta, monto);
          break;
        case 'depCajero':
          transaccionObservable = this.postDepositoCajero(cuenta, monto);
          break;
        case 'comFis':
          transaccionObservable = this.postCompraFisica(cuenta, monto);
          break;
        case 'comWeb':
          transaccionObservable = this.postCompraWeb(cuenta, monto);
          break;
        case 'retCajero':
          transaccionObservable = this.postRetiroCajero(cuenta, monto);
          break;
        default:
          this.errorMensaje = 'Transacción no reconocida.';
          return;
      }
  
      transaccionObservable.subscribe({
        next: (respuesta) => {
          console.log('Transacción exitosa:', respuesta);
          this.mensajeRespuesta = respuesta;
          this.errorMensaje = ''; // Limpiar errores si la transacción es exitosa
        },
        error: (error) => {
          console.error('Error en la transacción:', error);
    
          // Mostrar error en pantalla
          this.errorMensaje = error.message;
        }
      });
    }

onSubmitC() {
      if (this.transaccionFormC.invalid) {
        this.transaccionFormC.markAllAsTouched(); // 🚨 Marcar campos como "tocados" para que se vean los errores
        this.errorMensajeC = '⚠️ Por favor, completa todos los campos correctamente.';
        return;
      }
  
      const {cuentaId} = this.transaccionFormC.value;
      console.log('Enviando datos:', { cuentaId});
  
      let consultaObservable;
  
      switch (this.tipoTransaccion) {
        case 'conSal':
          consultaObservable = this.postConsultaSal(cuentaId);
          break;
        case 'conTx':
          consultaObservable = this.postConsultaTx(cuentaId);
            break;
        default:
          this.errorMensaje = 'Consulta no reconocida.';
          return;
      }
  
      consultaObservable.subscribe({
        next: (respuesta) => {
          console.log('Consulta exitosa:', respuesta);
          this.errorMensajeC = '';
          if (this.tipoTransaccion === 'conTx') {
            this.mensajeRespuestaT = this.parsearTransacciones(respuesta); // Convertir a objetos
          } else {
            this.mensajeRespuestaC = respuesta; // Mantener respuesta en texto plano para Saldo
          }
        },
        error: (error) => {
          console.error('Error en la consulta:', error);
          this.errorMensajeC = error.message;
        }
      });

      
    }

    parsearTransacciones(respuesta: string): any[] {
      const transacciones: any[] = [];
      const regex = /Transaccion\{transaccionId=(\d+), cuentaId1=Cuenta\{cuentaId=(\d+)\}, tipoTransaccion='(.*?)', monto=(\d+\.\d+), fecha='(.*?)'\}/g;
      
      let match;
      while ((match = regex.exec(respuesta)) !== null) {
        transacciones.push({
          transaccionId: parseInt(match[1]),
          cuentaId: parseInt(match[2]),
          tipoTransaccion: match[3],
          monto: parseFloat(match[4]),
          fecha: match[5]
        });
      }
    
      return transacciones;
    }

    postConsultaSal(cuentaC: number) {
      return this.consultasService.postConsultarSaldo(cuentaC)
        .pipe(
          catchError(err => {
            console.error('Error en la API:', err);
            return throwError(() => err); // Reenviamos el error al `subscribe()`
          })
        );
    }

    postConsultaTx(cuentaC: number) {
      return this.consultasService.postConsultarTx(cuentaC)
        .pipe(
          catchError(err => {
            console.error('Error en la API:', err);
            return throwError(() => err); // Reenviamos el error al `subscribe()`
          })
        );
    }

    postDepositoSuc(cuenta: number, monto: number) {
      return this.operacionesService.postrealizarDepositoSucursal(cuenta, monto)
        .pipe(
          catchError(err => {
            console.error('Error en la API:', err);
            return throwError(() => err); // Reenviamos el error al `subscribe()`
          })
        );
    }
    
    postDepositoCuenta(cuenta: number, monto: number) {
      return this.operacionesService.postrealizarDepositoCuenta(cuenta, monto)
        .pipe(
          catchError(err => {
            console.error('Error en la API:', err);
            return throwError(() => err);
          })
        );
    }

    postDepositoCajero(cuenta: number, monto: number) {
      return this.operacionesService.postrealizarDepositoCajero(cuenta, monto)
        .pipe(
          catchError(err => {
            console.error('Error en la API:', err);
            return throwError(() => err);
          })
        );
    }

    postCompraFisica(cuenta: number, monto: number) {
      return this.operacionesService.postrealizarCompraFisica(cuenta, monto)
        .pipe(
          catchError(err => {
            console.error('Error en la API:', err);
            return throwError(() => err);
          })
        );
    }

    postCompraWeb(cuenta: number, monto: number) {
      return this.operacionesService.postrealizarCompraWeb(cuenta, monto)
        .pipe(
          catchError(err => {
            console.error('Error en la API:', err);
            return throwError(() => err);
          })
        );
    }

    postRetiroCajero(cuenta: number, monto: number) {
      return this.operacionesService.postrealizarRetiroCajero(cuenta, monto)
        .pipe(
          catchError(err => {
            console.error('Error en la API:', err);
            return throwError(() => err);
          })
        );
    }
}

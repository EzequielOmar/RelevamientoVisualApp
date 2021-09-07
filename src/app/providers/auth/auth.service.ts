import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { Validator } from './Validators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: Observable<firebase.User | null>;
  constructor(private angularFireAuth: AngularFireAuth) {
    this.userData = angularFireAuth.authState;
  }

  /*
   * Recibe email y pass
   * Success -> loguea al usuario actualizando
   * el estado de userData(Observable) y retorna respuesta (evento y usuario)
   * Error-> retorna el texto del error que corresponda listo
   * para imprimir en pantalla.
   * *Posibles errores de signInWithEmailAndPassword:*
   *  auth/invalid-email
   *  auth/user-disabled
   *  auth/user-not-found
   *  auth/wrong-password
   * @param email string email del usuario
   * @param password string password del usuario  */
  signIn = async (email: string, password: string) =>
    await this.angularFireAuth
      .signInWithEmailAndPassword(Validator.email(email), password)
      .then((res) => res)
      .catch((error) => {
        if (error.code === 'auth/user-disabled') {
          throw new Error('El usuario ha sido deshabilitado.');
        }
        if (error.code === 'auth/user-not-found') {
          throw new Error('No existe un usuario con estos datos.');
        }
        throw new Error('Datos incorrectos.');
      });

  /*
   * Recibe email y pass
   * Success -> crea y loguea al nuevo usuario actualizando
   * el estado de userData(Observable) y retorna respuesta (evento y usuario)
   * Error-> retorna el texto del error que corresponda listo
   * para imprimir en pantalla.
   * *Posibles errores de createUserWithEmailAndPassword:*
   *  auth/email-already-in-use
   *  auth/invalid-email
   *  auth/operation-not-allowed
   *  auth/weak-password
   * @param email string email del usuario
   * @param password string password del usuario
   */
  signUp = async (email: string, password: string) =>
    await this.angularFireAuth
      .createUserWithEmailAndPassword(Validator.email(email), password)
      .then((res) => res)
      .catch((error) => {
        if (error.code === 'auth/operation-not-allowed') {
          throw new Error(
            'Lo siento, hubo un error interno. Vuelva a intentarlo mas tarde.'
          );
        }
        if (error.code === 'auth/email-already-in-use') {
          throw new Error(
            'El mail ingresado, ya pertenece a un usuario existente.'
          );
        }
        throw new Error('Mal formato de datos.');
      });

  /**
   * Termina la sesion del usuario activo
   * actualiza userData(Observable) = null
   */
  signOut = async () => {
    await this.angularFireAuth.signOut();
  };

  /*
   * Abre la ventana encargada de elegir la cuenta de google para loguearse.
   * @returns retorna el evento (contiene el usuario)
   * o throw error con mensaje listo para mostrar
   * res.credential.accessToken -> Google Acces Token
   * res.user -> datos del usuario logueado
   */
  signUpWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    return await this.signUpWithProvider(provider);
  };

  private signUpWithProvider = async (provider: any) =>
    await this.angularFireAuth
      .signInWithPopup(provider)
      .then((res) => res)
      .catch(() => {
        throw new Error('Operación cancelada.');
      });
}

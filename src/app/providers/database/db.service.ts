import { not } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentSnapshot,
} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  errorMessage = 'Lo sentimos, error interno. Operación no realizada.';
  notExist = 'La busqueda no arrojó resultados.';
  constructor(private db: AngularFirestore) {}

  /*
   * Guarda (o sobreescribe si existe) el dato
   * en el docName(id) del database ingresado.
   * @param database nombre de database (si no existe se crea)
   * @param docName nombre del docName (si existe se sobreescribe, si no se crea)
   * @param data datos a guardar en documento (puede ser cualquier objeto)
   * * Exito -> sin retorno | Error -> imprime error, y retorna mensaje para imprimir en pantalla *
   */
  setWithId = async (database: string, docName: string, data: any) => {
    await this.db
      .collection(database)
      .doc(docName)
      .set(data)
      .catch((error) => {
        console.log(error);
        throw new Error(this.errorMessage);
      });
  };

  /*
   * Guarda (o sobreescribe si existe) el dato
   * en el docName(id) del database ingresado.
   * @param database nombre de database (si no existe se crea)
   * @param data datos a guardar en documento (puede ser cualquier objeto)
   * * Exito -> retorna el id del doc creado (generado internamente) *
   * * Error -> imprime error, y retorna mensaje para imprimir en pantalla *
   */
  set = async (database: string, data: any) => {
    await this.db
      .collection(database)
      .add(data)
      .then((res) => res.id)
      .catch((error) => {
        console.log(error);
        throw new Error(this.errorMessage);
      });
  };

  /*
   * Agrega o mofifica los campos que encuentra en el documento de destino.
   * Si no encuentra el doc o la colección, los crea.
   * @param database nombre de database (si no existe, se crea)
   * @param docName nombre del docName (si no existe, se crea)
   * @param data datos a guardar en documento (si existen en el doc se modifican, si no se crea)
   * * Exito -> sin retorno | Error -> imprime error, y retorna mensaje para imprimir en pantalla *
   */
  update = async (database: string, docName: string, data: any) => {
    await this.db
      .collection(database)
      .doc(docName)
      .update(data)
      .catch((error) => {
        console.log(error);
        throw new Error(this.errorMessage);
      });
  };

  /*
   * Elimina el documento que corresponde con la búsqueda
   * @param database nombre de database (debe existir)
   * @param docName nombre del docName (debe existir)
   * * Exito -> sin retorno | Error -> imprime error, y retorna mensaje para imprimir en pantalla *
   */
  delete = async (database: string, docName: string) => {
    await this.db
      .collection(database)
      .doc(docName)
      .delete()
      .catch((error) => {
        console.log(error);
        throw new Error(this.errorMessage);
      });
  };

  /*
   * Busca y devuelve el snapshot de un documento una única vez
   * @param database nombre de database (debe existir)
   * @param docName nombre del docName (debe existir)
   * @returns si existe retorna el snapshot del documento
   * si no existe (o vacío) arroja error con mensaje listo para mostrar
   * snapshot.exists * snapshot.data() * snapshot.id *
   */
  getDocOnce = async (database: string, docName: string) => {
    let doc = null;
    await this.db
      .collection(database)
      .doc(docName)
      .get()
      .forEach((d) => {
        if (d.exists) {
          doc = d;
        }
      });
    if (doc) {
      return doc;
    }
    throw new Error(this.notExist);
  };

  /*
   * Busca y devuelve el snapshot de una coleccion una única vez
   * @param database nombre de database (debe existir)
   * @returns si existe retorna un array de snapshots con todos los docs de la coleccion
   * si no existe (o esta vacía) arroja error con mensaje listo para mostrar
   * snapshot.exists * snapshot.data() * snapshot.id *
   */
  getDbOnce = async (database: string) => {
    let db = null;
    await this.db
      .collection(database)
      .get()
      .forEach((d) => {
        if (!d.empty) {
          db = d;
        }
      });
    if (db) {
      return db;
    }
    throw new Error(this.notExist);
  };

  /*
   * Siempre retorna un observable al documento solicitado.
   * si no existe, el observable retorna undefined.
   * @param database nombre de database
   * @param docName nombre del docName
   * @returns un Observable al documento solicitado
   */
  getObserverDoc(database: string, docName: string) {
    return this.db.collection(database).doc(docName).valueChanges();
  }

  /*
   * Siempre retorna un observable a la coleccion solicitada.
   * si no existe, el observable retorna undefined.
   * @param database nombre de database
   * @returns un Observable a la coleccion solicitada
   */
  getObserverDb(database: string) {
    return this.db.collection(database).valueChanges();
  }
}

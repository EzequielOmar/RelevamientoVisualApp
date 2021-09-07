export class Validator {
  static email = (email: string): string => {
    const validEmail =
      email.endsWith('@gmail.com') ||
      email.endsWith('@hotmail.com') ||
      email.endsWith('@admin.com') ||
      email.endsWith('@invitado.com') ||
      email.endsWith('@usuario.com') ||
      email.endsWith('@anonimo.com') ||
      email.endsWith('@tester.com');
    if (!validEmail) {
      throw new Error('Mal formato de datos.');
    }
    return email;
  };
}

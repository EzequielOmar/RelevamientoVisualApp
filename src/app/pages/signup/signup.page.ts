import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { userDb } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { DbService } from 'src/app/providers/database/db.service';
import { databases } from 'src/app/providers/database/const';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  signup = userDb;
  submitted = false;
  spinner = false;
  pass: string;
  passCheck: string;
  error = '';

  constructor(
    private router: Router,
    private auth: AuthService,
    private db: DbService
  ) {
    this.passCheck = '';
  }

  onSignup(form: NgForm) {
    this.submitted = true;
    if (form.valid && this.passCheck === this.pass) {
      this.auth
        .signUp(form.form.value.email, form.form.value.password)
        .then((res) => {
          this.saveNewUser(res.user.uid);
          this.router.navigate(['/']);
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.spinner = false;
        });
    }
  }

  signUpWithGoogle() {
    this.submitted = true;
    this.auth
      .signUpWithGoogle()
      .then((res) => {
        this.signup.email = res.user.email;
        this.saveNewUser(res.user.uid);
        this.router.navigate(['/']);
      })
      .catch((error) => (this.error = error))
      .finally(() => {
        this.spinner = false;
      });
  }

  onCancel() {
    this.router.navigateByUrl('/login');
  }

  private saveNewUser(uid: string) {
    this.signup.createdAt = new Date().toJSON();
    this.db.setWithId(databases.users, uid, this.signup);
  }
}

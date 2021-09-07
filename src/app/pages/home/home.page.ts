import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { userDb } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/providers/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {
  user = userDb;
  private sub?;
  constructor(public auth: AuthService, public router: Router) {
    this.sub = this.auth.userData.subscribe((user) => {
      if (user) {
        this.user.email = user.email;
      } else {
        this.user.email = '';
      }
    });
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  goToSignup() {
    this.router.navigateByUrl('/signup');
  }

  logout() {
    this.auth.signOut();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

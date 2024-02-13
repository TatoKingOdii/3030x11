import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth-service/auth.service";

export const authGuard: CanActivateFn = (route, state) => {

  if (!inject(AuthService).authenticationStatus$.value) {
    inject(Router).navigate(['/login']);
  }
  return true;
};

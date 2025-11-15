import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  req = req.clone({
    setHeaders: {
      'Authorization': 'Bearer ' + sessionStorage.getItem("token")
    }
  });

  return next(req);
};

import { HttpInterceptorFn } from '@angular/common/http';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cloneRequest = req.clone({
    setHeaders: {
      'Content-type': 'application/json',
      'Authorization': localStorage.getItem("accessToken") || ""
    }
  });

  // 3. Logica de exclusión para el login
  if (cloneRequest.url.includes("auth")) {
    return next(req);
  } else {
    return next(cloneRequest);
  }
};


import {Injectable} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '@auth/auth.service';

@Injectable()
export class ApplicationInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService
    ) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

        let headers = request.headers;

        if (this.authService.code?.length > 0) {
            headers = headers.set('code', this.authService.code);
        }

        // Angular handles Content-Type for FormData automatically (including boundary).
        // Only explicitly set application/json for non-FormData requests if needed, 
        // but typically Angular handles this too. However, to fix the original intent:
        if (!(request.body instanceof FormData)) {
             headers = headers.set('Content-Type', 'application/json');
        }

        const requestClone = request.clone({headers})
        return next.handle(requestClone);
    }
}

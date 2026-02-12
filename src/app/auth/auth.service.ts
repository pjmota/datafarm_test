import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    // @ts-ignore
    private _code: string;

    get code(): string {
        return this._code;
    }

    setCode(code: string | undefined | null) {
        if (code == undefined) {
            throw 'code not set'
        }
        this._code = code;
        localStorage.setItem('auth_code', code);
    }

    constructor() {
        if (environment.authCode) {
            this._code = environment.authCode;
        } else {
            const storedCode = localStorage.getItem('auth_code');
            if (storedCode) {
                this._code = storedCode;
            }
        }
    }
}

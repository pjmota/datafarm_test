import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface FieldDetail {
  id: string;
  grower: string;
  farm: string;
  field: string;
}

export interface FieldDashboard {
  evolution: any[];
  rain: any[];
  efficiency: any[];
}

@Injectable({
  providedIn: 'root'
})
export class FieldService {

  private readonly API = '/api/field';

  constructor(private http: HttpClient) { }

  getField(id: string): Observable<FieldDetail> {
    return this.http.get<FieldDetail>(`${this.API}/${id}`).pipe(
      catchError(() => {
        // Fallback mock data in case API fails
        return of({
          id: id,
          grower: 'Mota',
          farm: 'Fazenda DataFarm',
          field: 'Talhão Principal'
        });
      })
    );
  }

  getDashboard(id: string): Observable<FieldDashboard> {
    return this.http.get<FieldDashboard>(`${this.API}/${id}/dashboard`);
  }
}

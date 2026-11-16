import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paziente, PazienteDaCreare } from '../models/paziente.model';

@Injectable({
  providedIn: 'root',
})
export class PazientiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/pazienti';

  public getPazienti(): Observable<Paziente[]> {
    return this.http.get<Paziente[]>(`${this.apiUrl}/view`);
  }

  public creaPaziente(paziente: PazienteDaCreare): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/add`,
      paziente,
      { responseType: 'text' },
    );
  }
}

import { RouterLink } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { Paziente } from '../../models/paziente.model';
import { PazientiService } from '../../services/pazienti';
import { PazienteForm } from './components/paziente-form/paziente-form';
@Component({
  selector: 'app-pazienti',
  imports: [RouterLink, PazienteForm],
  templateUrl: './pazienti.html',
  styleUrl: './pazienti.scss',
})
export class Pazienti implements OnInit {
  private readonly pazientiService = inject(PazientiService);
  public pazienti: Paziente[] = [];
  public errore: string | null = null;

  public ngOnInit(): void {
    this.caricaPazienti();
  }

  public caricaPazienti(): void {
    this.errore = '';

    this.pazientiService.getPazienti().subscribe({
      next: (pazienti) => {
        console.log('Pazienti caricati con successo:', pazienti);
        this.pazienti = pazienti;
      },
      error: (errore) => {
        console.log('Error status:', errore.status);
        if (errore.status === 0) {          
          this.errore = 'Errore di connessione al server'

        
        }
        if (errore.status === 404) {         
          this.errore = 'Pazienti non trovati'
        }
      }
    });
  }
}

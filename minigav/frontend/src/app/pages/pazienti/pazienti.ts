import { RouterLink } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { Paziente } from '../../models/paziente.model';
import { PazientiService } from '../../services/pazienti';
@Component({
  selector: 'app-pazienti',
  imports: [RouterLink],
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
        this.pazienti = pazienti;
      },
      error: () => {
        this.errore = 'Impossibile caricare i pazienti.';
      },
    });
  }
}

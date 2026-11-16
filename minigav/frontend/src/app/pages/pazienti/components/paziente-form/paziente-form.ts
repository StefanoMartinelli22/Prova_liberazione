import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PazienteDaCreare } from '../../../../models/paziente.model';
import { PazientiService } from '../../../../services/pazienti';
@Component({
  selector: 'app-paziente-form',
  imports: [ReactiveFormsModule],
  templateUrl: './paziente-form.html',
  styleUrl: './paziente-form.scss',
})
export class PazienteForm {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly pazientiService = inject(PazientiService);
  @Output() pazienteCreato = new EventEmitter<void>();

  protected readonly form = this.formBuilder.group({
    nome: ['', Validators.required],
    cognome: ['', Validators.required],
    data_nascita: ['', Validators.required],
    codice_fiscale: [
      '',
      [Validators.required, Validators.pattern(/^[A-Za-z0-9]{16}$/)],
    ],
    telefono: [
      '',
      [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)],
    ],
  });

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const paziente: PazienteDaCreare = this.form.getRawValue();

    this.pazientiService.creaPaziente(paziente).subscribe({
      next: () => {
        this.form.reset();
        console.log('Paziente salvato con successo.');
        this.pazienteCreato.emit();
      },
      error: () => {
        console.error('Impossibile salvare il paziente.');
      },
    });
  }
}

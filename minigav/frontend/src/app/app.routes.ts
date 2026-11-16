import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Pazienti } from './pages/pazienti/pazienti';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'pazienti',
    component: Pazienti,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
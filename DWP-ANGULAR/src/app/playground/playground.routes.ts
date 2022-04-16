import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { PlaygroundComponent } from './playground.component';

export const portalRoutes: Routes = [
  {
    path: 'fetchUsers',
    component: PlaygroundComponent,
  },
  {
    path: '',
    redirectTo: 'fetchUsers',
    pathMatch: 'full',
  },
  {
      path: '**',
      component: NotFoundComponent,
  }
];

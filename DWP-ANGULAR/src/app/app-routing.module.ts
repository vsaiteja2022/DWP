import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'playground',
    pathMatch: 'full',
  },
  {
    path: 'playground',
    // canActivate: [AuthorizedGuard],
    loadChildren: () =>
      import('./playground/playground.module').then((m) => m.PlaygroundModule),
  },
  {
    path: '**',
    loadChildren: () =>
    import('./playground/playground.module').then((m) => m.PlaygroundModule),
}
];
export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, {
  onSameUrlNavigation: 'reload',
});

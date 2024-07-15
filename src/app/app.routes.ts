import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    title: 'Inicio',
    loadComponent: () => import('./pages/home/home.component'),
    children: [
      {
        path:'product',
        title: 'Productos',
        loadComponent: () => import('./pages/home/products/products.component')
      },
      {
        path:'add-product',
        title: 'Editar producto',
        loadComponent: () => import('./pages/home/registration-form/registration-form.component')
      },
      {
        path:'edit-product/:id',
        title: 'Editar producto',
        loadComponent: () => import('./pages/home/registration-form/registration-form.component')
      },
      {
        path: '',
        title: 'Productos',
        loadComponent: () => import('./pages/home/products/products.component')
      }

    ]


  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

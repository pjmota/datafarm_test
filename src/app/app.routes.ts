import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./application/application.component').then(m => m.ApplicationComponent)
    },
    {
        path: 'submission',
        loadComponent: () => import('./main/submission/submission.component').then(m => m.SubmissionComponent)
    }
];

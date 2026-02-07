import { Routes } from '@angular/router';
import { Valentine } from '../app/ask/components/valentine/valentine';
import { Birthday } from './gifts/components/birthday/birthday';

export const routes: Routes = [
    {
        path:'',
        redirectTo: 'valentine',
        pathMatch: 'full'
    },
    {
        path: 'valentine',
        component: Valentine
    },
    {
        path: 'birthday',
        component: Birthday
    }
];

import { Component } from '@angular/core';
import {
  MatCardContent,
  MatCardActions,
  MatCard,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';

@Component({
  selector: 'app-unauthorized',
  imports: [MatCardContent, MatCardActions, MatCard, MatCardHeader, MatCardTitle],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.scss',
})
export class Unauthorized {}

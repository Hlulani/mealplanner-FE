import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-auth-shell',
  templateUrl: './auth-shell.page.html',
  styleUrls: ['./auth-shell.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AuthShellPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

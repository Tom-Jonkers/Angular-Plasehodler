import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatCardModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatTabsModule,
    CommonModule, MatError, MatFormField, MatCard, MatInput]
})
export class LoginComponent {
  loginForm: FormGroup;
  serverError: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;
    try {
      await this.authService.login(username, password);
      // Redirection ou autre action après connexion réussie
    } catch (error) {
      this.serverError = "Identifiants incorrects ou problème serveur.";
    }
  }
}
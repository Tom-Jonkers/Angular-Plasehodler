import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInput, MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatCardModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatTabsModule,
    CommonModule, MatError, MatFormField, MatCard, MatInput]
})
export class RegisterComponent {
  registerForm: FormGroup;
  userExists = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Vérifie que c'est un email valide
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8), // Minimum 8 caractères
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/), // 1 majuscule, 1 chiffre, 1 caractère spécial
        ],
      ],
      confirmPassword: ['', Validators.required],
    }, { validator: this.passwordsMatch });
  }

  // Vérifie si les mots de passe sont identiques
  passwordsMatch(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const { username, email, password, confirmPassword } = this.registerForm.value;
      await this.authService.register(username, email, password, confirmPassword);
    }
  }
}
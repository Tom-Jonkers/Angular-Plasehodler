import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Card } from 'src/app/models/models';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-open-pack',
  templateUrl: './dialog-open-pack.component.html',
  styleUrls: ['./dialog-open-pack.component.css'],
  standalone: true,
  imports: [CardComponent, CommonModule]
})
export class DialogOpenPackComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogOpenPackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { cards: Card[] }
  ) { }

  close(): void {
    this.dialogRef.close();
  }
}
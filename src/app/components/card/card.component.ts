import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Card } from 'src/app/models/models';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Renderer2, ElementRef } from '@angular/core';
import { transition, trigger, useAnimation } from '@angular/animations';
import { flip, jello, pulse, shakeX } from 'ng-animate';
import { lastValueFrom, timer } from 'rxjs';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  standalone: true,
  imports: [MatCardModule, CommonModule, MatButtonModule, MatIconModule],
  animations: [
    trigger('thorns', [transition(':increment', useAnimation(pulse, { params: { timing: 0.5 } }))]),
    trigger('assault', [transition(':increment', useAnimation(shakeX, { params: { timing: 0.5 } }))]),
    trigger('flip', [transition(':increment', useAnimation(flip, { params: { timing: 0.5 } }))]),
    trigger('jello', [transition(':increment', useAnimation(jello, { params: { timing: 0.5 } }))]),
  ]
})
export class CardComponent implements OnInit {

  @Input() card?: Card;
  @Input() show: string = "front";
  @Input() health: number = 0;
  @Input() attack: number = 0;
  @Input() showRemoveButton: boolean = false;
  @Output() remove = new EventEmitter<void>();

  ng_thorns = 0;
  ng_assault = 0;
  ng_flip = 0;
  ng_jello = 0;

  beautifulBackUrl = "https://i.imgur.com/miw1UhS_d.webp?maxwidth=760&fidelity=grand";

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit() {

  }


  onRemoveClick() {
    this.remove.emit();
  }

  async playAnimation(powerId: number) {
    console.log(powerId)
    if (powerId === 1) {
      this.ng_assault++;
      await lastValueFrom(timer(1.0 * 1000));
    } else if (powerId === 2) {
      this.ng_thorns++;
      await lastValueFrom(timer(1.0 * 1000));
    } else if (powerId === 3) {
      this.ng_jello++;
      await lastValueFrom(timer(1.0 * 1000));
    } else if (powerId === 4) {
      this.ng_flip++;
      await lastValueFrom(timer(1.0 * 1000));
    }
  }
}

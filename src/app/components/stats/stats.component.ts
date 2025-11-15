import { ApiService } from 'src/app/services/api.service';
import { Component, Renderer2 } from '@angular/core';
import { Card, Deck, Player, Raretes } from 'src/app/models/models';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CanvasJS, CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { interval } from 'rxjs';

@Component({
	selector: 'app-stats',
	standalone: true,
	imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatOptionModule, CanvasJSAngularChartsModule],
	templateUrl: './stats.component.html',
	styleUrl: './stats.component.css'
})
export class StatsComponent {

	nbDefaites: number = 0;
	nbVictoires: number = 0;
	decks: Deck[] = [];
	selectedDeck: Deck | null = null;
	playersCards: Card[] = [];

	chartPie: any;

	chartHorizontalBars: any;

	chartVerticalBars: any;

	cartesParRarete = {
		animationEnabled: true,
		theme: "dark1",
		title: {
			text: "Nombre de cartes par rareté"
		},
		data: [{
			type: "pie",
			startAngle: -90,
			indexLabel: "{label}: {y}",
			yValueFormatString: "#,###",
			dataPoints: [
				{ label: "Commune", y: 1 },
				{ label: "Rare", y: 1 },
				{ label: "Épique", y: 1 },
				{ label: "Légendaire", y: 1 }
			]
		}]
	};


	updateGraphs() {
		this.updateCartesParRarete();
		this.updateCoutMana();
		this.updateAttaqueDefense();
	}

	getCarteParRareteChartInstance(chart: any) {
		this.chartPie = chart;
		this.updateCartesParRarete();
	}

	getCoutManaChartInstance(chart: any) {
		this.chartHorizontalBars = chart;
		this.updateCoutMana();
	}

	getAttaqueDefenseChartInstance(chart: any) {
		this.chartVerticalBars = chart;
		this.updateAttaqueDefense();
	}

	updateCartesParRarete = () => {
		let cartes = this.selectedDeck ? this.selectedDeck.ownedCards : this.playersCards;

		console.log(cartes);
		const rareteMap: { [key: string]: string } = {
			"0": Raretes.Commune,
			"1": Raretes.Rare,
			"2": Raretes.Epique,
			"3": Raretes.Legendaire
		};

		const rarityCounts: { [key: string]: number } = {};
		if (cartes && Array.isArray(cartes)) {
			cartes.forEach((carte) => {
				let rarete: string | undefined;

				if ('card' in carte && carte.card && 'rarete' in carte.card) {
					rarete = String(carte.card.rarete);
				}
				else if ('rarete' in carte) {
					rarete = String(carte.rarete);
				}

				if (rarete) {
					const rareteNom = rareteMap[rarete] || rarete;
					rarityCounts[rareteNom] = (rarityCounts[rareteNom] || 0) + 1;
				}
			});
		}

		const dataPoints = Object.keys(rarityCounts).map(rarity => ({
			label: rarity,
			y: rarityCounts[rarity]
		}));


		this.chartPie.options.data[0].dataPoints = dataPoints;

		this.chartPie.render();

	}

	coutMana = {
		animationEnabled: true,
		theme: "dark1",
		title: {
			text: "Coût en mana",
			fontColor: "#ffffff",
			fontSize: 26
		},
		axisX: {
			title: "Mana",
			titleFontColor: "#ffffff",
			labelFontColor: "#ffffff",
			includeZero: true
		},
		axisY: {
			title: "Nombre de cartes",
			titleFontColor: "#ffffff",
			labelFontColor: "#ffffff",
			interval: 0.5
		},
		data: [{
			type: "bar",
			indexLabel: "{y}",
			indexLabelFontColor: "#ffffff",
			dataPoints: [
				{ label: "5", y: 2 },
				{ label: "4", y: 1 },
				{ label: "3", y: 5 },
				{ label: "2", y: 2 },
				{ label: "1", y: 7 }
			]
		}]
	};


	updateCoutMana = () => {
		let cartes = this.selectedDeck ? this.selectedDeck.ownedCards : this.playersCards;

		console.log(cartes);

		const manaCounts: { [key: number]: number } = {};
		if (cartes && Array.isArray(cartes)) {
			cartes.forEach((carte) => {
				let mana: number | undefined;

				if ('card' in carte && carte.card && 'cost' in carte.card) {
					mana = carte.card.cost;
				}
				else if ('cost' in carte) {
					mana = carte.cost;
				}

				if (mana) {
					manaCounts[mana] = (manaCounts[mana] || 0) + 1;
				}
			});
		}


		const dataPoints = Object.keys(manaCounts).map((mana) => ({
			label: mana.toString(),
			y: manaCounts[parseInt(mana, 10)]
		}));


		this.chartHorizontalBars.options.data[0].dataPoints = dataPoints;


		this.chartHorizontalBars.render();

	}


	attaqueDefense = {
		animationEnabled: true,
		theme: "dark1",
		title: {
			text: "Attaque et défense",
		},
		axisX: {
			labelAngle: -90
		},
		axisY: {
			title: "Nombre de cartes",
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			itemclick: function (e: any) {
				if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
					e.dataSeries.visible = false;
				}
				else {
					e.dataSeries.visible = true;
				}
				e.chart.render();
			}
		},
		data: [{
			type: "column",
			name: "Attaque",
			legendText: "Attaque",
			showInLegend: true,
			dataPoints: [
				{ label: "1", y: 1 },
				{ label: "2", y: 2 },
				{ label: "3", y: 2 },
				{ label: "4", y: 4 },
				{ label: "5", y: 2 },
				{ label: "6", y: 1 },
				{ label: "7", y: 2 },
				{ label: "8", y: 3 },
				{ label: "9", y: 3 },
				{ label: "10", y: 1 }
			]
		}, {
			type: "column",
			name: "Defense",
			legendText: "Defense",
			showInLegend: true,
			dataPoints: [
				{ label: "1", y: 1 },
				{ label: "2", y: 2 },
				{ label: "3", y: 3 },
				{ label: "4", y: 4 },
				{ label: "5", y: 2 },
				{ label: "6", y: 6 },
				{ label: "7", y: 3 },
				{ label: "8", y: 1 },
				{ label: "9", y: 1 },
				{ label: "10", y: 4 }
			]
		}]
	}


	updateAttaqueDefense = () => {
		let cartes = this.selectedDeck ? this.selectedDeck.ownedCards : this.playersCards;

		console.log(cartes);

		// Attaque
		const attaqueCount: { [key: number]: number } = {};
		if (cartes && Array.isArray(cartes)) {
			cartes.forEach((carte) => {
				let attaque: number | undefined;

				if ('card' in carte && carte.card && 'attack' in carte.card) {
					attaque = carte.card.attack;
				}
				else if ('attack' in carte) {
					attaque = carte.attack;
				}

				if (attaque) {
					attaqueCount[attaque] = (attaqueCount[attaque] || 0) + 1;
				}
			});
		}

		console.log(attaqueCount);

		// Défense
		const defenseCount: { [key: number]: number } = {};
		if (cartes && Array.isArray(cartes)) {
			cartes.forEach((carte) => {
				let defense: number | undefined;

				if ('card' in carte && carte.card && 'health' in carte.card) {
					defense = carte.card.health;
				}
				else if ('health' in carte) {
					defense = carte.health;
				}

				if (defense) {
					defenseCount[defense] = (defenseCount[defense] || 0) + 1;
				}
			});
		}

		console.log(defenseCount);

		// Harmonisation des labels entre attaque et défense
		const allLabels = Array.from(
			new Set([...Object.keys(attaqueCount), ...Object.keys(defenseCount)])
		).map((label) => parseInt(label, 10)).sort((a, b) => a - b);

		const normalizedAttaqueCount = allLabels.reduce((acc, label) => {
			acc[label] = attaqueCount[label] || 0;
			return acc;
		}, {} as { [key: number]: number });

		const normalizedDefenseCount = allLabels.reduce((acc, label) => {
			acc[label] = defenseCount[label] || 0;
			return acc;
		}, {} as { [key: number]: number });

		// Génération des dataPoints pour le graphique
		const dataPointsAttaque = allLabels.map((label) => ({
			label: label.toString(),
			y: normalizedAttaqueCount[label]
		}));

		const dataPointsDefense = allLabels.map((label) => ({
			label: label.toString(),
			y: normalizedDefenseCount[label]
		}));

		// Mise à jour des données du graphique
		this.chartVerticalBars.options.data[0].dataPoints = dataPointsAttaque;
		this.chartVerticalBars.options.data[1].dataPoints = dataPointsDefense;

		// Rendu du graphique
		this.chartVerticalBars.render();
	};

	constructor(public apiService: ApiService) {
	}




	async ngOnInit() {
		let playerReq: Player = await this.apiService.getCurrentPlayer() as Player;
		this.nbDefaites = playerReq.nbDefaites;
		this.nbVictoires = playerReq.nbVictoires;
		this.decks = await this.apiService.getPlayerDecks();
		this.playersCards = await this.apiService.getPlayersCards();
		this.updateGraphs()
	}

	currentVictoires(): number {
		return this.selectedDeck ? this.selectedDeck.nbVictoires : this.nbVictoires;
	}

	currentDefaites(): number {
		return this.selectedDeck ? this.selectedDeck.nbDefaites : this.nbDefaites;
	}

}

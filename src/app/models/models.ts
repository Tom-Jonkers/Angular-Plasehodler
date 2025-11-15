export interface Player {
    id: number;
    name: string;
    userId: string;
    money: number;
    nbVictoires: number;
    nbDefaites: number;
}


export enum Raretes {
    Commune = "Commune",
    Rare = "Rare",
    Epique = "Épique",
    Legendaire = "Légendaire",
}

export interface Paquet {
    id: number;
    name: string;
    imageUrl: string;
    nbCartes: number;
    cost: number;
    rareteParDefaut: Raretes;
}

export interface Card {
    id: number;
    name: string;
    attack: number;
    health: number;
    cost: number;
    rarete: Raretes;
    imageUrl: string;
    cardPowers: CardPower[]
}

export interface OwnedCard {
    id: number;
    cardId: number;
    playerId: number;
    card: Card;
}

export interface Deck {
    id: number;
    name: string;
    playerId: number;
    isCurrent: boolean;
    ownedCards: OwnedCard[];
    nbVictoires: number;
    nbDefaites: number;
}

export interface MatchData {
    match: Match;
    playerA: Player;
    playerB: Player;
    winningPlayerId: number;
}

export interface Match {
    id: number;
    isMatchCompleted: boolean;
    isPlayerATurn: boolean;
    playerDataA: PlayerData;
    playerDataB: PlayerData;
}

export interface PlayableCard {
    id: number;
    card: Card;
    health: number;
    attack: number;
    index: number;
}

export interface PlayerData {
    id: number;
    health: number;
    maxhealth: number;
    mana: number;
    playerId: number;
    playerName: string;
    cardsPile: PlayableCard[];
    hand: PlayableCard[];
    battleField: PlayableCard[];
    graveyard: PlayableCard[];
}
export interface RegisterDTO {
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
}
export interface LoginDTO {
    username: string;
    password: string;
}
export interface Power {
    id: number
    icone: string;
    name: string;
    description: string
    cardPowers: CardPower[]
}

export interface CardPower {
    id: number
    cardId: number
    card: Card
    powerId: number
    power: Power
    value?: number
}

export interface MatchDTO {
    id: number
    userIdA: string
    userIdB: string
    playerNameA: string
    playerNameB: string
}

export interface ChatDTO {
    pseudo: string
    message: string
    isSpectator: boolean
}

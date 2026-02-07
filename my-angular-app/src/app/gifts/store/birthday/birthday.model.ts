import { FormControlName, FormGroup } from "@angular/forms";
import { DiffcultyEnum, GameNumberEnum, GameStatusEnum, LetterStatusEnum } from "../../components/birthday/birthday.enum";

export interface Game {
    number: GameNumberEnum;
    status: GameStatusEnum;
    title: string;
}

export interface LetterInterface {
    character: string;
    status: LetterStatusEnum
}    

export interface ConnectionInterface {
    id: number;
    groupId: number;
    difficulty: DiffcultyEnum
    text: string,
    isSelected: boolean;
}

export interface CompletedCardsInterface {
    guesses: string[];
    difficulty: DiffcultyEnum;
    relationText: string;
}

export interface BirthdayInterface {
    games: Game[];
    rowNumber: number;
    wordleForm: FormGroup;
    hangmanForm: FormGroup;
    wordleGuesses: LetterInterface[][];
    hangmanGuesses: string[]
    isWordleSolved: boolean;
    hangmanAnswerShow: LetterInterface[];
    hangmanStep: number;
    connections: ConnectionInterface[];
    connectionsForm: FormGroup;
    completedCards: CompletedCardsInterface[];
    livesLeft: number;
    maxWordleAttempts: number;
    attemptedConnections: string[]
    isModalClosed: {[key: number]: boolean}
}

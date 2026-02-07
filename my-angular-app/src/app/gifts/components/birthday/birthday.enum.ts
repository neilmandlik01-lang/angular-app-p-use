export enum GameStatusEnum {
    LOCKED = 'locked',
    UNLOCKED = 'unlocked',
    COMPLETED = 'completed'
}

export enum GameNumberEnum {
    WORDLE = 1,
    HANGMAN = 2,
    CONNECTIONS = 3
}

export enum LetterStatusEnum {
    CORRECT_PLACE = 1,
    WRONG_PLACE = 2,
    WRONG_LETTER = 3
}

export enum DiffcultyEnum {
    HIGH = 1,
    MEDIUM = 2,
    LOW = 3,
    EASY = 4
}

export const wordleAnswer: string = "HAPPY";
export const hangmanAnswer: string = "BIRTHDAY"
export const name: string = "YANA"
export const maxSelectedCards: number = 4
export const maxLivesLeft: number = 4;
export const maxWordleAttempts: number = 6
export const maxHangmanAttempts: number = 7
export const maxConnectionGroups: number = 4

export const messages: string[] = [
    "Happy Birthday Yanuu, I love you and I will cherish you for the rest of my life. My effort this year is to be a better and more understanding partner. My heart will always be with you.",
    "We are celebrating your birthday together as a couple for the first time. And I hope that we keep celebrating like this till the end.",
    "To make this moment memorable, I have combined the things we do, the things you want and the things I do best. This resulted into the gift we are in right now. Hope you liked it.",
    "Happy Birthday!!"
]

export const altMessages: string[] = [
    
]
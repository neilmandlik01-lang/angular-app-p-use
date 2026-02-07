import { patchState } from "@ngrx/signals"
import { LetterStatusEnum, wordleAnswer } from "../../components/birthday/birthday.enum"
import { BirthdayInterface, ConnectionInterface, LetterInterface } from "./birthday.model"

export interface BirthdayHelperInterface {
    getLetterStatus: (
        word: string,
        store: any
    ) => LetterInterface[],

    getWordCountObject: (
        word: string
    ) => {[key: string]: number}

    getRelationText: (
        groupId: number
    ) => string    

}

export const BirthdayHelpers: BirthdayHelperInterface = {
    getLetterStatus(word: string, store: any): LetterInterface[] {
        const wordObject: {[key: string]: number} = BirthdayHelpers.getWordCountObject(wordleAnswer)
        const letters: LetterInterface[] = []; 
        let countInFirstPass: number = 0

        // First Pass: Check for correct places
        for(let i = 0; i < word.length; i++){
            const g = word[i].toUpperCase();
            const a = wordleAnswer[i].toUpperCase();

            if(g === a){
                wordObject[g] -= 1;
                letters[i] = {
                    character: g,
                    status: LetterStatusEnum.CORRECT_PLACE
                };
                countInFirstPass++;
            }
        }

        if(countInFirstPass === word.length){
            patchState(store,{
                isWordleSolved: true
            })            
        }
        else{
            patchState(store,{
                isWordleSolved: false
            })
        }
        
        // Second Pass: Check for wrong places and wrong letters
        for(let i = 0; i < word.length; i++){
            if(letters[i]) continue; // Skip already processed letters
            const g = word[i].toUpperCase();

            if(wordObject[g] && wordObject[g] > 0){
                wordObject[g] -= 1;
                letters[i] = {
                    character: g,
                    status: LetterStatusEnum.WRONG_PLACE
                };
            }
            else {
                letters[i] = {
                    character: g,
                    status: LetterStatusEnum.WRONG_LETTER
                };
            }
        }

        return letters;
    },

    getWordCountObject(word: string): {[key: string]: number} {
        const wordCountObj: {[key: string]: number} = {};
        for(const char of word){
            wordCountObj[char] = (wordCountObj[char] || 0) + 1;
        }
        return wordCountObj;        
    },

    getRelationText(groupId: number): string {
        if(groupId == 1){
            return "Yanuuu: _______"
        }
        else if (groupId ==2 ){
            return "Our Date Restaurants:- "
        }
        else if(groupId==3){
            return "Places where we've had SEX:- "
        }
        else if(groupId==4){
            return "Fun Things We've Done in Indu:- "
        }
        else{
            return "No Statement"
        }
    }

}
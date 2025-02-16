import { createContext, useReducer } from "react";
import question from "../data";
import { normalizeQuestions, shuffleAnswers } from "../helpers";

const initialState = {
    currentQuestionIndex: 0,
    question: [],
    showResults: false,
    answers: [],
    currentAnswer: '',
    correctAnswersCount: 0,
    error: null
};

//function which will update our state
const reducer = (state, action) => {
    //console.log('reducer', state, action)
    switch (action.type) {
        case "SELECT_ANSWER": {
            const correctAnswersCount =
            action.payload === 
            state.question[state.currentQuestionIndex].correctAnswer 
            ? state.correctAnswersCount + 1
            : state.correctAnswersCount;
            return {
                ...state,
                currentAnswer: action.payload,
                correctAnswersCount
            }
        }
        case "NEXT_QUESTION": {
            const showResults = (state.currentQuestionIndex === state.question.length - 1);
            const currentQuestionIndex = showResults ? state.currentQuestionIndex : state.currentQuestionIndex + 1;
            const answers = showResults ? [] : shuffleAnswers(state.question[currentQuestionIndex]);
            return {...state, currentQuestionIndex, showResults, answers, currentAnswer: ''}
        }
        case "RESTART": {
            return initialState;
        }
        case "LOADED_QUESTIONS": {
            const normalizedQuestions = normalizeQuestions(action.payload);
            return {
                ...state,
                question : normalizedQuestions,
                answers: shuffleAnswers(normalizedQuestions[0])
            };
        }
        case "SERVER_ERROR": {
            return {
                ...state,
                error: action.payload
            }
        }
        default: {
            return state;
        }
    }   

};

export const QuizContext = createContext();

export const QuizProvider = ({children}) => {
    const value = useReducer(reducer,  initialState); //dispatch carries out action (reducer)
    //console.log("state", value);
    return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}
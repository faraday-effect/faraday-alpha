export interface Question {
  questionNumber?: number;
  type: QuestionType;
  title: string;
  text: string;
}

// TODO: Exporting this enum (`export enum ...`) causes a bunch of warnings. Why?
export enum QuestionType {
  FillOneBlank = "Fill One",
  Matching = "Matching",
  MultipleChoice = "Multiple Choice",
  MultipleDropdowns = "Multiple Dropdown",
  TrueFalse = "True-False"
}

/** Map string keys to a single value of type T. */
export interface KeysToOneValue<T> {
  [key: string]: T;
}

/** Map string keys to a list of values of type T. */
export interface KeysToMultipleValues<T = string> {
  [key: string]: T[];
}

export interface TrueFalseQuestion extends Question {
  type: QuestionType.TrueFalse;
  details: {
    answer: boolean;
  };
}

export interface FillOneBlankQuestion extends Question {
  type: QuestionType.FillOneBlank;
  details: {
    answer: {
      text?: string[] | null;
      regexp?: string[] | null;
    };
  };
}

export interface MatchingQuestion extends Question {
  type: QuestionType.Matching;
  details: {
    // These are the proper pairings, mixed up when displaying the question.
    pairs: KeysToOneValue<string>;
  };
}

export interface MultipleChoiceQuestion extends Question {
  type: QuestionType.MultipleChoice;
  details: {
    choices: KeysToMultipleValues<string>;
    answer: string; // Proper value for `label`
  };
}

export interface MultipleDropdownsQuestion extends Question {
  type: QuestionType.MultipleDropdowns;
  template: string;
  details: {
    choices: KeysToMultipleValues<string>;
    answer: KeysToMultipleValues<string>;
  };
}

export interface Quiz {
  title: string;
  questions: Question[];
}

type DropdownQuestionText = {
  type: "text";
  content: string;
};

type DropdownQuestionControl = {
  type: "dropdown";
  label: string;
};

export type MultipleDropdownsElement =
  | DropdownQuestionText
  | DropdownQuestionControl;

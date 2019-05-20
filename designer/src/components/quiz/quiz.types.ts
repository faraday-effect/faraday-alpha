export interface Question {
  questionNumber: number;
  type: string;
  title: string;
  text: string;
}

export interface TrueFalseQuestion extends Question {
  type: "true-false";
  answer: boolean;
}

export interface FillOneBlankQuestion extends Question {
  type: "fill-the-blank";
  answer: string[]; // Matching strings or regular expressions.
}

export interface MatchingQuestion extends Question {
  type: "matching";
  details: {
    // These are the proper pairings, mixed up when displaying the question.
    pairs: [[string, string]];
  };
}

export interface MultipleChoiceQuestion extends Question {
  type: "multiple-choice";
  details: {
    choices: [
      {
        label: string;
        value: string;
        answer: string; // Proper value for `label`
      }
    ];
  };
}

export interface MultipleDropdownsQuestion extends Question {
  type: "multiple-dropdowns";
  template: string;
  choices: {
    [ddName: string]: string[];
  };
}

export interface Quiz {
  title: string;
  questions: Array<Question>;
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

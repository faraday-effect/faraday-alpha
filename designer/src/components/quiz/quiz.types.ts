export interface Question {
  questionNumber: number;
  type: string;
  title: string;
  text: string;
}

export interface TrueFalseQuestion extends Question {
  type: "true-false";
}

export interface FillOneBlankQuestion extends Question {
  type: "fill-the-blank";
}

export interface MatchingQuestion extends Question {
  type: "matching";
  details: {
    pairs: [[string, string]];
  };
}

export interface MultipleChoiceQuestion extends Question {
  type: "multiple-choice";
  details: {
    choices: [
      {
        label: string;
        value: string | number;
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

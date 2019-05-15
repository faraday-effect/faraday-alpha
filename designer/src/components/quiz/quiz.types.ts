export interface MultipleDropdownsQuestionDetails {
  template: string;
  choices: {
    [ddName: string]: string[];
  };
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

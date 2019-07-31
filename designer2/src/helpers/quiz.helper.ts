import { QuestionType } from "@/components/quiz/quiz.types";

import QuestionBuilder from "@/components/quiz/QuestionBuilder.vue";

import FillOneBlankBuilder from "@/components/quiz/FillOneBlankBuilder.vue";
import MatchingBuilder from "@/components/quiz/MatchingBuilder.vue";
import MultipleChoiceBuilder from "@/components/quiz/MultipleChoiceBuilder.vue";
import MultipleDropdownsBuilder from "@/components/quiz/MultipleDropdownsBuilder.vue";
import TrueFalseBuilder from "@/components/quiz/TrueFalseBuilder.vue";

const questionTypeDetails = {
  [QuestionType.FillOneBlank]: {
    name: "Fill One Blank",
    builder: FillOneBlankBuilder
  },
  [QuestionType.Matching]: {
    name: "Matching",
    builder: MatchingBuilder
  },
  [QuestionType.MultipleChoice]: {
    name: "Multiple Choice",
    builder: MultipleChoiceBuilder
  },
  [QuestionType.MultipleDropdowns]: {
    name: "Multiple Dropdowns",
    builder: MultipleDropdownsBuilder
  },
  [QuestionType.TrueFalse]: {
    name: "True-False",
    builder: TrueFalseBuilder
  }
};

export function questionTypePrefix(type: QuestionType) {
  return type;
}

export function questionTypeName(type: QuestionType) {
  return questionTypeDetails[type].name;
}

export function questionTypeBuilder(type: QuestionType) {
  return questionTypeDetails[type].builder;
}

export const questionTypeUiDetails = Object.values(QuestionType).map(type => {
  return {
    prefix: questionTypePrefix(type),
    name: questionTypeName(type),
    builder: questionTypeBuilder(type)
  };
});

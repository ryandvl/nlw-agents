import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TCreateQuestionRequest } from "./types/create-question-request";
import type { TCreateQuestionResponse } from "./types/create-question-response";
import type { TGetRoomQuestionsResponse } from "./types/get-room-questions-response";

export function useCreateQuestion(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TCreateQuestionRequest) => {
      const response = await fetch(
        `http://localhost:3333/rooms/${roomId}/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result: TCreateQuestionResponse = await response.json();

      return result;
    },

    // Executa no momento que for feita a chamada para a API
    onMutate({ question }) {
      const questions = queryClient.getQueryData<TGetRoomQuestionsResponse>([
        "get-questions",
        roomId,
      ]);

      const questionsArray = questions ?? [];

      const newQuestion = {
        id: crypto.randomUUID(),
        question,
        answer: null,
        createdAt: new Date().toISOString(),
        isGeneratingAnswer: true,
      };

      queryClient.setQueryData<TGetRoomQuestionsResponse>(
        ["get-questions", roomId],
        [newQuestion, ...questionsArray]
      );

      return { newQuestion, questions };
    },

    onSuccess(data, _variables, context) {
      queryClient.setQueryData<TGetRoomQuestionsResponse>(
        ["get-questions", roomId],
        (questions) => {
          if (!(questions && context.newQuestion)) {
            return questions;
          }

          return questions.map((question) => {
            if (question.id === context.newQuestion.id) {
              return {
                ...context.newQuestion,
                id: data.questionId,
                answer: data.answer,
                isGeneratingAnswer: false,
              };
            }

            return question;
          });
        }
      );
    },

    onError(_error, _variables, context) {
      if (context?.questions) {
        queryClient.setQueryData<TGetRoomQuestionsResponse>(
          ["get-questions", roomId],
          context.questions
        );
      }
    },
  });
}

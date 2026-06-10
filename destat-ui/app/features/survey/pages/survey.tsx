import { Button } from "@base-ui/react/button";
import { SendIcon, User2Icon } from "lucide-react";
import { Form } from "react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import MessageBubble from "../components/message-bubble";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/survey";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { SURVEY_ABI } from "../constant";

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const answers = Object.fromEntries(formData);
  console.log(Object.values(answers).map((str) => Number(str)));
};

interface Questions {
  question: string;
  options: number[];
}

const questions: Questions[] = [
  {
    question: "15 + 27의 값은 무엇인가요?",
    options: [32, 42, 52, 62],
  },
  {
    question: "하루는 총 몇 시간인가요?",
    options: [12, 24, 36, 48],
  },
  {
    question: "태양계의 행성은 총 몇 개인가요? (명왕성 제외)",
    options: [7, 8, 9, 10],
  },
  {
    question: "순수한 물의 끓는점은 섭씨 몇 도인가요?",
    options: [80, 90, 100, 120],
  },
  {
    question: "평년 기준으로 1년은 며칠인가요?",
    options: [364, 365, 366, 367],
  },
  {
    question: "삼각형의 세 내각의 합은 몇 도인가요?",
    options: [90, 180, 270, 360],
  },
  {
    question: "2의 10제곱(2^10)은 얼마인가요?",
    options: [256, 512, 1024, 2048],
  },
];

export default function Survey({ params }: Route.ComponentProps) {
  const { data: questions } = useReadContract({
    address: params.surveyId as `0x${string}`,
    abi: SURVEY_ABI,
    functionName: "getQuestions",
    args: [],
  });
  const { data: title } = useReadContract({
    address: params.surveyId as `0x${string}`,
    abi: SURVEY_ABI,
    functionName: "title",
    args: [],
  });
  const { data: description } = useReadContract({
    address: params.surveyId as `0x${string}`,
    abi: SURVEY_ABI,
    functionName: "description",
    args: [],
  });
  const { writeContract } = useWriteContract();
  const { address } = useAccount();

  const submitAnswer = (e: React.FormEvent<HTMLFormElement>) => {
    if (!address) {
      alert("please connect wallet before submitting answer");
      return;
    }
    const formData = new FormData(e.currentTarget);
    const answers: number[] = [];
    for (const value of formData.values()) {
      answers.push(Number(value));
    }
    writeContract({
      address: params.surveyId as `0x${string}`,
      abi: SURVEY_ABI,
      functionName: "submitAnswer",
      args: [
        {
          respondent: address,
          answers,
        },
      ],
    });
  };

  const { data: answers } = useReadContract({
    address: params.surveyId as `0x${string}`,
    abi: SURVEY_ABI,
    functionName: "getAnswers",
    args: [],
  });

  const { data: target } = useReadContract({
    address: params.surveyId as `0x${string}`,
    abi: SURVEY_ABI,
    functionName: "targetNumber",
    args: [],
  });

  const [counts, setCounts] = useState<Number[][]>([]);
  const [isAnswered, setIsAnswered] = useState(false);

  const countAnswers = () => {
    // 0: [1,0,0]
    // 1: [0,0,1]
    if (!target) return;
    return questions?.map((q, i) => {
      const count = Array.from({ length: q.options.length }).fill(
        0,
      ) as number[];
      answers?.map((answer) => count[answer.answers[i]]++);
      // return count;
      return count.map((n) => (n / Number(target)) * 100);
    });
  };

  useEffect(() => {
    if (!answers || !questions || !address) {
      return;
    }
    for (const answer of answers) {
      if (answer.respondent === address) {
        setCounts(countAnswers() || []);
        setIsAnswered(true);
        return;
      }
    }
  }, [answers, address, target]);

  return (
    <div className="grid grid-cols-3 w-full gap-3 px-3 pt-15 pb-3 h-[calc(100vh-4rem)]">
      <Card className="col-span-2 min-w-0 flex flex-col overflow-hidden">
        <CardHeader>
          <CardTitle className="font-extrabold text-3xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        {false ? (
          <CardContent className="overflow-y-auto flex-1">
            <h1 className="font-semibold text-xl pb-4">Survey Progress</h1>
            <div className="gap-5 grid grid-cols-2">
              {questions?.map((q, i) => (
                <div key={i} className="flex flex-col">
                  <h1 className="font-bold">{q.question}</h1>
                  <div className="pl-2 gap-1">
                    {q.options.map((o, j) => (
                      <div className="flex flex-row justify-center items-center relative">
                        <div className="left-2 absolute text-xs font-semibold">
                          {o}
                        </div>
                        <div className="w-full bg-gray-200 h-5 rounded-full">
                          <div className="bg-blue-400 w-14 h-5 rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <Form onSubmit={submitAnswer} className="grid grid-cols-2">
              {questions?.map((q, i) => (
                <div className="flex flex-col">
                  <span className="mt-5 mb-1">{q.question}</span>
                  {q.options.map((o, j) => (
                    <label className="flex items-center gap-1">
                      <Input
                        type="radio"
                        name={i.toString()}
                        value={j.toString()}
                        className="hidden peer"
                      ></Input>
                      <span className="w-4 h-4 rounded-full border-2 peer-checked:bg-primary"></span>
                      <span className="font-semibold">{o}</span>
                    </label>
                  ))}
                </div>
              ))}
              <Button type="submit" className="w-full mt-5">
                Submit
              </Button>
            </Form>
          </CardContent>
        )}
      </Card>
      <Card className="col-span-1 min-w-0 flex flex-col overflow-hidden">
        <CardHeader>
          <CardTitle>Live Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 overflow-y-auto flex-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <MessageBubble key={i} sender={i % 2 == 0} />
          ))}
        </CardContent>
        <CardFooter className="w-full">
          <Form className="flex flex-row items-center relative w-full">
            <input
              type="text"
              placeholder="type a message..."
              className="border-1 w-full h-8 rounded-2xl px-2 text-xs"
            />
            <Button
              className="flex flex-row justify-center items-center w-6 h-6 absolute
            right-2"
            >
              <SendIcon />
            </Button>
          </Form>
        </CardFooter>
      </Card>
    </div>
  );
}

import { http, useReadContract } from "wagmi";
import SurveyCard from "../components/survey-card";
import { SURVEY_ABI, SURVEY_FACTORY, SURVEY_FACTORY_ABI } from "../constant";
import { useEffect, useState } from "react";
import { createPublicClient, getContract } from "viem";
import { hardhat } from "viem/chains";
import type { Route } from "./+types/create-survey";
import { supabase } from "~/postgres/supaclient";
import { desc } from "drizzle-orm";
import { description } from "~/features/dashboard/components/trend-chart";

interface SurveyMeta {
  title: string;
  description: string;
  count: number;
  view: number | null;
  image: string | null;
  address: string;
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { data, error } = await supabase
    .from("all_survey_overview")
    .select("*");
  if (!error) {
    return data.map((s) => {
      return {
        title: s.title!,
        description: s.description!,
        view: s.view,
        count: s.count!,
        image: s.image,
        address: s.id!,
      };
    });
  } else {
    return [];
  }
};

export default function AllSurvey({ loaderData }: Route.ComponentProps) {
  const [surveys, setServeys] = useState<SurveyMeta[]>(loaderData);

  const onChainLoader = async () => {
    const client = createPublicClient({
      chain: hardhat,
      transport: http(),
    });

    const surveyFactoryContract = getContract({
      address: SURVEY_FACTORY,
      abi: SURVEY_FACTORY_ABI,
      client,
    });

    const surveys = await surveyFactoryContract.read.getSurveys();
    const surveyMetadata = await Promise.all(
      surveys.map(async (surveyAddress) => {
        const surveyContract = getContract({
          address: surveyAddress,
          abi: SURVEY_ABI,
          client,
        });
        const title = await surveyContract.read.title();
        const description = await surveyContract.read.description();
        const answers = await surveyContract.read.getAnswers();
        return {
          title,
          description,
          count: answers.length,
          view: null,
          image: null,
          address: surveyAddress,
        };
      }),
    );
    return surveyMetadata;
  };

  // useEffect(() => {
  //   const onChainData = async () => {
  //     await new Promise((resolve) => setTimeout(resolve, 5000));
  //     const onchainSurveys = await onChainLoader();
  //     setServeys(onchainSurveys);
  //   };
  //   onChainData();
  // }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-extrabold">Live Surveys</h1>
        <span className="font-light">Join the surveys!</span>
      </div>
      {surveys.map((survey) => (
        <SurveyCard
          title={survey.title}
          description={survey.description}
          view={survey.view!}
          count={survey.count}
          image={survey.image!}
          address={survey.address}
        />
      ))}
    </div>
  );
}

import { lazy, Suspense } from "react";
import TrendCard from "../components/trend-card";
import type { Route } from "./+types/dashboard";
import { supabase } from "~/postgres/supaclient";
import { DateTime } from "luxon";
import { getNumberData } from "../query";
import { dailyLiveServey } from "../schema";
const TrendChart = lazy(() =>
  import("../components/trend-chart").then((m) => ({ default: m.TrendChart })),
);

const data = [
  { date: "2025-10-01", data: 186 },
  { date: "2025-10-02", data: 214 },
  { date: "2025-10-03", data: 173 },
  { date: "2025-10-04", data: 241 },
  { date: "2025-10-05", data: 198 },
  { date: "2025-10-06", data: 162 },
  { date: "2025-10-07", data: 205 },
  { date: "2025-10-08", data: 229 },
  { date: "2025-10-09", data: 187 },
  { date: "2025-10-10", data: 253 },
  { date: "2025-10-11", data: 210 },
  { date: "2025-10-12", data: 178 },
  { date: "2025-10-13", data: 266 },
  { date: "2025-10-14", data: 234 },
];

export const loader = async ({ request }: Route.LoaderArgs) => {
  await supabase.rpc("increment_daily_visitor", {
    day: DateTime.now().startOf("day").toISO({ includeOffset: false }),
  });
  const thisWeekStart = DateTime.now()
    .startOf("week")
    .toISO({ includeOffset: false });
  const thisWeekEnd = DateTime.now().toISO({ includeOffset: false });
  const lastWeekStart = DateTime.now()
    .startOf("week")
    .minus({ week: 1 })
    .toISO({ includeOffset: false });
  const { data: liveSurveyCount } = await supabase
    .from("daily_live_survey")
    .select("count, day_start")
    .order("day_start");

  let formedLivedSurveyCount = [
    {
      date: "",
      data: 0,
    },
  ];
  if (liveSurveyCount) {
    formedLivedSurveyCount = liveSurveyCount.map((c) => {
      return {
        date: c.day_start ?? "",
        data: c.count ?? 0,
      };
    });
  }

  const numberCard = await getNumberData(
    lastWeekStart,
    thisWeekStart,
    thisWeekEnd,
  );
  return {
    ...numberCard,
    formedLivedSurveyCount,
  };
};

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="grid grid-cols-3 gap-5 mt-10">
        <TrendCard
          title={"Total Visitors"}
          value={loaderData.value}
          trendValue={loaderData.trendValue + "%"}
          trendMessage={loaderData.upAndDown ? "Trending Up" : "Trending Down"}
          periodMessage={"last 7 days"}
        />
        <TrendCard
          title={"Live Surveys"}
          value={"123"}
          trendValue={"200%"}
          trendMessage={"Trending up"}
          periodMessage={"last 6 months"}
        />
        <TrendCard
          title={"Archived Surveys"}
          value={"123,123"}
          trendValue={"200%"}
          trendMessage={"Trending up"}
          periodMessage={"last 6 months"}
        />
      </div>

      <div className="grid grid-cols-2 mt-5 gap-5 w-full">
        <TrendChart
          title={"Live Surveys"}
          description={"Daily live survey count"}
          trendMessage={""}
          periodMessage={""}
          chartData={loaderData.formedLivedSurveyCount}
        />
        <TrendChart
          title={"Archived Surveys"}
          description={"Daily Archived survey count"}
          trendMessage={""}
          periodMessage={""}
          chartData={data}
        />
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { LoadingState } from "../utils/LoadingState";

interface FearGreedData {
  name: string;
  data: Array<{
    value: string;
    value_classification: string;
    timestamp: string;
    time_until_update?: string;
  }>;
  metadata: {
    error: null | string;
  };
}

const getClassificationColor = (classification: string) => {
  switch (classification.toLowerCase()) {
    case "extreme fear":
      return "[&>*]:bg-red-500";
    case "fear":
      return "[&>*]:bg-orange-500";
    case "neutral":
      return "[&>*]:bg-yellow-500";
    case "greed":
      return "[&>*]:bg-green-500";
    case "extreme greed":
      return "[&>*]:bg-emerald-500";
    default:
      return "[&>*]:bg-gray-500";
  }
};

export const FearAndGreedIndex = () => {
  const { data, isLoading, error } = useQuery<FearGreedData>({
    queryKey: ["fearAndGreedIndex"],
    queryFn: async () => {
      const response = await fetch("https://api.alternative.me/fng/?limit=30");
      return response.json();
    },
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
  });

  if (isLoading) return <LoadingState />;
  if (error) return <div>Error loading Fear & Greed Index</div>;
  if (!data) return null;

  const current = data.data[0];
  const yesterday = data.data[1];
  const lastWeek = data.data[6];
  const lastMonth = data.data[29];

  const renderIndexCard = (
    title: string,
    value: string,
    classification: string,
    timestamp: string
  ) => (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{title}</span>
        <span className="text-sm text-muted-foreground">
          {format(new Date(parseInt(timestamp) * 1000), "MMM d, yyyy")}
        </span>
      </div>
      <Progress
        value={parseInt(value)}
        className={`h-2 ${getClassificationColor(classification)}`}
      />
      <div className="flex justify-between items-center">
        <span className="font-medium">{value}</span>
        <span className="text-sm">{classification}</span>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Fear & Greed Index</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderIndexCard(
          "Current",
          current.value,
          current.value_classification,
          current.timestamp
        )}
        {renderIndexCard(
          "Yesterday",
          yesterday.value,
          yesterday.value_classification,
          yesterday.timestamp
        )}
        {renderIndexCard(
          "Last Week",
          lastWeek.value,
          lastWeek.value_classification,
          lastWeek.timestamp
        )}
        {renderIndexCard(
          "Last Month",
          lastMonth.value,
          lastMonth.value_classification,
          lastMonth.timestamp
        )}
      </CardContent>
    </Card>
  );
}; 

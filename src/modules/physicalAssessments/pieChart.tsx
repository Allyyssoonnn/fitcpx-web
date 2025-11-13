"use client";

import { LabelList, Pie, PieChart, Sector } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

const chartConfig = {
   visitors: {
      label: "value",
   },
   chrome: {
      label: "chrome",
      color: "var(--chart-1)",
   },
   safari: {
      label: "Safari",
      color: "var(--chart-2)",
   },
   firefox: {
      label: "Firefox",
      color: "var(--chart-3)",
   },
   edge: {
      label: "Edge",
      color: "var(--chart-4)",
   },
   other: {
      label: "Other",
      color: "var(--chart-5)",
   },
} satisfies ChartConfig;

export function ChartPieLabel({ data }: { data: any[] }) {
   return (
      <Card className="flex flex-col">
         <CardHeader className="items-center pb-0">
            <CardTitle>Gráfico pizza - composição corporal</CardTitle>
         </CardHeader>

         <CardContent className="flex-1 pb-0">
            <ChartContainer
               config={chartConfig}
               className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[300px] pb-0"
            >
               <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                     outerRadius="65%"
                     data={data}
                     dataKey="value"
                     nameKey="label"
                     label={({ value }) => `${value} %`}
                     innerRadius={40}
                     strokeWidth={0}
                     activeIndex={0}
                     activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                        <Sector {...props} outerRadius={outerRadius + 5} />
                     )}
                  >
                     <LabelList dataKey="label" className="fill-background" stroke="none" fontSize={12} />
                  </Pie>
               </PieChart>
            </ChartContainer>
         </CardContent>
      </Card>
   );
}

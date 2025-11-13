"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

const chartConfig = {
   desktop: {
      label: "Desktop",
      color: "var(--chart-2)",
   },
   mobile: {
      label: "Mobile",
      color: "var(--chart-2)",
   },
   label: {
      color: "var(--background)",
   },
} satisfies ChartConfig;

export function ChartBarLabelCustom({ data }: { data: any[] }) {
   return (
      <Card>
         <CardHeader>
            <CardTitle>Gráfico de comparação Simetria</CardTitle>
         </CardHeader>

         <CardContent>
            <ChartContainer config={chartConfig}>
               <BarChart
                  accessibilityLayer
                  data={data}
                  layout="vertical"
                  margin={{
                     right: 16,
                  }}
               >
                  <CartesianGrid horizontal={false} />
                  <YAxis
                     dataKey="membro"
                     type="category"
                     tickLine={false}
                     tickMargin={10}
                     axisLine={false}
                     tickFormatter={(value) => value.slice(0, 3)}
                     hide
                  />
                  <XAxis dataKey="direito" type="number" hide />

                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />

                  <Bar dataKey="direito" layout="vertical" fill="var(--color-desktop)" radius={4}>
                     <LabelList
                        dataKey="membro"
                        position="insideLeft"
                        offset={8}
                        className="fill-(--color-label)"
                        fontSize={12}
                     />
                     <LabelList
                        dataKey="direito"
                        position="right"
                        offset={8}
                        className="fill-foreground"
                        fontSize={12}
                     />
                  </Bar>

                  <Bar dataKey="esquerdo" layout="vertical" fill="var(--color-desktop)" radius={4}>
                     <LabelList
                        dataKey="membro"
                        position="insideLeft"
                        offset={8}
                        className="fill-(--color-label)"
                        fontSize={12}
                     />
                     <LabelList
                        dataKey="esquerdo"
                        position="right"
                        offset={8}
                        className="fill-foreground"
                        fontSize={12}
                     />
                  </Bar>
               </BarChart>
            </ChartContainer>
         </CardContent>
      </Card>
   );
}

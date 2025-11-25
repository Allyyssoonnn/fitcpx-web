import { startTour } from "@/../tours/driverInstance";
import { getToursInfo } from "@/api/companies";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { useQuery } from "react-query";

type TourProps = {
   title: string;
   description: string;
   complete: boolean;
   tourName: string;
};

export default function TourDash() {
   const { data: tours } = useQuery<TourProps[]>({
      queryKey: ["tours"],
      queryFn: getToursInfo,
      initialData: [],
   });

   return (
      <Card className="py-0">
         <CardContent>
            <Accordion type="multiple">
               <AccordionItem value="item-1">
                  <AccordionTrigger className="w-full" type="button">
                     <Label>
                        <CardDescription>
                           {tours.filter((t) => !t.complete).length > 0 && (
                              <Badge variant="destructive" className="mr-2">
                                 {tours.filter((t) => !t.complete).length}
                              </Badge>
                           )}
                           Conclua as etapas e conheça o <span className="text-primary">FitCpx</span>
                        </CardDescription>
                     </Label>
                  </AccordionTrigger>

                  <AccordionContent className="max-h-[40vh] overflow-auto">
                     {tours.map((tour, index) => (
                        <Item variant="outline" className="pb-0 pt-3 mt-2">
                           <ItemContent>
                              <ItemTitle>
                                 {tour.complete ? (
                                    <Badge>Concluido</Badge>
                                 ) : (
                                    <Badge variant="destructive">Não concluido</Badge>
                                 )}
                                 {tour.title}
                              </ItemTitle>
                              <ItemDescription>{tour.description}</ItemDescription>
                           </ItemContent>

                           <ItemActions>
                              <Button
                                 disabled={tour.complete}
                                 size="sm"
                                 onClick={() => {
                                    document
                                       .querySelectorAll('[data-state="open"]')
                                       .forEach((el) => el.dispatchEvent(new Event("click", { bubbles: true })));

                                    startTour(tour.tourName);
                                 }}
                              >
                                 Iniciar tour
                              </Button>
                           </ItemActions>
                        </Item>
                     ))}
                  </AccordionContent>
               </AccordionItem>
            </Accordion>
         </CardContent>
      </Card>
   );
}

import { Calendar, MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Vaccination } from "@/types";

interface VaccinationCardProps {
  vaccination: Vaccination;
  onDelete: (id: string) => void;
  onViewDetail: (vaccination: Vaccination) => void;
}

export function VaccinationCard({
  vaccination,
  onDelete,
  onViewDetail,
}: VaccinationCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{vaccination.name}</CardTitle>
        <CardDescription>
          <div className="flex items-center mt-1 space-x-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {new Date(vaccination.date).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm">{vaccination.location}</span>
          </div>
          {vaccination.notes && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Ghi chú:</span> {vaccination.notes}
            </p>
          )}
          {vaccination.nextDose && (
            <div className="pt-1">
              <Badge
                variant="secondary"
                className="flex items-center space-x-1 w-fit"
              >
                <Calendar className="h-3 w-3" />
                <span>
                  Liều tiếp theo:{" "}
                  {new Date(vaccination.nextDose).toLocaleDateString("vi-VN")}
                </span>
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 pb-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => onViewDetail(vaccination)}
        >
          Xem chi tiết
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => onDelete(vaccination.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

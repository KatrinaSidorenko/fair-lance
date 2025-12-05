import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, User } from "lucide-react";
import Link from "next/link";

interface JobCardProps {
  id: string;
  title: string;
  client: string;
  payment: string;
  deadline: string;
  category: string;
  description: string;
}

export function JobCard({
  id,
  title,
  client,
  payment,
  deadline,
  category,
  description,
}: JobCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{client}</span>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                {category}
              </span>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 font-semibold text-green-600 dark:text-green-500">
              <DollarSign className="h-4 w-4" />
              <span>{payment} ETH</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{deadline}</span>
            </div>
          </div>
        </div>
        <Button asChild className="w-full">
          <Link href={`/jobs/${id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

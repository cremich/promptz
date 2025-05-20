import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface BenefitCardProps {
  title: string;
  content: string;
  icon: LucideIcon;
  cta?: {
    href: string;
    text: string;
  };
}

export default function BenefitCard({
  title,
  content,
  icon: Icon,
  cta,
}: BenefitCardProps) {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="items-center flex flex-col">
          <Icon className="w-12 h-12 text-violet-500 mb-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-zinc-400">{content}</CardContent>
      {cta && (
        <CardFooter className="justify-center">
          <Link
            href={cta.href}
            className="px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors"
          >
            {cta.text}
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}

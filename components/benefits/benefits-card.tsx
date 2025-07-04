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
    <Card className="h-full bg-gradient-to-br from-neutral-800 to-neutral-900 border-neutral-700 hover:border-violet-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-violet-500/20">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors">
          <Icon className="w-12 h-12 text-violet-500 mb-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
      {cta && (
        <CardFooter>
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

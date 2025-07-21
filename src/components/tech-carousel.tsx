import { Badge } from "@/src/components/ui/badge";
import { Code, Zap } from "lucide-react";

export default function TechCarousel() {
  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Stack de Tecnologias</h2>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <Badge variant="secondary" className="text-sm">
            <Code className="h-3 w-3 mr-1" />
            TypeScript
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <Zap className="h-3 w-3 mr-1" />
            ShadCN
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Tailwind CSS
          </Badge>
          <Badge variant="secondary" className="text-sm">
            React-Hook-Form
          </Badge>
          <Badge variant="secondary" className="text-sm">
            React-Query
          </Badge>
        </div>
      </div>
    </div>
  );
}

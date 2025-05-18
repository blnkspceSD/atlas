import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";

export function ButtonDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Button>
        <Archive className="-ms-1 me-2 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
        Default Button
      </Button>
      
      <Button variant="destructive">Destructive Button</Button>
      
      <Button variant="outline">Outline Button</Button>
      
      <Button variant="secondary">Secondary Button</Button>
      
      <Button variant="ghost">Ghost Button</Button>
      
      <Button variant="link">Link Button</Button>
      
      <div className="flex gap-2">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">
          <Archive size={16} />
        </Button>
      </div>
    </div>
  );
} 
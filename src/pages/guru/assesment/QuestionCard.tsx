// src/components/builder/editors/QuestionCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2 } from 'lucide-react';

interface QuestionCardProps {
  index: number;
  typeLabel: string;
  onRemove: () => void;
  children: React.ReactNode;
}

export default function QuestionCard({ index, typeLabel, onRemove, children }: QuestionCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow border-neutral-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 bg-neutral-50 border-b">
        <CardTitle className="text-xl font-bold">
          Soal #{index + 1}
          <span className="ml-3 text-sm font-normal text-neutral-500">({typeLabel})</span>
        </CardTitle>
        <Button variant="destructive" size="sm" type="button" onClick={onRemove}>
          <Trash2 className="h-4 w-4 mr-2" /> Hapus
        </Button>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {children}
      </CardContent>
    </Card>
  );
}
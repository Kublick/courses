import { Card, CardHeader } from "@/components/ui/card";
import { GripVertical } from "lucide-react";
import React from "react";

const EmptyLecture = () => {
  return (
    <Card className="border-red-400 bg-red-200">
      <CardHeader>
        <div className="flex items-center justify-between space-x-8">
          <div className="flex items-center space-x-2">
            <GripVertical size={20} className="cursor-grab text-gray-500" />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default EmptyLecture;

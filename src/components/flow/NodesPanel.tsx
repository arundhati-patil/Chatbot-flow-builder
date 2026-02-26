import { MessageSquare } from 'lucide-react';

// Nodes Panel: displays draggable node types
// Extensible — add new node types here in the future
const NodesPanel = () => {
  // Handle drag start — sets the node type in the drag event
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
        Nodes
      </h3>

      {/* Message Node - drag to add */}
      <div
        className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-4 cursor-grab transition-colors hover:border-primary hover:bg-secondary/50 active:cursor-grabbing"
        onDragStart={(e) => onDragStart(e, 'textNode')}
        draggable
      >
        <MessageSquare className="text-primary" size={24} />
        <span className="text-sm font-medium text-foreground">Message</span>
      </div>
    </div>
  );
};

export default NodesPanel;

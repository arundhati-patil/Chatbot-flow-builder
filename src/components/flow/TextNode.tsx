import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { MessageSquare } from 'lucide-react';

// Custom Text Node component for the flow builder
// Displays a message card with source and target handles
const TextNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={`min-w-[200px] max-w-[260px] rounded-lg border-2 shadow-md transition-shadow ${
        selected
          ? 'border-node-selected shadow-lg'
          : 'border-node-border shadow-sm'
      }`}
      style={{ backgroundColor: 'hsl(var(--node-bg))' }}
    >
      {/* Node Header */}
      <div
        className="flex items-center gap-2 rounded-t-md px-3 py-2"
        style={{
          backgroundColor: 'hsl(var(--node-header))',
          color: 'hsl(var(--node-header-foreground))',
        }}
      >
        <MessageSquare size={14} />
        <span className="text-xs font-semibold">Send Message</span>
      </div>

      {/* Node Body */}
      <div className="px-3 py-3">
        <p className="text-sm text-foreground break-words">
          {data.label || 'New message'}
        </p>
      </div>

      {/* Target Handle (input) - top */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !border-2 !border-node-header !bg-card"
      />

      {/* Source Handle (output) - bottom */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !border-2 !border-node-header !bg-card"
      />
    </div>
  );
});

TextNode.displayName = 'TextNode';

export default TextNode;

import { ArrowLeft } from 'lucide-react';
import { Node } from 'reactflow';

interface SettingsPanelProps {
  selectedNode: Node;
  onTextChange: (id: string, text: string) => void;
  onDeselect: () => void;
}

// Settings Panel: replaces Nodes Panel when a node is selected
// Allows editing the text content of the selected node
const SettingsPanel = ({ selectedNode, onTextChange, onDeselect }: SettingsPanelProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header with back button */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <button
          onClick={onDeselect}
          className="rounded-md p-1 transition-colors hover:bg-secondary"
          aria-label="Back to nodes"
        >
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <h3 className="text-sm font-semibold text-foreground">Message</h3>
      </div>

      {/* Text editing area */}
      <div className="p-4">
        <label
          htmlFor="node-text"
          className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider"
        >
          Text
        </label>
        <textarea
          id="node-text"
          value={selectedNode.data.label || ''}
          onChange={(e) => onTextChange(selectedNode.id, e.target.value)}
          className="w-full min-h-[100px] rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
          placeholder="Enter your message..."
        />
      </div>
    </div>
  );
};

export default SettingsPanel;

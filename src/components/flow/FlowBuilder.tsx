import { useCallback, useRef, useState, useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  ReactFlowProvider,
  ReactFlowInstance,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';

import TextNode from './TextNode';
import NodesPanel from './NodesPanel';
import SettingsPanel from './SettingsPanel';
import { toast } from 'sonner';

// Unique ID generator for nodes
let nodeId = 0;
const getId = () => `node_${++nodeId}`;

const FlowBuilder = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Register custom node types
  const nodeTypes = useMemo(() => ({ textNode: TextNode }), []);

  // Handle new edge connections
  // Enforce: only one edge per source handle
  const onConnect = useCallback(
    (params: Connection) => {
      const existingEdge = edges.find(
        (e) => e.source === params.source && e.sourceHandle === params.sourceHandle
      );
      if (existingEdge) {
        toast.error('Source handle can only have one outgoing edge');
        return;
      }
      setEdges((eds) => addEdge({ ...params, animated: true }, eds));
    },
    [edges, setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
    },
    []
  );

  // Deselect node (back to Nodes Panel)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Update text of a node from settings panel
  const onTextChange = useCallback(
    (id: string, text: string) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, label: text } } : n
        )
      );
      setSelectedNode((prev) =>
        prev && prev.id === id
          ? { ...prev, data: { ...prev.data, label: text } }
          : prev
      );
    },
    [setNodes]
  );

  // Handle drop — create a new text node at drop position
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowInstance || !reactFlowWrapper.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: 'New message' },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes]
  );

  // Save flow — validate that at most one node has empty target handles
  const onSave = useCallback(() => {
    if (nodes.length <= 1) {
      toast.success('Flow saved successfully!');
      return;
    }

    // Find nodes that have no incoming edges (empty target handles)
    const nodesWithTarget = new Set(edges.map((e) => e.target));
    const nodesWithoutTarget = nodes.filter((n) => !nodesWithTarget.has(n.id));

    if (nodesWithoutTarget.length > 1) {
      toast.error('Cannot save flow: more than one node has an empty target handle');
      return;
    }

    toast.success('Flow saved successfully!');
  }, [nodes, edges]);

  return (
    <div className="flex h-screen w-full">
      {/* Canvas area */}
      <div className="flex-1 h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-canvas"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(var(--canvas-dot))" />
          <Controls />
          <MiniMap
            nodeColor={() => 'hsl(var(--primary))'}
            maskColor="hsl(var(--background) / 0.7)"
          />
        </ReactFlow>
      </div>

      {/* Right sidebar: Nodes Panel or Settings Panel */}
      <aside className="w-[280px] border-l border-panel-border bg-panel flex flex-col">
        {/* Top bar with Save button */}
        <div className="flex items-center justify-end border-b border-border px-4 py-3">
          <button
            onClick={onSave}
            className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Save Changes
          </button>
        </div>

        {/* Conditional panel */}
        <div className="flex-1 overflow-y-auto">
          {selectedNode ? (
            <SettingsPanel
              selectedNode={selectedNode}
              onTextChange={onTextChange}
              onDeselect={onPaneClick}
            />
          ) : (
            <NodesPanel />
          )}
        </div>
      </aside>
    </div>
  );
};

// Wrap with provider for React Flow context
const FlowBuilderWithProvider = () => (
  <ReactFlowProvider>
    <FlowBuilder />
  </ReactFlowProvider>
);

export default FlowBuilderWithProvider;

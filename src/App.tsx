import ReactFlow, {
    addEdge,
    Background,
    Connection,
    Controls,
    Edge,
    getIncomers,
    getOutgoers,
    IsValidConnection,
    MarkerType,
    MiniMap,
    Node,
    OnNodesDelete,
    Panel,
    useEdgesState,
    useNodesState,
    useReactFlow
} from 'reactflow';

import 'reactflow/dist/style.css';

import ButtonEdge from './ButtonEdge';
import Sidebar from './Sidebar';
import {DragEventHandler, useCallback, useMemo, useRef} from "react";
import {StageInputNode} from "./nodes/StageInputNode.tsx";
import {StageDefaultNode} from "./nodes/StageDefaultNode.tsx";
import {StageOutputNode} from "./nodes/StageOutputNode.tsx";
import {Button, message} from "antd";
import {useAvailableOptions, useStoreActions} from "./store.ts";


const chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

const stages = chars.map(char => ({value: char, label: `Этап ${char}`}))

const edgeTypes = {
    buttonedge: ButtonEdge,
};


const nodeTypes = {
    stageInput: StageInputNode,
    stageDefault: StageDefaultNode,
    stageOutput: StageOutputNode
}
const initNodes: Node[] = [
    // {
    //     id: 'a',
    //     data: {label: 'Node A'},
    //     position: {x: 250, y: 0},
    // },
    // {
    //     id: 'b',
    //     data: {label: 'Node B'},
    //     position: {x: 100, y: 100},
    // },
];

const initEdges: Edge[] = [
    // {
    //     id: 'a-b',
    //     source: 'a',
    //     target: 'b',
    //     type: 'buttonedge'
    // },
];

const getId = () => `${Date.now()}`;


function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
    const reactFlowWrapper = useRef(null);
    const reactFlow = useReactFlow();


    const hasFinalStage = useMemo(() => {
        return nodes.some(node => node.type === 'stageOutput')
    }, [nodes])

    const hasInitialState = useMemo(() => {
        return nodes.some(node => node.type === 'stageInput')
    }, [nodes])

    const onSave = () => {
        console.log({nodes, edges, hasFinalStage})

        if (!hasInitialState) {
            return message.error('Должен присутствовать начальный этап.')
        }

        if (!hasFinalStage) {
            return message.error('Должен присутствовать финальный этап.')
        }

        const hasOutgoers = (node: Node) => !!getOutgoers(node, nodes, edges).length
        const hasIncomers = (node: Node) => !!getIncomers(node, nodes, edges).length

        const showNoEdgesError = () => message.error('Все связи должны быть установлены')

        const isValidConnections = nodes.every(node => {
            switch (node.type) {
                case 'stageInput':
                    if (!hasOutgoers(node)) {
                        showNoEdgesError();
                        return false
                    }
                    break
                case 'stageDefault':
                    if (!hasOutgoers(node) || !hasIncomers(node)) {
                        showNoEdgesError()
                        return false
                    }
                    break
                case 'stageOutput':
                    if (!hasIncomers(node)) {
                        showNoEdgesError()
                        return false
                    }
                    break
            }
            return true

        })


        if (isValidConnections) {
            message.success('Успешно сохранено!')
        }
    }

    const {deleteOption} = useStoreActions()

    const onNodesDelete: OnNodesDelete = useCallback((nodes) => {
        nodes.forEach(node => deleteOption(node.id))
    }, [deleteOption])

    const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
    const onDragOver: DragEventHandler = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop: DragEventHandler = useCallback(
        (event) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlow.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const newNode = {
                id: getId(),
                type,
                position,
                data: {label: `${type} node`, options: stages},
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlow, setNodes],
    );

    const {getNodes, getEdges} = useReactFlow();
    const isValidConnection: IsValidConnection = useCallback(
        (connection) => {
            console.log({connection})
            // we are using getNodes and getEdges helpers here
            // to make sure we create isValidConnection function only once
            const nodes = getNodes();
            const edges = getEdges();
            const target = nodes.find((node) => node.id === connection.target);
            const hasCycle = (node: Node, visited = new Set()) => {
                if (visited.has(node.id)) return false;

                visited.add(node.id);


                for (const outgoer of getOutgoers(node, nodes, edges)) {
                    if (outgoer.id === connection.source) return true;
                    if (hasCycle(outgoer, visited)) return true;
                }
            };

            if (target?.id === connection.source) return false;
            return !hasCycle(target as Node);
        },
        [getNodes, getEdges],
    );

    const availableOptions = useAvailableOptions()

    return (
        <div className="dndflow">
            <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    onNodesChange={onNodesChange}
                    onNodesDelete={onNodesDelete}
                    edges={edges}
                    defaultEdgeOptions={{type: 'buttonedge', markerEnd: {type: MarkerType.Arrow}}}
                    onConnect={onConnect}
                    onEdgesChange={onEdgesChange}
                    edgeTypes={edgeTypes}
                    nodeTypes={nodeTypes}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    isValidConnection={isValidConnection}
                    fitView
                >
                    <Panel position="top-left">
                        <Button onClick={onSave} type="primary">Сохранить</Button>
                    </Panel>
                    <Background/>
                    <Controls/>
                    <MiniMap/>
                </ReactFlow>
            </div>
            <Sidebar isAllDisabled={!availableOptions.length} isOutputDisabled={hasFinalStage}/>
        </div>
    );
}

export default App;

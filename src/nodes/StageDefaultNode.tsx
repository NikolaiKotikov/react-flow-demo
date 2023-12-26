import {memo} from "react";
import {TCustomNodeProps} from '../types.tsx'
import {NodeBody} from "./NodeBody.tsx";
import {Handle, Position} from "reactflow";

export const StageDefaultNode = memo((props: TCustomNodeProps) => {
    const {isConnectable, ...restProps} = props
    return (
        <NodeBody isConnectable={isConnectable} {...restProps}>
            <Handle type={"target"} position={Position.Top} isConnectable={isConnectable}/>
            <Handle type={"source"} position={Position.Bottom} isConnectable={isConnectable}/>
        </NodeBody>
    )
})

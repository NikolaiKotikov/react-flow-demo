import {memo} from "react";
import {Handle, Position} from "reactflow";
import {TCustomNodeProps} from "../types.tsx";
import {NodeBody} from "./NodeBody.tsx";

export const StageOutputNode = memo((props: TCustomNodeProps) => {

    const {isConnectable, ...restProps} = props
    return (
        <NodeBody isConnectable={isConnectable} {...restProps}>
            <Handle type={"target"} position={Position.Top} isConnectable={isConnectable}/>
        </NodeBody>
    )
})

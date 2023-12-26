import {memo} from "react";
import {Handle, Position} from "reactflow";
import {TCustomNodeProps} from "../types.tsx";
import {NodeBody} from "./NodeBody.tsx";

export const StageInputNode = memo((props: TCustomNodeProps) => {

    const {isConnectable, ...restProps} = props
    return (
        <NodeBody isConnectable={isConnectable} {...restProps}>
            <Handle type={"source"} position={Position.Bottom} isConnectable={isConnectable}/>
        </NodeBody>
    )
})

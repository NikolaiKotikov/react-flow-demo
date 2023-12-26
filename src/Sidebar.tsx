import {TNodeType} from "./types.tsx";
import {DragEvent} from "react";
import {Button} from 'antd';

interface ISidebarProps {
    isOutputDisabled: boolean
    isAllDisabled: boolean
}

export default (props: ISidebarProps) => {
    const {isOutputDisabled, isAllDisabled} = props
    const onDragStart = (event: DragEvent, nodeType: TNodeType) => {
        if (event.dataTransfer) {
            event.dataTransfer.setData('application/reactflow', nodeType);
            event.dataTransfer.effectAllowed = 'move';
        }
    };

    const isDisabledOutput = isOutputDisabled || isAllDisabled

    return (
        <aside>
            <strong className="description">Перетащите один из типов этапа на холст сверху</strong>
            <div className="dndcontrols">
                <Button disabled={isAllDisabled} type={'dashed'} size={'large'} className="dndnode input"
                        onDragStart={(event) => onDragStart(event, 'stageInput')} draggable={!isAllDisabled}>
                    Начальный этап
                </Button>
                <Button disabled={isAllDisabled} type={'dashed'} size={'large'} className="dndnode"
                        onDragStart={(event) => onDragStart(event, 'stageDefault')} draggable={!isAllDisabled}>
                    Промежуточный этап
                </Button>
                <Button disabled={isDisabledOutput} type={'dashed'} size={'large'} className="dndnode output"
                        onDragStart={(event) => onDragStart(event, 'stageOutput')} draggable={!isDisabledOutput}>
                    Финальный этап
                </Button>
            </div>
        </aside>
    );
};

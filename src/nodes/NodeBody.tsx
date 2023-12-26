import {useReactFlow} from "reactflow";
import {Select} from "antd";
import {DeleteTwoTone} from "@ant-design/icons";
import {TCustomNodeProps} from "../types.ts";
import {FC, PropsWithChildren, useCallback, useEffect} from "react";
import {useAvailableOptions, useChosenOptions, useStoreActions} from "../store.ts";

interface INodeBodyProps extends TCustomNodeProps, PropsWithChildren {
}

export const NodeBody: FC<INodeBodyProps> = (props) => {
    const {children, id} = props

    const availableOptions = useAvailableOptions()
    const chosenOptions = useChosenOptions()
    const {addOption} = useStoreActions()

    const defaultValue = chosenOptions[id] || availableOptions?.[0]?.value || ''


    const {deleteElements} = useReactFlow();
    const handleDelete = () => {
        deleteElements({nodes: [{id}]})
    }

    const handleChange = useCallback((value: string) => {
        addOption(id, value)
    }, [addOption, id]);

    useEffect(() => {
        handleChange(defaultValue)
    }, [])

    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <div className="custom-node">
            {children}
            <div>
                <Select
                    showSearch
                    optionFilterProp='children'
                    status=''
                    defaultValue={defaultValue}
                    size={"small"}
                    defaultActiveFirstOption={true}
                    className="nodrag"
                    style={{width: 120}}
                    onChange={handleChange}
                    options={availableOptions}
                    filterOption={filterOption}
                />
            </div>
            <button className="nodrag" onClick={handleDelete}><DeleteTwoTone/></button>
        </div>

    )
}

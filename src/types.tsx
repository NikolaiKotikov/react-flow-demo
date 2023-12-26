export type TNodeType = 'stageInput' | 'stageDefault' | 'stageOutput'

export type TCustomNodeProps = {
    id: string
    isConnectable: boolean
    data: {
        options: { value: string, label: string }[]
    }
}

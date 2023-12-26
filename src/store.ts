import {create, useStore} from 'zustand';

const chars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
// const chars = ['A', 'B', 'C']

const stages = chars.map(char => ({value: char, label: `Этап ${char.toUpperCase()}`}))

type TOption = { label: string, value: string }

type TStore = {
    initialOptions: TOption[]
    chosen: Record<string, string>
    addOption: (id: string, value: string) => void
    deleteOption: (id: string) => void
}

const store = create<TStore>((setState) => ({
    initialOptions: stages,
    chosen: {},
    addOption: (id, value) => {
        setState(state => ({chosen: {...state.chosen, [id]: value}}))
    },
    deleteOption: (id) => {
        setState(state => {
            const copy = {...state.chosen}
            delete copy[id]
            return {chosen: copy}
        })
    }
}))

export const useAvailableOptions = () => useStore(store, state => {
    return state.initialOptions.filter(opt => !Object.values(state.chosen).includes(opt.value))
})

export const useChosenOptions = () => useStore(store, state => state.chosen)

export const useStoreActions = () => {
    return {
        addOption: store.getState().addOption,
        deleteOption: store.getState().deleteOption
    }
}

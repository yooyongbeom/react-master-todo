import { atom, selector } from 'recoil';

export enum Categories {
  'TO_DO', // = "TO_DO", 이렇게 값을 줄수도 있다
  'DOING',
  'DONE',
}

export interface IToDo {
  text: string;
  id: number;
  category: Categories;
}

export const categoryState = atom<Categories>({
  key: 'category',
  default: Categories.TO_DO,
});

export const toDoState = atom<IToDo[]>({
  key: 'toDo',
  default: [],
});

export const toDoSelector = selector({
  key: 'toDoSelector',
  get: ({ get }) => {
    const toDos = get(toDoState);
    const category = get(categoryState);
    // return [
    //   toDos.filter((toDo) => toDo.category === 'TO_DO'),
    //   toDos.filter((toDo) => toDo.category === 'DOING'),
    //   toDos.filter((toDo) => toDo.category === 'DONE'),
    // ];
    return toDos.filter((toDo) => toDo.category === category);
  },
});

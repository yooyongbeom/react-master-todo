import { atom, selector } from 'recoil';

export const minutesState = atom({
  key: 'minutes',
  default: 0,
});

// 타입스크립트가 못찾으면 <number>
export const hoursSelector = selector({
  key: 'hours',
  get: ({ get }) => {
    const minutes = get(minutesState);
    return minutes / 60;
  },
  set: ({ set }, newValue) => {
    const minutes = Number(newValue) * 60;
    set(minutesState, minutes);
  },
});

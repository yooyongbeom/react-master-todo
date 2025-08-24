import { useRecoilState, useRecoilValue } from 'recoil';
import { hoursSelector, minutesState } from './atoms';
import React from 'react';

const App = () => {
  const [minutes, setMinutes] = useRecoilState(minutesState);
  const [hours, setHours] = useRecoilState(hoursSelector);
  const onMinutesChange = (evt: React.FormEvent<HTMLInputElement>) => {
    setMinutes(+evt.currentTarget.value);
  };
  const onHoursChange = (evt: React.FormEvent<HTMLInputElement>) => {
    setHours(+evt.currentTarget.value);
  };
  return (
    <div>
      <input value={minutes} onChange={onMinutesChange} type="number" placeholder="Minutes" />
      <input type="number" onChange={onHoursChange} value={hours} placeholder="Hours" />
    </div>
  );
};

export default App;

import { useState } from 'react';
import { useForm } from 'react-hook-form';
const ToDoList = () => {
  // 기존 지루한 방법
  //   const [toDo, setToDo] = useState('');
  //   const [toDoErr, setToDoErr] = useState('');
  //   const onChange = (evt: React.FormEvent<HTMLInputElement>) => {
  //     const {
  //       currentTarget: { value },
  //     } = evt;
  //     setToDoErr('');
  //     setToDo(value);
  //   };
  //   const onSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
  //     evt.preventDefault();
  //     if (toDo.length < 10) {
  //       setToDoErr('To do should be longer');
  //     }
  //   };
  //   return (
  //     <div>
  //       <form onSubmit={onSubmit}>
  //         <input onChange={onChange} value={toDo} placeholder="write a to do" />
  //         <button>Add</button>
  //         {toDoErr !== '' ? toDoErr : null}
  //       </form>
  //     </div>
  //   );

  // react-hook-form
  const { register, watch } = useForm();
  console.log(watch());
  return (
    <div>
      <form>
        <input {...register('email')} placeholder="Email" />
        <input {...register('firstName')} placeholder="First Name" />
        <input {...register('lastName')} placeholder="Last Name" />
        <input {...register('userName')} placeholder="Username" />
        <input {...register('password')} placeholder="Password" />
        <input {...register('password1')} placeholder="Password1" />
        <button>Add</button>
      </form>
    </div>
  );
};

export default ToDoList;

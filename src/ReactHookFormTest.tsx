import { error } from 'console';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface IForm {
  email: string;
  firstName: string;
  lastName?: string;
  userName: string;
  password: string;
  password1: string;
  extraError?: string;
}

const ReactHookFromTest = () => {
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
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<IForm>({
    defaultValues: {
      email: '@naver.com',
    },
  });

  const onValid = (data: IForm) => {
    //console.log('data', data);
    if (data.password !== data.password1) {
      setError('password1', { message: 'Password are not the same' }, { shouldFocus: true });
    }
    //setError('extraError', { message: 'Server Offline.' });
  };
  //console.log(watch());

  console.log('errors', errors);
  return (
    <div>
      <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit(onValid)}>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Za-z0-9._%+-]+@naver.com$/,
              message: 'Only naver.com emails allowed',
            },
          })}
          placeholder="Email"
        />
        <span>{errors.email?.message}</span>
        <input
          {...register('firstName', {
            required: 'First Name is Required',
            //validate: (val) => (val.includes('yyb') ? 'no yybs allowed' : true),
            validate: {
              noYyb: (val) => (val.includes('yyb') ? 'no yybs allowed' : true),
              nohaha: (val) => (val.includes('haha') ? 'no haha allowed' : true),
            },
          })}
          placeholder="First Name"
        />
        <span>{errors.firstName?.message}</span>
        <input
          {...register('lastName', { required: 'Last Name is Required' })}
          placeholder="Last Name"
        />
        <span>{errors.lastName?.message}</span>
        <input
          {...register('userName', { required: 'User Name is Required', minLength: 10 })}
          placeholder="Username"
        />
        <span>{errors.userName?.message}</span>
        <input
          {...register('password', {
            required: 'Password is Required',
            minLength: {
              value: 5,
              message: 'Your Password is too short.',
            },
          })}
          placeholder="Password"
        />
        <span>{errors.password?.message}</span>
        <input
          {...register('password1', {
            required: 'Password1 is Required',
            minLength: {
              value: 5,
              message: 'Your Password1 is too short.',
            },
          })}
          placeholder="Password1"
        />
        <span>{errors.password1?.message}</span>
        <button>Add</button>
        <span>{errors.extraError?.message}</span>
      </form>
    </div>
  );
};

export default ReactHookFromTest;

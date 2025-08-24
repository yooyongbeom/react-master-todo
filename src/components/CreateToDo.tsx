import { useForm } from 'react-hook-form';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { categoryState, toDoState } from '../atoms';

interface IForm {
  toDo: string;
}

const CreateToDo = () => {
  const setTodos = useSetRecoilState(toDoState);
  const category = useRecoilValue(categoryState);

  const { register, handleSubmit, setValue } = useForm<IForm>();
  const handleValid = (data: IForm) => {
    console.log('add to do', data.toDo);
    setTodos((oldToDos) => [{ text: data.toDo, id: Date.now(), category }, ...oldToDos]);
    setValue('toDo', '');
  };
  return (
    <form onSubmit={handleSubmit(handleValid)}>
      <input
        {...register('toDo', { required: 'Please write a To Do' })}
        placeholder="Write a to do"
      />

      <button>Add</button>
    </form>
  );
};

export default CreateToDo;

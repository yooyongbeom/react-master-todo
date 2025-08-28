import React, { useEffect, useRef, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { toDoState } from './atoms';
import Board from './Components/Board';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  align-items: center;
  //background-color: #f5f6fa; // 연한 회색 배경
`;

const AddBoardArea = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  //width: 100%;
  //max-width: 1200px;
`;

const BoardInput = styled.input`
  padding: 8px 12px;
  border: 2px solid #b2bec3;
  border-radius: 6px;
  font-size: 16px;
  flex: 1;
  outline: none;
  width: 300px;
  &:focus {
    border-color: #0984e3;
  }
`;

const AddBoardButton = styled.button`
  padding: 8px 16px;
  background-color: #0984e3;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #0652dd;
  }
`;

const BoardsWrapper = styled.div`
  display: flex;
  flex-direction: column; // input+button 위로, boards 아래
  width: 100%;
  height: 100vh;
  max-width: 1200px;
  margin: 20px auto;
  justify-content: center;
  align-items: center;
  //overflow-x: auto;
  padding-bottom: 10px;
`;

const BoardContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isDragging'].includes(prop),
})<{ isDragging: boolean }>`
  flex: 1 1 0; /* 가용 폭을 균등 분배하면서 필요시 줄어듦 */
  min-width: 0; /* !!! 기본 auto를 0으로 바꿔야 실제로 줄어듦 */
  /* max-width: none;  필요하면 명시 */
  background-color: ${(props) => (props.isDragging ? '#1f96c9' : '#fff')};
  border-radius: 8px;
  transition: background-color 0.2s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 내부 내용이 폭을 밀어내지 않도록 */
  /* 혹시 내부 Board가 고정폭을 갖고 있으면 다음이 방어막이 됩니다 */
  & > * {
    min-width: 0;
    width: 100%;
  }
`;

const Boards = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: stretch;
  flex-wrap: nowrap; /* 한 줄 유지 */
  align-items: stretch;
`;

const BottomBar = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px; /* 휴지통과 버튼 사이 간격 */
  z-index: 1000;
`;

interface TrashProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

const TrashArea = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isDraggingOver', 'isDraggingFromThis'].includes(prop),
})<TrashProps>`
  width: 200px;
  //height: 60px;
  min-height: 150px;
  background-color: ${(props) =>
    props.isDraggingOver ? '#dfe6e9' : props.isDraggingFromThis ? '#b2bec3' : '#dfe6e9'};
  border: 2px dashed #b2bec3;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  transition: background-color 0.3s ease-in-out;
`;

const DeleteAllButton = styled.button`
  padding: 10px 16px;
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #c0392b;
  }
`;

// 배열에서 아이템 이동하는 헬퍼
const moveItemInArray = <T,>(arr: T[], from: number, to: number) => {
  const copy = [...arr];
  const [moved] = copy.splice(from, 1);
  copy.splice(to, 0, moved);
  return copy;
};

/* StrictMode에서는 개발모드에서 포인터가 꼬여 처음에 손모양이 아님  */
const App = () => {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [boardOrder, setBoardOrder] = useState<string[]>([]); // 순서용 배열
  const [brdName, setBrdName] = useState('');
  const [init, setInit] = useState(false); // init을 둬서 깔끔히 처리함
  const inputRef = useRef<HTMLInputElement>(null);

  // LocalStorage Load
  useEffect(() => {
    const savedTodos = localStorage.getItem('gToDos');
    const savedOrder = localStorage.getItem('gBrdOrder');
    if (savedTodos) setToDos(JSON.parse(savedTodos));
    if (savedOrder) setBoardOrder(JSON.parse(savedOrder));
    setInit(true);
  }, [setToDos]);

  // LocalStorage Sync
  useEffect(() => {
    if (!init) return;
    localStorage.setItem('gToDos', JSON.stringify(toDos));
  }, [toDos, init]);

  useEffect(() => {
    if (!init) return;
    localStorage.setItem('gBrdOrder', JSON.stringify(boardOrder));
  }, [boardOrder, init]);

  //   const onDragEnd = (args: any) => {
  //     const { destination, source } = args;
  //   };

  const onDragEnd = (info: DropResult) => {
    // const destIdx = destination?.index as number;
    // const srcIdx = source.index;
    // console.log(destination);
    // console.log(source);
    // console.log(toDos);

    // const x = ['a', 'b', 'c', 'd', 'e', 'f'];
    // const ss = x.splice(srcIdx, 1);
    // console.log(ss);
    //console.log(info);
    const { draggableId, destination, source } = info;

    if (!destination) return;

    /* setToDos((oldToDos) => {
      // 내가 했던거
      // const newToDos = Array.from(oldToDos);
      // const ttoodd = newToDos.splice(srcIdx, 1);
      // newToDos.splice(destIdx, 0, ttoodd[0]);
      // return newToDos;
      
      const copyToDos = [...oldToDos];
      // 1) source.index 에서 delete item
      // console.log('Delete item on', source.index);
      // console.log(copyToDos);
      copyToDos.splice(source.index, 1);
      // console.log('Delete item');
      // console.log(copyToDos);
      // 2) destination.index에 put item
      // console.log('Put back', draggableId, 'on ', destination.index);
      copyToDos.splice(destination?.index, 0, draggableId);
      return copyToDos;
    }); */

    //_setToDos(draggableId, destination, source);

    // 드래그 위치가 동일하면 무시
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    // 휴지통에 드롭 시 삭제
    if (destination.droppableId === 'trashBasket') {
      // 보드
      if (source.droppableId === 'allBoards') {
        setToDos((prev) => {
          const updated = { ...prev };
          delete updated[draggableId];
          return updated;
        });
        setBoardOrder((prev) => prev.filter((id) => id !== draggableId));
      }
      // 카드
      else {
        setToDos((prev) => {
          const boardCopy = [...prev[source.droppableId]];
          boardCopy.splice(source.index, 1);
          return { ...prev, [source.droppableId]: boardCopy };
        });
      }
      return;
    }

    // 보드 이동
    if (source.droppableId === 'allBoards') {
      if (destination.droppableId === 'allBoards') {
        setBoardOrder((prev) => moveItemInArray(prev, source.index, destination.index));
      }
      return;
    } else {
      if (destination.droppableId !== 'allBoards') {
        // 카드 이동
        setToDos((prev) => {
          const sourceBoard = [...prev[source.droppableId]];
          const [task] = sourceBoard.splice(source.index, 1);
          const destBoard = [...prev[destination.droppableId]];
          destBoard.splice(destination.index, 0, task);

          return {
            ...prev,
            [source.droppableId]: sourceBoard,
            [destination.droppableId]: destBoard,
          };
        });
      }
    }
  };

  const handleAddBrd = () => {
    if (!brdName.trim()) {
      alert('please Enter new board name');
      inputRef.current?.focus();
      return;
    }

    // 대소문자 구분없이 체크
    const keysLower = Object.keys(toDos).map((k) => k.toLowerCase());
    if (keysLower.includes(brdName.toLowerCase())) {
      alert(`Board already exists: "${brdName}"`);
      inputRef.current?.focus();
      return;
    }
    setToDos((prev) => ({ ...prev, [brdName]: [] }));
    setBoardOrder((prev) => [...prev, brdName]);
    setBrdName('');
  };

  const handleOnchange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setBrdName(evt.currentTarget.value);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <AppWrapper>
        <BoardsWrapper>
          <AddBoardArea>
            <BoardInput
              value={brdName}
              placeholder="Enter new board name"
              onChange={handleOnchange}
              onKeyDown={(evt: React.KeyboardEvent<HTMLInputElement>) => {
                if (evt.key === 'Enter') {
                  handleAddBrd();
                }
              }}
              ref={inputRef}
            />
            <AddBoardButton onClick={handleAddBrd}>추가</AddBoardButton>
          </AddBoardArea>
          <Droppable droppableId="allBoards" direction="horizontal">
            {(dropProvided, dropSnapshot) => (
              <Boards ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
                {boardOrder.map((boardId, idx) => (
                  <Draggable key={boardId} draggableId={boardId} index={idx}>
                    {(provided, snapshot) => (
                      <BoardContainer
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        isDragging={snapshot.isDragging}
                      >
                        <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
                      </BoardContainer>
                    )}
                  </Draggable>
                ))}
                {dropProvided.placeholder}
              </Boards>
            )}
          </Droppable>
        </BoardsWrapper>
        <BottomBar>
          <Droppable droppableId="trashBasket">
            {(provided, snapshot) => (
              <TrashArea
                isDraggingOver={snapshot.isDraggingOver}
                isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                🗑️ Drop here to delete
                <div style={{ display: 'none' }}>{provided.placeholder}</div>
              </TrashArea>
            )}
          </Droppable>
          <DeleteAllButton
            onClick={() =>
              setToDos(() => {
                setBoardOrder([]);
                return {};
              })
            }
          >
            전체삭제
          </DeleteAllButton>
        </BottomBar>
      </AppWrapper>
    </DragDropContext>
  );
};

export default App;

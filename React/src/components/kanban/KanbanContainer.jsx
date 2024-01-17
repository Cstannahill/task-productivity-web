import React, { useContext, useEffect, useRef, useState } from "react";
import KanbanColumn from "./KanbanColumn";
import AddAnotherForm from "./AddAnotherForm";
import KanbanModal from "./KanbanModal";
import { DragDropContext } from "react-beautiful-dnd";
import IconButton from "../common/IconButton";
import is from "is_js";
import { KanbanContext } from "../../context/appContext";
import taskService from "../../services/taskService";
import toastr from "toastr";
import "../../css/kanban.css";

const KanbanContainer = () => {
  const {
    kanbanState: { kanbanItems, kanbanModal, selectedBoard },
    kanbanDispatch,
  } = useContext(KanbanContext);
  const [showForm, setShowForm] = useState(false);
  const containerRef = useRef(null);

  const handleSubmit = (listData) => {
    if (selectedBoard) {
      const newList = {
        taskBoardId: selectedBoard?.id,
        name: listData.title,
        items: [],
      };
      const onCreateCategorySuccess = (res) => {
        toastr.success("Category created!");
        kanbanDispatch({
          type: "ADD_KANBAN_COLUMN",
          payload: { ...newList, id: res },
        });
      };

      taskService
        .createCategory(newList)
        .then(onCreateCategorySuccess)
        .catch(onCreateCategoryError);

      setShowForm(false);
    } else {
      toastr.error("No current board is selected.");
    }
  };

  const onCreateCategoryError = (err) => {
    toastr.error("Something went wrong.");
  };

  useEffect(() => {
    if (is.ipad()) {
      containerRef.current.classList.add("ipad");
    }

    if (is.mobile()) {
      containerRef.current.classList.add("mobile");
      if (is.safari()) {
        containerRef.current.classList.add("safari");
      }
      if (is.chrome()) {
        containerRef.current.classList.add("chrome");
      }
    }
  }, []);

  const getColumn = (id) => {
    return kanbanItems.find((item) => item.id === Number(id));
  };

  const reorderArray = (array, fromIndex, toIndex) => {
    const newArr = [...array];

    const chosenItem = newArr.splice(fromIndex, 1)[0];
    newArr.splice(toIndex, 0, chosenItem);
    const payload = newArr.map((e, index) => {
      const item = {};
      item.index = index;
      item.categoryId = e.categoryId;
      item.title = e.title;
      item.taskBoardId = selectedBoard.id;
      item.id = e.id;
      item.description = e?.description;
      return item;
    });
    console.log(payload);
    if (fromIndex !== toIndex) {
      taskService
        .reorderTask(payload)
        .then(onUpdateSuccess)
        .catch(onUpdateError);
    }

    return newArr;
  };

  const move = (source, destination) => {
    const sourceItemsClone = [...getColumn(source.droppableId).items];
    const destItemsClone = [...getColumn(destination.droppableId).items];

    const [removedItem] = sourceItemsClone.splice(source.index, 1);
    destItemsClone.splice(destination.index, 0, removedItem);

    return {
      updatedDestItems: destItemsClone,
      updatedSourceItems: sourceItemsClone,
    };
  };
  const onUpdateSuccess = (res) => {
    toastr.success("Updated!");
  };
  const onUpdateError = () => {
    toastr.error("Error updating lists.");
  };

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    const targetSrc = kanbanItems.find(
      (e) => String(e.id) === source.droppableId
    );
    let updateList = false;

    if (!destination) {
      return;
    }

    if (source.droppableId !== destination.droppableId) {
      const payload = { ...targetSrc.items[source.index] };
      payload.categoryId = Number(destination.droppableId);
    }
    if (source.droppableId === destination.droppableId) {
      console.log(source, destination);
      const items = getColumn(source.droppableId).items;
      const column = getColumn(source.droppableId);
      const reorderedItems = reorderArray(
        items,
        source.index,
        destination.index
      );

      kanbanDispatch({
        type: "UPDATE_SINGLE_COLUMN",
        payload: { column, reorderedItems },
      });
    } else {
      const sourceColumn = getColumn(source.droppableId);
      const destColumn = getColumn(destination.droppableId);
      const movedItems = move(source, destination);
      const updateLists = () => {
        movedItems?.updatedDestItems?.forEach((item, index) => {
          item.index = index;
          item.categoryId = Number(destination.droppableId);
          taskService.updateTask(item);
        });
        movedItems?.updatedSourceItems?.forEach((item, index) => {
          item.index = index;
          item.categoryId = Number(source.droppableId);
          taskService.updateTask(item);
        });
        return true;
      };
      kanbanDispatch({
        type: "UPDATE_DUAL_COLUMN",
        payload: {
          sourceColumn,
          updatedSourceItems: movedItems.updatedSourceItems,
          destColumn,
          updatedDestItems: movedItems.updatedDestItems,
        },
      });
      updateList = await updateLists();
      if (updateList) {
        toastr.success("Updated Lists");
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-container me-n3 scrollbar" ref={containerRef}>
        {kanbanItems.map((kanbanColumnItem) => (
          <KanbanColumn
            key={kanbanColumnItem.id}
            kanbanColumnItem={kanbanColumnItem}
          />
        ))}
        <div className="kanban-column">
          <AddAnotherForm
            type="list"
            onSubmit={handleSubmit}
            showForm={showForm}
            setShowForm={setShowForm}
          />
          {!showForm && (
            <IconButton
              variant="secondary"
              className="d-block w-100 border-400 bg-400"
              icon="plus"
              iconClassName="me-1"
              onClick={() => setShowForm(true)}
            >
              Add another list
            </IconButton>
          )}
        </div>
        <KanbanModal show={kanbanModal.show} />
      </div>
    </DragDropContext>
  );
};

export default KanbanContainer;

import { labels } from "../components/kanban/kanbanData";

export const kanbanReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "OPEN_KANBAN_MODAL":
      return {
        ...state,
        kanbanModal: {
          ...state.kanbanModal,
          modalContent: {
            ...state.kanbanModal.modalContent,
            image: payload.image,
            payload,
          },
          show: true,
        },
      };
    case "INIT_USER_BOARDS":
      return {
        ...state,
        userBoards: [...payload],
      };
    case "SELECT_NEW_BOARD":
      return {
        ...state,
        selectedBoard: payload,
      };
    case "INIT_BOARD_MEMBERS":
      return {
        ...state,
        members: [...payload],
      };
    case "ADD_BOARD_LABELS":
      return {
        ...state,
        labels: [...(state?.labels || []), ...(payload || [])],
      };
    case "TOGGLE_KANBAN_MODAL":
      return {
        ...state,
        kanbanModal: {
          ...state.kanbanModal,
          show: !state.kanbanModal.show,
        },
      };

    case "CHANGE_KANBAN_BOARD":
      return {
        ...state,
        kanbanItems: payload,
      };

    case "ADD_KANBAN_COLUMN":
      return {
        ...state,
        kanbanItems: [...state.kanbanItems, payload],
      };

    case "ADD_TASK_CARD":
      return {
        ...state,
        kanbanItems: state.kanbanItems.map((kanbanItem) =>
          kanbanItem.id === payload.targetListId
            ? { ...kanbanItem, items: [...kanbanItem.items, payload.newCard] }
            : kanbanItem
        ),
      };
    case "UPDATE_TASK_CARD":
      return {
        ...state,
        kanbanItems: state.kanbanItems.map((kanbanItem) =>
          kanbanItem.id === payload.categoryId
            ? kanbanItem.items.map((item) =>
                item.id === payload.id ? { ...payload, item } : item
              )
            : kanbanItem
        ),
      };
    case "REMOVE_TASK_CARD":
      return {
        ...state,
        kanbanItems: state.kanbanItems.map((kanbanItem) => {
          return {
            ...kanbanItem,
            items: kanbanItem.items.filter((item) => item.id !== payload.id),
          };
        }),
      };

    case "UPDATE_SINGLE_COLUMN":
      return {
        ...state,
        kanbanItems: state.kanbanItems.map((kanbanItem) =>
          kanbanItem.id === payload.column.id
            ? {
                ...kanbanItem,
                items: [...payload.reorderedItems],
              }
            : kanbanItem
        ),
      };

    case "UPDATE_DUAL_COLUMN":
      return {
        ...state,
        kanbanItems: state.kanbanItems.map((kanbanItem) =>
          kanbanItem.id === payload.sourceColumn.id ||
          kanbanItem.id === payload.destColumn.id
            ? {
                ...kanbanItem,
                items:
                  (kanbanItem.id === payload.sourceColumn.id &&
                    payload.updatedSourceItems) ||
                  (kanbanItem.id === payload.destColumn.id &&
                    payload.updatedDestItems),
              }
            : kanbanItem
        ),
      };

    case "REMOVE_KANBAN_COLUMN":
      return {
        ...state,
        kanbanItems: state.kanbanItems.filter(
          (kanbanItem) => kanbanItem.id !== payload.id
        ),
      };

    default:
      return state;
  }
};
